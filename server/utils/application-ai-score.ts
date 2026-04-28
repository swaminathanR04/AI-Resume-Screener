import { prisma } from '~~/server/utils/prisma'
import { scoreResumeAgainstJob, serializeAiList } from '~~/server/utils/ai-score'
import { getAiScoringConfig } from '~~/server/utils/ai-config'
import { extractResumeText } from '~~/server/utils/resume-text'

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
  const scoreResult = await scoreResumeAgainstJob({
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

  if (!scoreResult) {
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
      aiMatchedSkills: serializeAiList(scoreResult.matchedSkills),
      aiMissingSkills: serializeAiList(scoreResult.missingSkills),
      aiConcerns: serializeAiList(scoreResult.concerns),
      aiScoredAt: new Date(),
      aiModel: scoreResult.model,
    },
  })

  return {
    scoredApplication,
    jobListing,
  }
}
