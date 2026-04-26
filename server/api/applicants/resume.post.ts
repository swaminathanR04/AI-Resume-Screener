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

  const form = await readMultipartFormData(event)

  if (!form) {
    throw createError({ statusCode: 400, statusMessage: 'No form data' })
  }

  const file = form.find((item) => item.name === 'file')

  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Resume file missing' })
  }

  const fileName = file.filename || 'resume.pdf'
  const fileExtension = path.extname(fileName).toLowerCase()
  const contentType = file.type || ''

  if (fileExtension !== '.pdf' || contentType !== 'application/pdf') {
    throw createError({ statusCode: 400, statusMessage: 'Resume uploads must be PDF files.' })
  }

  const dirPath = path.join(getUploadStoragePath(), 'users', session.user.id, 'resumes')

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  const resumeId = `${crypto.randomUUID()}.pdf`
  const filePath = path.join(dirPath, resumeId)
  const relativePath = path.join('users', session.user.id, 'resumes', resumeId)

  await fs.promises.writeFile(filePath, file.data)

  const existingApplicantInfo = await prisma.applicantInfo.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      resumePath: true,
    },
  })

  if (existingApplicantInfo?.resumePath) {
    const previousFilePath = path.join(getUploadStoragePath(), existingApplicantInfo.resumePath)

    if (fs.existsSync(previousFilePath)) {
      await fs.promises.unlink(previousFilePath)
    }
  }

  const applicantInfo = await prisma.applicantInfo.upsert({
    where: {
      userId: session.user.id,
    },
    update: {
      name: session.user.name,
      resumePath: relativePath,
    },
    create: {
      userId: session.user.id,
      name: session.user.name,
      resumePath: relativePath,
    },
  })

  setResponseStatus(event, 201)

  return {
    name: applicantInfo.name,
    resumePath: applicantInfo.resumePath,
  }
})
