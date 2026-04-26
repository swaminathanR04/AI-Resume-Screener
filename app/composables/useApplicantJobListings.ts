export type ApplicantJobListing = {
  id: number
  title: string
  location: string
  posted: string
  description: string
  employmentType: string
  responsibilities: string[]
  qualifications: string[]
}

type JobListingApiResponse = {
  id: number
  jobTitle: string
  location: string
  employmentType: string
  jobDescription: string
  requiredSkills: string[]
  createdAt: string
}

function mapJobListing(job: JobListingApiResponse): ApplicantJobListing {
  const descriptionLines = job.jobDescription
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    id: job.id,
    title: job.jobTitle,
    location: job.location,
    posted: new Date(job.createdAt).toLocaleDateString(),
    description: job.jobDescription,
    employmentType: job.employmentType,
    responsibilities: descriptionLines,
    qualifications: job.requiredSkills,
  }
}

export async function useApplicantJobListings() {
  const { data, pending, error, refresh } = await useFetch<JobListingApiResponse[]>(
    '/api/job-listings',
    {
      key: 'applicant-job-listings',
    }
  )

  const jobs = computed(() => (data.value || []).map(mapJobListing))

  function getJob(jobId: number) {
    return jobs.value.find((job) => job.id === jobId)
  }

  return {
    jobs,
    pending,
    error,
    refresh,
    getJob,
  }
}
