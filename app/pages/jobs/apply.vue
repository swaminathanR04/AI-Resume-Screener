<script setup lang="ts">
  const toast = useToast()
  const route = useRoute()

  const jobId = computed(() => Number(route.query.jobId || route.params.id || 0))
  const { getJob } = await useApplicantJobListings()
  const { submitApplication } = await useApplicantApplications()
  const { pushNotification } = useApplicantPortal()
  const { data: applicantInfo } = await useFetch<{
    name: string | null
    phoneNumber: string | null
    resumePath: string | null
    applications: Array<{ jobListingId: number; appliedAt: string }>
  }>('/api/applicants/me')

  const job = computed(() => getJob(jobId.value))
  const hasResume = computed(() => Boolean(applicantInfo.value?.resumePath))

  async function handleSubmit() {
    if (!job.value) {
      toast.add({
        title: 'Job not found',
        description: 'Choose a valid job before applying.',
        color: 'error',
      })
      return
    }

    if (!hasResume.value) {
      toast.add({
        title: 'Application failed',
        description: 'Upload your resume before applying to a job.',
        color: 'error',
      })
      return
    }

    try {
      const application = await submitApplication(job.value.id)

      pushNotification(
        `Applied to ${job.value.title}`,
        `Your resume was submitted for the ${job.value.title} job listing.`
      )

      toast.add({
        title: 'Application submitted',
        description: `Your resume was submitted for ${job.value.title}.`,
        color: 'success',
      })
      await navigateTo(`/applications/${application.id}`)
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Unable to submit application.'

      toast.add({
        title: 'Application failed',
        description,
        color: 'error',
      })
    }
  }
</script>

<template>
  <ApplicantPortalShell title="Apply" active-path="/jobs">
    <section v-if="job" class="space-y-6">
      <UCard>
        <div class="space-y-2 p-4 sm:p-6">
          <h2 class="text-2xl font-semibold text-[var(--ui-text)]">Apply for {{ job.title }}</h2>
          <p class="text-sm text-[var(--ui-text-muted)]">{{ job.location }}</p>
        </div>
      </UCard>

      <UCard>
        <div class="grid gap-4 p-4 sm:p-6">
          <div class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-5">
            <p class="text-sm font-medium text-[var(--ui-text)]">Resume Submission</p>
            <p class="mt-2 text-sm leading-6 text-[var(--ui-text-muted)]">
              Applying to this job will submit the resume already saved on your account. No other
              application form is required.
            </p>
            <p class="mt-4 text-sm text-[var(--ui-text-muted)]">
              Current status:
              <span class="font-medium text-[var(--ui-text)]">
                {{ hasResume ? 'Resume on file' : 'No resume uploaded yet' }}
              </span>
            </p>
          </div>

          <UAlert
            v-if="!hasResume"
            color="warning"
            variant="soft"
            title="Resume required"
            description="Upload your resume first, then come back here to submit your application."
          />

          <div class="flex flex-wrap justify-end gap-3">
            <UButton
              v-if="!hasResume"
              to="/resume"
              color="neutral"
              variant="soft"
              label="Go to Resume"
            />
            <UButton v-else to="/resume" color="neutral" variant="soft" label="View Resume" />
            <UButton to="/jobs" color="neutral" variant="soft" label="Cancel" />
            <UButton
              color="primary"
              label="Submit Resume"
              :disabled="!hasResume"
              @click="handleSubmit"
            />
          </div>
        </div>
      </UCard>
    </section>

    <UAlert
      v-else
      color="error"
      variant="soft"
      title="Job not found"
      description="Return to the jobs page and choose a valid listing before applying."
    />
  </ApplicantPortalShell>
</template>
