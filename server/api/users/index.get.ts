import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'
import { isAdminUser } from '../../utils/user-role'

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

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      image: true,
    },
  })

  const redacted = users.map((user) => {
    return {
      ...user,
      image: user.image != null,
    }
  })

  return redacted
})
