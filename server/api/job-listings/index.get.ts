import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const jobListings = await prisma.jobListing.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return jobListings.map((jobListing) => ({
    id: jobListing.id,
    jobTitle: jobListing.jobTitle,
    location: jobListing.location,
    employmentType: jobListing.employmentType,
    jobDescription: jobListing.jobDescription,
    requiredSkills: JSON.parse(jobListing.requiredSkills) as string[],
    createdAt: jobListing.createdAt,
    updatedAt: jobListing.updatedAt,
  }))
})
