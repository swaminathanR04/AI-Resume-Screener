import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '../server/utils/prisma'
import { getUploadStoragePath } from '../server/utils/upload-storage'

async function main() {
  console.log('Start seeding...')

  await prisma.applicantJobListing.deleteMany()
  await prisma.applicantInfo.deleteMany()
  await prisma.jobListing.deleteMany()

  const adminUser = await prisma.user.upsert({
    where: {
      email: 'alice@example.com',
    },
    update: {
      name: 'Alice Wonderland',
      emailVerified: true,
    },
    create: {
      name: 'Alice Wonderland',
      email: 'alice@example.com',
      emailVerified: true,
    },
  })

  const bobUser = await prisma.user.upsert({
    where: {
      email: 'bob@example.com',
    },
    update: {
      name: 'Bob Builder',
      emailVerified: true,
    },
    create: {
      name: 'Bob Builder',
      email: 'bob@example.com',
      emailVerified: true,
    },
  })

  const applicantUser = await prisma.user.upsert({
    where: {
      email: 'jamie.applicant@example.com',
    },
    update: {
      name: 'Jamie Applicant',
      emailVerified: true,
    },
    create: {
      name: 'Jamie Applicant',
      email: 'jamie.applicant@example.com',
      emailVerified: true,
    },
  })

  const seededJobListing = await prisma.jobListing.create({
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

  const bobResumeSeedPath = path.join(
    process.cwd(),
    'prisma',
    'seed-assets',
    'bob-builder-resume.pdf'
  )

  if (!fs.existsSync(bobResumeSeedPath)) {
    throw new Error(`Missing Bob resume seed asset at ${bobResumeSeedPath}`)
  }

  const bobResumeDirectory = path.join(getUploadStoragePath(), 'users', bobUser.id, 'resumes')
  const bobResumeFileName = 'bob-builder-resume.pdf'
  const bobResumeStoredPath = path.join(bobResumeDirectory, bobResumeFileName)
  const bobResumeRelativePath = path.join('users', bobUser.id, 'resumes', bobResumeFileName)

  await fs.promises.rm(bobResumeDirectory, { recursive: true, force: true })
  await fs.promises.mkdir(bobResumeDirectory, { recursive: true })
  await fs.promises.copyFile(bobResumeSeedPath, bobResumeStoredPath)

  const bobApplicantInfo = await prisma.applicantInfo.create({
    data: {
      userId: bobUser.id,
      name: bobUser.name,
      phoneNumber: '123-456-7890',
      resumePath: bobResumeRelativePath,
      applications: {
        create: {
          jobListingId: seededJobListing.id,
        },
      },
    },
  })

  console.log({ adminUser, bobUser, applicantUser, seededJobListing, bobApplicantInfo })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
