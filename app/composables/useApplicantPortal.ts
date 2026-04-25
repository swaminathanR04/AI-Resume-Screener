export type ApplicantJob = {
  id: number
  title: string
  location: string
  posted: string
  description: string
  employmentType: string
  responsibilities: string[]
  qualifications: string[]
}

export type ApplicantApplication = {
  id: number
  jobId: number
  title: string
  location: string
  status: 'Submitted' | 'In Review' | 'Withdrawn'
  applied: string
  fullName: string
  email: string
  phone: string
  currentLocation: string
  education: string
  graduation: string
  experience: string
  skills: string[]
  resumeFileName: string
  coverLetterFileName: string
  fitSummary: string
  answers: {
    workAuthorization: string
    sponsorship: string
    commute: string
    veteran: string
    disability: string
  }
}

export type ApplicantNotification = {
  id: number
  title: string
  detail: string
  createdAt: string
}

export type ApplicantProfile = {
  phone: string
  address: string
  education: string
  graduation: string
  skills: string[]
}

type SubmitApplicationInput = Omit<
  ApplicantApplication,
  'id' | 'jobId' | 'status' | 'applied' | 'title' | 'location'
>

function buildDefaultJobs(): ApplicantJob[] {
  return [
    {
      id: 1,
      title: 'Software Engineer',
      location: 'Houston, Texas',
      posted: '2/1/2026',
      description:
        'Build applicant-facing tools and internal hiring workflows with a full-stack product team.',
      employmentType: 'Full-time',
      responsibilities: [
        'Develop and maintain web applications across the hiring funnel.',
        'Collaborate with design, recruiting, and platform teams.',
        'Write clean, testable code and help ship production features.',
      ],
      qualifications: [
        'Experience with JavaScript, TypeScript, or Python.',
        'Comfort working with APIs and databases.',
        'Strong communication and debugging skills.',
      ],
    },
    {
      id: 2,
      title: 'Backend Software Engineer',
      location: 'Dallas, Texas',
      posted: '2/1/2026',
      description:
        'Design APIs and services that power job search, application processing, and resume workflows.',
      employmentType: 'Full-time',
      responsibilities: [
        'Build scalable backend systems and hiring workflow APIs.',
        'Improve data quality and job application processing reliability.',
        'Partner with AI and technical teams on resume screening features.',
      ],
      qualifications: [
        'Experience designing APIs and backend systems.',
        'Understanding of SQL and data modeling.',
        'Ability to diagnose and fix production issues.',
      ],
    },
    {
      id: 3,
      title: 'AI Software Engineer',
      location: 'Austin, Texas',
      posted: '2/5/2026',
      description:
        'Work on resume analysis pipelines, scoring systems, and candidate ranking workflows.',
      employmentType: 'Full-time',
      responsibilities: [
        'Integrate AI services into recruiter and applicant workflows.',
        'Monitor scoring quality and build feedback loops.',
        'Collaborate with platform engineers on resilient processing queues.',
      ],
      qualifications: [
        'Experience with AI-assisted product features.',
        'Strong backend or data engineering fundamentals.',
        'Comfort with experimentation and iteration.',
      ],
    },
  ]
}

function buildDefaultApplications(): ApplicantApplication[] {
  return [
    {
      id: 1,
      jobId: 2,
      title: 'Backend Software Engineer',
      location: 'Dallas, Texas',
      status: 'In Review',
      applied: '3/5/2026',
      fullName: 'Applicant User',
      email: 'applicant@example.com',
      phone: '(214) 555-4821',
      currentLocation: 'Dallas, Texas',
      education: 'B.S. Computer Science – UT Dallas',
      graduation: 'May 2027',
      experience:
        'Software Dev Intern – Lone Star Tech. Built backend APIs, worked with SQL databases, and shipped internal tools.',
      skills: ['Python', 'JavaScript', 'SQL', 'Git', 'HTML/CSS'],
      resumeFileName: 'applicant_resume.pdf',
      coverLetterFileName: 'applicant_cover_letter.pdf',
      fitSummary:
        'I am a strong fit because I enjoy backend systems work, API design, and building reliable hiring workflows.',
      answers: {
        workAuthorization: 'Yes',
        sponsorship: 'No',
        commute: 'Yes',
        veteran: 'No',
        disability: 'Prefer not to answer',
      },
    },
    {
      id: 2,
      jobId: 3,
      title: 'AI Software Engineer',
      location: 'Austin, Texas',
      status: 'Withdrawn',
      applied: '3/1/2026',
      fullName: 'Applicant User',
      email: 'applicant@example.com',
      phone: '(214) 555-4821',
      currentLocation: 'Dallas, Texas',
      education: 'B.S. Computer Science – UT Dallas',
      graduation: 'May 2027',
      experience:
        'Software Dev Intern – Lone Star Tech. Contributed to automation workflows and reporting systems.',
      skills: ['Python', 'JavaScript', 'SQL'],
      resumeFileName: 'applicant_resume.pdf',
      coverLetterFileName: 'ai_cover_letter.pdf',
      fitSummary:
        'I enjoy AI-enabled product work and would like to contribute to candidate ranking systems.',
      answers: {
        workAuthorization: 'Yes',
        sponsorship: 'No',
        commute: 'Yes',
        veteran: 'No',
        disability: 'Prefer not to answer',
      },
    },
  ]
}

function buildDefaultNotifications(): ApplicantNotification[] {
  return [
    {
      id: 1,
      title: 'Application in review',
      detail: 'Your Backend Software Engineer application is currently in review.',
      createdAt: 'Mar 8, 2026',
    },
  ]
}

function buildDefaultProfile(): ApplicantProfile {
  return {
    phone: '(214) 555-4821',
    address: '123 Main St, Dallas, Texas',
    education: 'B.S. Computer Science – UT Dallas',
    graduation: 'May 2027',
    skills: ['Python', 'JavaScript', 'SQL', 'Git', 'HTML/CSS'],
  }
}

export function useApplicantPortal() {
  const jobs = useState<ApplicantJob[]>('applicant-jobs', buildDefaultJobs)
  const applications = useState<ApplicantApplication[]>(
    'applicant-applications',
    buildDefaultApplications
  )
  const notifications = useState<ApplicantNotification[]>(
    'applicant-notifications',
    buildDefaultNotifications
  )
  const profile = useState<ApplicantProfile>('applicant-profile', buildDefaultProfile)

  const activeApplications = computed(() =>
    applications.value.filter((application) => application.status !== 'Withdrawn')
  )

  const inactiveApplications = computed(() =>
    applications.value.filter((application) => application.status === 'Withdrawn')
  )

  const recommendedJobs = computed(() => jobs.value.slice(0, 3))

  function getJob(jobId: number) {
    return jobs.value.find((job) => job.id === jobId)
  }

  function getApplication(applicationId: number) {
    return applications.value.find((application) => application.id === applicationId)
  }

  function getApplicationByJob(jobId: number) {
    return applications.value.find((application) => application.jobId === jobId)
  }

  function pushNotification(title: string, detail: string) {
    notifications.value.unshift({
      id: Date.now(),
      title,
      detail,
      createdAt: new Date().toLocaleString(),
    })
  }

  function submitApplication(jobId: number, input: SubmitApplicationInput) {
    const job = getJob(jobId)

    if (!job) {
      return null
    }

    const existingApplication = getApplicationByJob(jobId)

    if (existingApplication && existingApplication.status !== 'Withdrawn') {
      return existingApplication
    }

    const nextApplication: ApplicantApplication = {
      id: Date.now(),
      jobId,
      title: job.title,
      location: job.location,
      status: 'Submitted',
      applied: new Date().toLocaleDateString(),
      ...input,
    }

    if (existingApplication) {
      applications.value = applications.value.map((application) =>
        application.id === existingApplication.id ? nextApplication : application
      )
    } else {
      applications.value.unshift(nextApplication)
    }

    pushNotification(
      'Application submitted',
      `Your ${job.title} application was submitted successfully.`
    )

    return nextApplication
  }

  function withdrawApplication(applicationId: number) {
    const application = getApplication(applicationId)

    if (!application || application.status === 'Withdrawn') {
      return false
    }

    application.status = 'Withdrawn'
    pushNotification(
      'Application withdrawn',
      `Your ${application.title} application has been withdrawn.`
    )

    return true
  }

  return {
    jobs,
    applications,
    notifications,
    profile,
    activeApplications,
    inactiveApplications,
    recommendedJobs,
    getJob,
    getApplication,
    getApplicationByJob,
    submitApplication,
    withdrawApplication,
  }
}
