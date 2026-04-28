<script setup lang="ts">
  const toast = useToast()
  const route = useRoute()
  const applicationId = computed(() => Number(route.params.id))

  const { getApplication, withdrawApplication } = await useApplicantApplications()
  const { getJob } = await useApplicantJobListings()

  const application = computed(() => getApplication(applicationId.value))
  const job = computed(() => getJob(application.value?.jobId || 0))

  async function withdraw() {
    if (!application.value) {
      return
    }

    await withdrawApplication(application.value.id)

    toast.add({
      title: 'Application withdrawn',
      description: 'This application was removed from your submissions.',
      color: 'warning',
    })

    await navigateTo('/applications')
  }
</script>

<template>
  <ApplicantPortalShell
    :title="application?.title || 'Application Details'"
    active-path="/applications"
  >
    <section v-if="application" class="space-y-6">
      <UCard>
        <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div>
            <p class="text-xl font-semibold text-[var(--ui-text)]">{{ application.title }}</p>
            <p class="text-sm text-[var(--ui-text-muted)]">{{ application.location }}</p>
          </div>

          <div class="space-y-2 text-sm text-[var(--ui-text-muted)] sm:text-right">
            <p>Submitted on {{ new Date(application.appliedAt).toLocaleDateString() }}</p>
            <div class="flex flex-wrap justify-end gap-2">
              <UButton
                v-if="job"
                :to="`/jobs/${job.id}`"
                color="neutral"
                variant="soft"
                label="View Job"
              />
              <UButton color="error" variant="soft" label="Withdraw" @click="withdraw" />
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold text-[var(--ui-text)]">Application Status</h2>
        </template>

        <div class="space-y-3 text-sm text-[var(--ui-text-muted)]">
          <p class="leading-6">
            Your application has been submitted and is available for the hiring team to review.
          </p>
          <p class="leading-6">
            You can manage your saved resume from the resume page or withdraw this submission at any
            time.
          </p>
        </div>
      </UCard>

      <div class="grid gap-6 xl:grid-cols-3">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Submission Summary</h2>
          </template>
          <div class="space-y-3 text-sm text-[var(--ui-text-muted)]">
            <div>
              <span class="font-medium text-[var(--ui-text)]">Role:</span>
              {{ application.title }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Location:</span>
              {{ application.location }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Employment Type:</span>
              {{ application.employmentType }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Submitted:</span>
              {{ new Date(application.appliedAt).toLocaleString() }}
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Resume</h2>
          </template>
          <div class="space-y-4 text-sm text-[var(--ui-text-muted)]">
            <div>
              <p class="font-medium text-[var(--ui-text)]">Submitted document</p>
              <p class="mt-1 leading-6">
                This application uses the resume currently saved on your applicant profile.
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <UButton
                v-if="application.resumePath"
                to="/api/applicants/resume"
                target="_blank"
                color="primary"
                variant="soft"
                label="Open Resume"
              />
              <UButton to="/resume" color="neutral" variant="soft" label="Manage Resume" />
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Job Details</h2>
          </template>
          <div class="space-y-4 text-sm text-[var(--ui-text-muted)]">
            <div>
              <p class="font-medium text-[var(--ui-text)]">Description</p>
              <p class="mt-1 leading-6">{{ job?.description || 'Job details unavailable.' }}</p>
            </div>
            <div v-if="job?.qualifications?.length">
              <p class="font-medium text-[var(--ui-text)]">Required Skills</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="skill in job.qualifications"
                  :key="skill"
                  color="primary"
                  variant="soft"
                >
                  {{ skill }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <UAlert
      v-else
      color="error"
      variant="soft"
      title="Application not found"
      description="The requested application could not be found."
    />
  </ApplicantPortalShell>
</template>
