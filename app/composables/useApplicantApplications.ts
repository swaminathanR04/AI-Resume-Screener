export type ApplicantApplication = {
  id: number
  jobId: number
  title: string
  location: string
  employmentType: string
  appliedAt: string
  applied: string
  resumePath: string | null
}

export async function useApplicantApplications() {
  const { data, pending, error, refresh } = await useFetch<ApplicantApplication[]>(
    '/api/applications',
    {
      key: 'applicant-applications',
    }
  )

  const applications = computed(() => data.value || [])

  function getApplication(applicationId: number) {
    return applications.value.find((application) => application.id === applicationId)
  }

  function getApplicationByJob(jobId: number) {
    return applications.value.find((application) => application.jobId === jobId)
  }

  async function submitApplication(jobId: number) {
    const application = await $fetch<ApplicantApplication>('/api/applications', {
      method: 'POST',
      body: {
        jobListingId: jobId,
      },
    })

    data.value = [
      application,
      ...applications.value.filter(
        (existingApplication) => existingApplication.id !== application.id
      ),
    ]

    return application
  }

  async function withdrawApplication(applicationId: number) {
    await $fetch(`/api/applications/${applicationId}`, {
      method: 'DELETE',
    })

    data.value = applications.value.filter((application) => application.id !== applicationId)
  }

  return {
    applications,
    pending,
    error,
    refresh,
    getApplication,
    getApplicationByJob,
    submitApplication,
    withdrawApplication,
  }
}
