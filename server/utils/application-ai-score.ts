import { prisma } from '~~/server/utils/prisma'
import { createAuditLogEntry } from '~~/server/utils/audit-log'
import { scoreResumeAgainstJob, serializeAiList } from '~~/server/utils/ai-score'
import { getAiScoringConfig } from '~~/server/utils/ai-config'
import { extractResumeText } from '~~/server/utils/resume-text'

const AI_NOT_CONFIGURED_SUMMARY = 'AI not configured'

type ScoreStoredApplicationInput = {
  applicantInfoId: number
  jobListingId: number
  resumePath: string
}

export async function scoreStoredApplication(input: ScoreStoredApplicationInput) {
  const jobListing = await prisma.jobListing.findUnique({
    where: {
      id: input.jobListingId,
    },
  })

  if (!jobListing) {
    throw new Error('Job listing not found for AI scoring.')
  }

  const resumeText = await extractResumeText(input.resumePath)
  const requiredSkills = JSON.parse(jobListing.requiredSkills) as string[]
  const aiConfig = await getAiScoringConfig()

  let scoreResult: Awaited<ReturnType<typeof scoreResumeAgainstJob>> | null = null

  try {
    scoreResult = await scoreResumeAgainstJob({
      resumeText,
      job: {
        title: jobListing.jobTitle,
        location: jobListing.location,
        employmentType: jobListing.employmentType,
        description: jobListing.jobDescription,
        requiredSkills,
      },
      config: aiConfig,
    })
  } catch (error) {
    console.error('AI scoring unavailable:', error)
  }

  if (!scoreResult) {
    await prisma.applicantJobListing.update({
      where: {
        applicantInfoId_jobListingId: {
          applicantInfoId: input.applicantInfoId,
          jobListingId: input.jobListingId,
        },
      },
      data: {
        reviewStatus: 'new',
        aiScore: null,
        aiSummary: AI_NOT_CONFIGURED_SUMMARY,
        adminScoreReason: null,
        adminScoreAt: null,
        aiMatchedSkills: serializeAiList([]),
        aiMissingSkills: serializeAiList([]),
        aiConcerns: serializeAiList([]),
        aiScoredAt: null,
        aiModel: null,
      },
    })

    await createAuditLogEntry({
      actorType: 'System',
      actorName: 'System',
      action: 'Resume Scored',
      itemType: 'Candidate',
      details: `${jobListing.jobTitle} could not be scored because AI is not configured.`,
    })

    return null
  }

  const scoredApplication = await prisma.applicantJobListing.update({
    where: {
      applicantInfoId_jobListingId: {
        applicantInfoId: input.applicantInfoId,
        jobListingId: input.jobListingId,
      },
    },
    data: {
      reviewStatus: scoreResult.score < aiConfig.minimumScore ? 'rejected' : 'new',
      aiScore: scoreResult.score,
      aiSummary: scoreResult.summary,
      adminScoreReason: null,
      adminScoreAt: null,
      aiMatchedSkills: serializeAiList(scoreResult.matchedSkills),
      aiMissingSkills: serializeAiList(scoreResult.missingSkills),
      aiConcerns: serializeAiList(scoreResult.concerns),
      aiScoredAt: new Date(),
      aiModel: scoreResult.model,
    },
  })

  await createAuditLogEntry({
    actorType: 'System',
    actorName: 'System',
    action: 'Resume Scored',
    itemType: 'Candidate',
    details: `${jobListing.jobTitle} scored at ${scoreResult.score}/10 and routed to ${scoredApplication.reviewStatus}.`,
  })

  return {
    scoredApplication,
    jobListing,
  }
}
