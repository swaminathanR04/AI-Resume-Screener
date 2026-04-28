import { auth } from '~~/server/utils/auth'
import { createAuditLogEntry, getAuditActorName } from '~~/server/utils/audit-log'
import { prisma } from '~~/server/utils/prisma'
import { isAdminUser } from '~~/server/utils/user-role'

type UpdateResumeStatusBody = {
  reviewStatus?: 'advanced' | 'rejected' | 'archived'
}

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

  const body = await readBody<UpdateResumeStatusBody>(event)
  const reviewStatus = body.reviewStatus

  if (!reviewStatus || !['advanced', 'rejected', 'archived'].includes(reviewStatus)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid review status is required.' })
  }

  const applicant = await prisma.applicantInfo.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
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
    throw createError({ statusCode: 404, statusMessage: 'Applicant not found.' })
  }

  const latestApplication = applicant.applications[0]

  if (!latestApplication) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Applicant has no submitted applications to move.',
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
      reviewStatus,
    },
  })

  const statusLabel =
    reviewStatus === 'advanced' ? 'Advanced' : reviewStatus === 'rejected' ? 'Rejected' : 'Archived'

  if (reviewStatus === 'advanced' || reviewStatus === 'rejected') {
    const notificationTitle = reviewStatus === 'advanced' ? 'Application advanced' : 'Application rejected'
    const notificationDetail =
      reviewStatus === 'advanced'
        ? `Your application for ${latestApplication.jobListing.jobTitle} has been advanced. Our team will contact you soon with next steps.`
        : `Your application for ${latestApplication.jobListing.jobTitle} was rejected. Thank you for applying.`

    await prisma.applicantNotification.create({
      data: {
        userId: applicant.user.id,
        title: notificationTitle,
        detail: notificationDetail,
      },
    })
  }

  await createAuditLogEntry({
    actorType: 'Admin',
    actorName: getAuditActorName(session.user),
    action: 'Status Changed',
    itemType: 'Candidate',
    details: `${applicant.name || applicant.user.name || applicant.user.email} moved to ${statusLabel} for ${latestApplication.jobListing.jobTitle}.`,
  })

  return {
    reviewStatus: updatedApplication.reviewStatus,
    userId: applicant.user.id,
    applicantName: applicant.name || applicant.user.name,
    email: applicant.user.email,
    appliedRole: latestApplication.jobListing.jobTitle,
    submittedAt: updatedApplication.appliedAt,
    applicationCount: applicant.applications.length,
    score: updatedApplication.aiScore,
    aiSummary: updatedApplication.aiSummary,
  }
})
