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
        select: {
          jobListingId: true,
          appliedAt: true,
        },
        orderBy: {
          appliedAt: 'desc',
        },
      },
    },
  })

  if (!applicantInfo) {
    return {
      name: session.user.name,
      phoneNumber: null,
      resumePath: null,
      applications: [],
    }
  }

  return {
    name: applicantInfo.name,
    phoneNumber: applicantInfo.phoneNumber,
    resumePath: applicantInfo.resumePath,
    applications: applicantInfo.applications,
  }
})
