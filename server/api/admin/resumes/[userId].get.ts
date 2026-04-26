import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'
import { getUploadStoragePath } from '~~/server/utils/upload-storage'
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

  const userId = getRouterParam(event, 'userId')

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing userId' })
  }

  const applicant = await prisma.applicantInfo.findUnique({
    where: {
      userId,
    },
    select: {
      resumePath: true,
    },
  })

  if (!applicant?.resumePath) {
    throw createError({ statusCode: 404, statusMessage: 'Resume not found' })
  }

  const filePath = path.join(getUploadStoragePath(), applicant.resumePath)

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'Resume file not found' })
  }

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', 'inline; filename="resume.pdf"')

  return sendStream(event, fs.createReadStream(filePath))
})
