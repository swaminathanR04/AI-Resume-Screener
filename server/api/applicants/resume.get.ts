import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'
import { getUploadStoragePath } from '~~/server/utils/upload-storage'

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
      resumePath: true,
    },
  })

  if (!applicantInfo?.resumePath) {
    throw createError({ statusCode: 404, statusMessage: 'Resume not found' })
  }

  const filePath = path.join(getUploadStoragePath(), applicantInfo.resumePath)

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'Resume file not found' })
  }

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', 'inline; filename="resume.pdf"')

  return sendStream(event, fs.createReadStream(filePath))
})
