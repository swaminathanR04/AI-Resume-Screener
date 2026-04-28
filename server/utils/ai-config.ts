import { z } from 'zod'
import { prisma } from '~~/server/utils/prisma'

export const defaultAiScoringConfig = {
  skillsWeight: 40,
  experienceWeight: 30,
  educationWeight: 20,
  portfolioWeight: 10,
  customRules: ['Add a point if applicant is a US Veteran'],
  minimumScore: 6,
} as const

const aiCustomRuleSchema = z.string().trim().min(1).max(160)

export const aiScoringConfigSchema = z
  .object({
    skillsWeight: z.number().int().min(0).max(100),
    experienceWeight: z.number().int().min(0).max(100),
    educationWeight: z.number().int().min(0).max(100),
    portfolioWeight: z.number().int().min(0).max(100),
    customRules: z.array(aiCustomRuleSchema).max(10),
    minimumScore: z.number().int().min(1).max(10),
  })
  .superRefine((value, ctx) => {
    const total =
      value.skillsWeight + value.experienceWeight + value.educationWeight + value.portfolioWeight

    if (total !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Scoring weights must add up to 100%.',
        path: ['skillsWeight'],
      })
    }
  })

export type AiScoringConfigSnapshot = z.infer<typeof aiScoringConfigSchema>

function parseCustomRules(value: string | null) {
  if (!value) {
    return [...defaultAiScoringConfig.customRules]
  }

  try {
    const parsed = JSON.parse(value)
    return aiScoringConfigSchema.shape.customRules.parse(parsed)
  } catch {
    return [...defaultAiScoringConfig.customRules]
  }
}

function serializeCustomRules(value: string[]) {
  return JSON.stringify(value)
}

function toSnapshot(config: {
  skillsWeight: number
  experienceWeight: number
  educationWeight: number
  portfolioWeight: number
  customRules: string | null
  minimumScore: number
}) {
  return aiScoringConfigSchema.parse({
    skillsWeight: config.skillsWeight,
    experienceWeight: config.experienceWeight,
    educationWeight: config.educationWeight,
    portfolioWeight: config.portfolioWeight,
    customRules: parseCustomRules(config.customRules),
    minimumScore: config.minimumScore,
  })
}

export function getDefaultAiScoringConfig() {
  return {
    ...defaultAiScoringConfig,
    customRules: [...defaultAiScoringConfig.customRules],
  }
}

export async function getAiScoringConfig() {
  const existingConfig = await prisma.aiScoringConfig.findUnique({
    where: {
      id: 1,
    },
  })

  if (existingConfig) {
    return toSnapshot(existingConfig)
  }

  const createdConfig = await prisma.aiScoringConfig.create({
    data: {
      id: 1,
      skillsWeight: defaultAiScoringConfig.skillsWeight,
      experienceWeight: defaultAiScoringConfig.experienceWeight,
      educationWeight: defaultAiScoringConfig.educationWeight,
      portfolioWeight: defaultAiScoringConfig.portfolioWeight,
      customRules: serializeCustomRules([...defaultAiScoringConfig.customRules]),
      minimumScore: defaultAiScoringConfig.minimumScore,
    },
  })

  return toSnapshot(createdConfig)
}

export async function updateAiScoringConfig(input: AiScoringConfigSnapshot) {
  const config = aiScoringConfigSchema.parse(input)

  const updatedConfig = await prisma.aiScoringConfig.upsert({
    where: {
      id: 1,
    },
    update: {
      skillsWeight: config.skillsWeight,
      experienceWeight: config.experienceWeight,
      educationWeight: config.educationWeight,
      portfolioWeight: config.portfolioWeight,
      customRules: serializeCustomRules(config.customRules),
      minimumScore: config.minimumScore,
    },
    create: {
      id: 1,
      skillsWeight: config.skillsWeight,
      experienceWeight: config.experienceWeight,
      educationWeight: config.educationWeight,
      portfolioWeight: config.portfolioWeight,
      customRules: serializeCustomRules(config.customRules),
      minimumScore: config.minimumScore,
    },
  })

  return toSnapshot(updatedConfig)
}
