import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const jobListingId = Number(getRouterParam(event, 'jobListingId'))

  if (!Number.isInteger(jobListingId) || jobListingId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'A valid job listing is required.' })
  }

  const applicantInfo = await prisma.applicantInfo.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  })

  if (!applicantInfo) {
    throw createError({ statusCode: 404, statusMessage: 'Applicant profile not found.' })
  }

  await prisma.applicantJobListing.delete({
    where: {
      applicantInfoId_jobListingId: {
        applicantInfoId: applicantInfo.id,
        jobListingId,
      },
    },
  })

  return {
    success: true,
  }
})
