import { z } from 'zod'

const aiScoreSchema = z.object({
  score: z.number().int().min(1).max(10),
  summary: z.string().trim().min(1),
  matchedSkills: z.array(z.string().trim().min(1)).max(12),
  missingSkills: z.array(z.string().trim().min(1)).max(12),
  concerns: z.array(z.string().trim().min(1)).max(8),
})

export type ResumeScoreResult = z.infer<typeof aiScoreSchema> & {
  model: string
}

type ScoreResumeInput = {
  resumeText: string
  job: {
    title: string
    location: string
    employmentType: string
    description: string
    requiredSkills: string[]
  }
}

const systemPrompt = `You are an applicant screening assistant.
Compare a resume to a single job listing and assign a fit score.
Return only valid JSON.

Rules:
- Score must be an integer from 1 to 10.
- Use evidence from the resume only.
- Do not invent experience, skills, or education.
- Penalize missing required skills and vague or unsupported experience.
- Keep the summary to 1 or 2 sentences.
- matchedSkills and missingSkills should be concise phrases.
- concerns should list concrete gaps or uncertainties.

Rubric:
- 1 to 3: weak match
- 4 to 6: partial match
- 7 to 8: strong match
- 9 to 10: excellent match`

type AiProvider = 'openai' | 'ollama'

function getScoringPrompt(input: ScoreResumeInput) {
  return [
    `Job Title: ${input.job.title}`,
    `Location: ${input.job.location}`,
    `Employment Type: ${input.job.employmentType}`,
    `Required Skills: ${input.job.requiredSkills.join(', ') || 'None provided'}`,
    `Job Description: ${input.job.description}`,
    `Resume Text: ${input.resumeText}`,
  ].join('\n\n')
}

function stripCodeFences(value: string) {
  return value
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
}

function coerceAiList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
  }

  if (typeof value !== 'string') {
    return []
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return []
  }

  try {
    const parsed = JSON.parse(trimmed)

    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  } catch {
    // Fall through to delimiter-based parsing.
  }

  return trimmed
    .split(/\s*[;,\n]\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeAiScorePayload(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  const candidate = payload as Record<string, unknown>

  return {
    ...candidate,
    matchedSkills: coerceAiList(candidate.matchedSkills),
    missingSkills: coerceAiList(candidate.missingSkills),
    concerns: coerceAiList(candidate.concerns),
  }
}

export function serializeAiList(items: string[]) {
  return JSON.stringify(items)
}

export function parseAiList(value: string | null) {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export async function scoreResumeAgainstJob(input: ScoreResumeInput) {
  const runtimeConfig = useRuntimeConfig()
  const provider = (runtimeConfig.aiProvider || 'ollama') as AiProvider

  const resumeText = input.resumeText.trim()

  if (!resumeText) {
    throw new Error('Resume text extraction produced an empty result.')
  }

  const prompt = getScoringPrompt({
    ...input,
    resumeText,
  })

  if (provider === 'ollama') {
    const model = runtimeConfig.ollamaModel || 'llama3.2:3b'
    const baseUrl = (runtimeConfig.ollamaBaseUrl || 'http://127.0.0.1:11434').replace(/\/$/, '')

    const response = await $fetch<{
      message?: {
        content?: string
      }
    }>(`${baseUrl}/api/chat`, {
      method: 'POST',
      body: {
        model,
        stream: false,
        format: 'json',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
    })

    const content = response.message?.content?.trim()

    if (!content) {
      throw new Error('Ollama scoring did not return any content.')
    }

    const parsed = aiScoreSchema.parse(
      normalizeAiScorePayload(JSON.parse(stripCodeFences(content)))
    )

    return {
      ...parsed,
      model,
    } satisfies ResumeScoreResult
  }

  const apiKey = runtimeConfig.openAiApiKey
  const model = runtimeConfig.openAiModel || 'gpt-4o-mini'
  const baseUrl = (runtimeConfig.openAiBaseUrl || 'https://api.openai.com/v1').replace(/\/$/, '')

  if (!apiKey) {
    return null
  }

  const response = await $fetch<{
    choices?: Array<{
      message?: {
        content?: string | Array<{ type?: string; text?: string }>
      }
    }>
  }>(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: {
      model,
      temperature: 0.2,
      response_format: {
        type: 'json_object',
      },
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    },
  })

  const rawContent = response.choices?.[0]?.message?.content
  const content = Array.isArray(rawContent)
    ? rawContent
        .map((part) => ('text' in part ? part.text || '' : ''))
        .join('')
        .trim()
    : rawContent?.trim()

  if (!content) {
    throw new Error('AI scoring did not return any content.')
  }

  const parsed = aiScoreSchema.parse(normalizeAiScorePayload(JSON.parse(stripCodeFences(content))))

  return {
    ...parsed,
    model,
  } satisfies ResumeScoreResult
}
