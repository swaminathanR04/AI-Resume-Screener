import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'
import { isAdminUser } from '~~/server/utils/user-role'
import { parseAiList } from '~~/server/utils/ai-score'
import { scoreStoredApplication } from '~~/server/utils/application-ai-score'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (!isAdminUser(session.user)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = getRouterParam(event, 'userId')

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing userId' })
  }

  const applicant = await prisma.applicantInfo.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      applications: {
        include: {
          jobListing: {
            select: {
              jobTitle: true,
            },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
      },
    },
  })

  if (!applicant) {
    throw createError({ statusCode: 404, statusMessage: 'Applicant not found' })
  }

  if (!applicant.resumePath) {
    throw createError({ statusCode: 400, statusMessage: 'Applicant does not have a saved resume.' })
  }

  const latestApplication = applicant.applications[0]

  if (!latestApplication) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Applicant has no submitted applications to re-score.',
    })
  }

  if (latestApplication.reviewStatus !== 'new') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only resumes in the New Resumes tab can be re-scored.',
    })
  }

  const scoreResult = await scoreStoredApplication({
    applicantInfoId: applicant.id,
    jobListingId: latestApplication.jobListingId,
    resumePath: applicant.resumePath,
  })

  if (!scoreResult) {
    return {
      reviewStatus: latestApplication.reviewStatus,
      userId,
      applicantName: applicant.name || applicant.user.email,
      appliedRole: latestApplication.jobListing.jobTitle,
      score: null,
      aiSummary: null,
      aiMatchedSkills: [],
      aiMissingSkills: [],
      aiConcerns: [],
      aiScoredAt: null,
      aiModel: null,
    }
  }

  return {
    reviewStatus: scoreResult.scoredApplication.reviewStatus,
    userId,
    applicantName: applicant.name || applicant.user.email,
    appliedRole: latestApplication.jobListing.jobTitle,
    score: scoreResult.scoredApplication.aiScore,
    aiSummary: scoreResult.scoredApplication.aiSummary,
    aiMatchedSkills: parseAiList(scoreResult.scoredApplication.aiMatchedSkills),
    aiMissingSkills: parseAiList(scoreResult.scoredApplication.aiMissingSkills),
    aiConcerns: parseAiList(scoreResult.scoredApplication.aiConcerns),
    aiScoredAt: scoreResult.scoredApplication.aiScoredAt,
    aiModel: scoreResult.scoredApplication.aiModel,
  }
})
