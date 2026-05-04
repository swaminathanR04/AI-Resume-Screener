import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'
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

  const applicants = await prisma.applicantInfo.findMany({
    where: {
      resumePath: {
        not: null,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      applications: {
        include: {
          jobListing: {
            select: {
              jobTitle: true,
            },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return applicants.map((applicant) => ({
    reviewStatus: applicant.applications[0]?.reviewStatus || 'new',
    userId: applicant.user.id,
    applicantName: applicant.name || applicant.user.name,
    email: applicant.user.email,
    appliedRole: applicant.applications[0]?.jobListing.jobTitle || 'No job application yet',
    submittedAt: applicant.applications[0]?.appliedAt || applicant.updatedAt,
    applicationCount: applicant.applications.length,
    score: applicant.applications[0]?.aiScore ?? null,
    aiSummary: applicant.applications[0]?.aiSummary ?? null,
    manualScoreReason: applicant.applications[0]?.adminScoreReason ?? null,
  }))
})
