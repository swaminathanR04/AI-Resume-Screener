import { z } from 'zod'
import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'
import { createAuditLogEntry, getAuditActorName } from '~~/server/utils/audit-log'
import { isAdminUser } from '~~/server/utils/user-role'

const manualScoreSchema = z.object({
  score: z.number().int().min(1).max(10),
  reason: z.string().trim().min(1).max(1000),
})

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

  const body = await readBody(event)
  const parsedBody = manualScoreSchema.safeParse(body)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Manual score must be an integer from 1 to 10 and include a reason.',
    })
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

  const latestApplication = applicant.applications[0]

  if (!latestApplication) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Applicant has no submitted applications to update.',
    })
  }

  if (latestApplication.reviewStatus !== 'new') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only resumes in the New Resumes tab can be manually adjusted.',
    })
  }

  const updatedApplication = await prisma.applicantJobListing.update({
    where: {
      applicantInfoId_jobListingId: {
        applicantInfoId: latestApplication.applicantInfoId,
        jobListingId: latestApplication.jobListingId,
      },
    },
    data: {
      aiScore: parsedBody.data.score,
      adminScoreReason: parsedBody.data.reason,
      adminScoreAt: new Date(),
    },
  })

  await createAuditLogEntry({
    actorType: 'Admin',
    actorName: getAuditActorName(session.user),
    action: 'Resume Score Updated Manually',
    itemType: 'Candidate',
    details: `${applicant.name || applicant.user.email} was assigned a manual score of ${parsedBody.data.score}/10 for ${latestApplication.jobListing.jobTitle}. Reason: ${parsedBody.data.reason}`,
  })

  return {
    reviewStatus: updatedApplication.reviewStatus,
    userId,
    score: updatedApplication.aiScore,
    aiSummary: updatedApplication.aiSummary,
    manualScoreReason: updatedApplication.adminScoreReason,
  }
})
