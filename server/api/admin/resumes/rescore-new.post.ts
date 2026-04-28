import { auth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/prisma'
import { scoreStoredApplication } from '~~/server/utils/application-ai-score'
import { isAdminUser } from '~~/server/utils/user-role'

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

  const applications = await prisma.applicantJobListing.findMany({
    where: {
      reviewStatus: 'new',
    },
    include: {
      applicantInfo: {
        select: {
          id: true,
          resumePath: true,
        },
      },
    },
  })

  let rescoredCount = 0
  let rejectedCount = 0
  let pendingCount = 0

  for (const application of applications) {
    if (!application.applicantInfo.resumePath) {
      pendingCount += 1
      continue
    }

    const result = await scoreStoredApplication({
      applicantInfoId: application.applicantInfoId,
      jobListingId: application.jobListingId,
      resumePath: application.applicantInfo.resumePath,
    })

    if (!result) {
      pendingCount += 1
      continue
    }

    if (result.scoredApplication.reviewStatus === 'rejected') {
      rejectedCount += 1
    } else {
      rescoredCount += 1
    }
  }

  return {
    total: applications.length,
    rescoredCount,
    rejectedCount,
    pendingCount,
  }
})
