import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '../server/utils/prisma'
import { getUploadStoragePath } from '../server/utils/upload-storage'

async function ensureUser(email: string, name: string) {
  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      emailVerified: true,
    },
    create: {
      email,
      name,
      emailVerified: true,
    },
  })
}

async function ensureSeededJobListing() {
  const existingJob = await prisma.jobListing.findFirst({
    where: {
      jobTitle: 'Software Engineer Intern',
      location: '(Onsite) Dallas, Texas',
      employmentType: 'Internship',
    },
  })

  if (existingJob) {
    return existingJob
  }

  return prisma.jobListing.create({
    data: {
      jobTitle: 'Software Engineer Intern',
      location: '(Onsite) Dallas, Texas',
      employmentType: 'Internship',
      jobDescription: [
        'Assist in building web applications using modern framework.',
        'Work with backend APIs and databases',
        'Collaborate with a team on feature development',
      ].join('\n'),
      requiredSkills: JSON.stringify(['Python', 'JavaScript', 'SQL']),
    },
  })
}

async function ensureBobResume(userId: string) {
  const bobResumeSeedPath = path.join(process.cwd(), 'prisma', 'seed-assets', 'bob-builder-resume.pdf')

  if (!fs.existsSync(bobResumeSeedPath)) {
    console.warn(`Skipping seeded resume copy because ${bobResumeSeedPath} was not found.`)
    return null
  }

  const resumeDirectory = path.join(getUploadStoragePath(), 'users', userId, 'resumes')
  const fileName = 'bob-builder-resume.pdf'
  const storedPath = path.join(resumeDirectory, fileName)
  const relativePath = path.join('users', userId, 'resumes', fileName)

  await fs.promises.mkdir(resumeDirectory, { recursive: true })

  if (!fs.existsSync(storedPath)) {
    await fs.promises.copyFile(bobResumeSeedPath, storedPath)
  }

  return relativePath
}

async function main() {
  console.log('Ensuring demo deployment data exists...')

  const adminUser = await ensureUser('alice@example.com', 'Alice Wonderland')
  const bobUser = await ensureUser('bob@example.com', 'Bob Builder')
  const applicantUser = await ensureUser('jamie.applicant@example.com', 'Jamie Applicant')
  const seededJobListing = await ensureSeededJobListing()
  const bobResumeRelativePath = await ensureBobResume(bobUser.id)

  const bobApplicantInfo = await prisma.applicantInfo.upsert({
    where: {
      userId: bobUser.id,
    },
    update: {
      name: bobUser.name,
      phoneNumber: '123-456-7890',
      ...(bobResumeRelativePath ? { resumePath: bobResumeRelativePath } : {}),
    },
    create: {
      userId: bobUser.id,
      name: bobUser.name,
      phoneNumber: '123-456-7890',
      ...(bobResumeRelativePath ? { resumePath: bobResumeRelativePath } : {}),
    },
  })

  await prisma.applicantInfo.upsert({
    where: {
      userId: applicantUser.id,
    },
    update: {
      name: applicantUser.name,
    },
    create: {
      userId: applicantUser.id,
      name: applicantUser.name,
    },
  })

  const existingApplication = await prisma.applicantJobListing.findUnique({
    where: {
      applicantInfoId_jobListingId: {
        applicantInfoId: bobApplicantInfo.id,
        jobListingId: seededJobListing.id,
      },
    },
  })

  if (!existingApplication) {
    await prisma.applicantJobListing.create({
      data: {
        applicantInfoId: bobApplicantInfo.id,
        jobListingId: seededJobListing.id,
      },
    })
  }

  console.log('Demo deployment data is ready.', {
    adminEmail: adminUser.email,
    applicantEmails: [bobUser.email, applicantUser.email],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })