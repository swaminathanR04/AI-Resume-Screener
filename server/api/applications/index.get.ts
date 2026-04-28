import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const applicantInfo = await prisma.applicantInfo.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      applications: {
        include: {
          jobListing: true,
        },
        orderBy: {
          appliedAt: 'desc',
        },
      },
    },
  })

  if (!applicantInfo) {
    return []
  }

  return applicantInfo.applications.map((application) => ({
    id: application.jobListingId,
    jobId: application.jobListingId,
    title: application.jobListing.jobTitle,
    location: application.jobListing.location,
    employmentType: application.jobListing.employmentType,
    reviewStatus: application.reviewStatus,
    appliedAt: application.appliedAt,
    applied: application.appliedAt,
    resumePath: applicantInfo.resumePath,
  }))
})
