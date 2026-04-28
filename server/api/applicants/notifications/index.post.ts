import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

type CreateApplicantNotificationBody = {
  title?: string
  detail?: string
}

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<CreateApplicantNotificationBody>(event)

  if (!body.title?.trim() || !body.detail?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Notification title and detail are required.',
    })
  }

  const notification = await prisma.applicantNotification.create({
    data: {
      userId: session.user.id,
      title: body.title.trim(),
      detail: body.detail.trim(),
    },
  })

  setResponseStatus(event, 201)

  return {
    id: notification.id,
    title: notification.title,
    detail: notification.detail,
    createdAt: notification.createdAt,
  }
})
