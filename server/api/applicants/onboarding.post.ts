import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

type OnboardingBody = {
  name?: string
  phoneNumber?: string
}

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<OnboardingBody>(event)
  const name = body.name?.trim() || ''
  const phoneNumber = body.phoneNumber?.trim() || ''

  if (!name || !phoneNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and phone number are required.',
    })
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name,
    },
  })

  const applicantInfo = await prisma.applicantInfo.upsert({
    where: {
      userId: session.user.id,
    },
    update: {
      name,
      phoneNumber,
    },
    create: {
      userId: session.user.id,
      name,
      phoneNumber,
    },
  })

  return {
    name: applicantInfo.name,
    phoneNumber: applicantInfo.phoneNumber,
    isComplete: true,
  }
})
