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
    select: {
      name: true,
      phoneNumber: true,
    },
  })

  return {
    name: applicantInfo?.name || session.user.name,
    phoneNumber: applicantInfo?.phoneNumber || '',
    isComplete: Boolean(applicantInfo?.name?.trim() && applicantInfo?.phoneNumber?.trim()),
  }
})
