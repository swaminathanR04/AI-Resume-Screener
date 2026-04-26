import { prisma } from '../server/utils/prisma'

async function main() {
  console.log('Start seeding...')

  const adminUser = await prisma.user.upsert({
    where: {
      email: 'alice@example.com',
    },
    update: {
      name: 'Alice',
      emailVerified: true,
    },
    create: {
      name: 'Alice',
      email: 'alice@example.com',
      emailVerified: true,
    },
  })

  const bobUser = await prisma.user.upsert({
    where: {
      email: 'bob@example.com',
    },
    update: {
      name: 'Bob',
      emailVerified: true,
    },
    create: {
      name: 'Bob',
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

  console.log({ adminUser, bobUser, applicantUser })
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
