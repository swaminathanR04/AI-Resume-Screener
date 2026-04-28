import { auth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/prisma'
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

  const auditEntries = await prisma.auditLogEntry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 100,
  })

  return auditEntries.map((entry) => ({
    id: entry.id,
    dateTime: entry.createdAt,
    user: entry.actorName,
    action: entry.action,
    item: entry.itemType,
    details: entry.details,
  }))
})
