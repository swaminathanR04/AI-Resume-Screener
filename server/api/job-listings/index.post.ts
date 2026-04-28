import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'
import { createAuditLogEntry, getAuditActorName } from '~~/server/utils/audit-log'
import { isAdminUser } from '~~/server/utils/user-role'

type CreateJobListingBody = {
  jobTitle?: string
  location?: string
  employmentType?: string
  jobDescription?: string
  requiredSkills?: string[]
}

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

  const body = await readBody<CreateJobListingBody>(event)

  const jobTitle = body.jobTitle?.trim() || ''
  const location = body.location?.trim() || ''
  const employmentType = body.employmentType?.trim() || ''
  const jobDescription = body.jobDescription?.trim() || ''
  const requiredSkills = (body.requiredSkills || []).map((skill) => skill.trim()).filter(Boolean)

  if (!jobTitle || !location || !employmentType || !jobDescription || requiredSkills.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Job title, location, employment type, description, and required skills are required.',
    })
  }

  const jobListing = await prisma.jobListing.create({
    data: {
      jobTitle,
      location,
      employmentType,
      jobDescription,
      requiredSkills: JSON.stringify(requiredSkills),
    },
  })

  await createAuditLogEntry({
    actorType: 'Admin',
    actorName: getAuditActorName(session.user),
    action: 'Job Created',
    itemType: 'Job Listing',
    details: `${jobListing.jobTitle} role added in ${jobListing.location}.`,
  })

  setResponseStatus(event, 201)

  return {
    id: jobListing.id,
    jobTitle: jobListing.jobTitle,
    location: jobListing.location,
    employmentType: jobListing.employmentType,
    jobDescription: jobListing.jobDescription,
    requiredSkills,
    createdAt: jobListing.createdAt,
    updatedAt: jobListing.updatedAt,
  }
})
