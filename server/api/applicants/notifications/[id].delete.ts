import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const notificationId = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(notificationId) || notificationId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid notification id.' })
  }

  const notification = await prisma.applicantNotification.findFirst({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  })

  if (!notification) {
    throw createError({ statusCode: 404, statusMessage: 'Notification not found.' })
  }

  await prisma.applicantNotification.delete({
    where: {
      id: notificationId,
    },
  })

  setResponseStatus(event, 204)
  return null
})
