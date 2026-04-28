import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'
import { scoreStoredApplication } from '~~/server/utils/application-ai-score'

type SubmitApplicationBody = {
  jobListingId?: number
}

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<SubmitApplicationBody>(event)
  const jobListingId = Number(body.jobListingId)

  if (!Number.isInteger(jobListingId) || jobListingId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'A valid job listing is required.' })
  }

  const applicantInfo = await prisma.applicantInfo.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      resumePath: true,
    },
  })

  if (!applicantInfo) {
    throw createError({ statusCode: 400, statusMessage: 'Complete your applicant profile first.' })
  }

  if (!applicantInfo.resumePath) {
    throw createError({ statusCode: 400, statusMessage: 'Upload your resume before applying.' })
  }

  const jobListing = await prisma.jobListing.findUnique({
    where: {
      id: jobListingId,
    },
  })

  if (!jobListing) {
    throw createError({ statusCode: 404, statusMessage: 'Job listing not found.' })
  }

  const application = await prisma.applicantJobListing.upsert({
    where: {
      applicantInfoId_jobListingId: {
        applicantInfoId: applicantInfo.id,
        jobListingId,
      },
    },
    update: {
      appliedAt: new Date(),
      reviewStatus: 'new',
      aiScore: null,
      aiSummary: null,
      aiMatchedSkills: null,
      aiMissingSkills: null,
      aiConcerns: null,
      aiScoredAt: null,
      aiModel: null,
    },
    create: {
      applicantInfoId: applicantInfo.id,
      jobListingId,
      reviewStatus: 'new',
    },
  })

  let scoredApplication = application

  try {
    const scoreResult = await scoreStoredApplication({
      applicantInfoId: applicantInfo.id,
      jobListingId,
      resumePath: applicantInfo.resumePath,
    })

    if (scoreResult) {
      scoredApplication = scoreResult.scoredApplication
    }
  } catch (error) {
    console.error('Application AI scoring failed:', error)
  }

  return {
    id: scoredApplication.jobListingId,
    jobId: scoredApplication.jobListingId,
    title: jobListing.jobTitle,
    location: jobListing.location,
    employmentType: jobListing.employmentType,
    appliedAt: scoredApplication.appliedAt,
    applied: scoredApplication.appliedAt,
    resumePath: applicantInfo.resumePath,
  }
})
