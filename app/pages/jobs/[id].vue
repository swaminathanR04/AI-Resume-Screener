<script setup lang="ts">
  const route = useRoute()
  const jobId = computed(() => Number(route.params.id))

  const { getJob } = await useApplicantJobListings()
  const { getApplicationByJob } = await useApplicantApplications()

  const job = computed(() => getJob(jobId.value))
  const application = computed(() => getApplicationByJob(jobId.value))
</script>

<template>
  <ApplicantPortalShell :title="job?.title || 'Job Details'" active-path="/jobs">
    <section v-if="job" class="space-y-6">
      <UCard>
        <div class="space-y-4 p-4 sm:p-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-[var(--ui-text)]">{{ job.title }}</h2>
              <p class="text-sm text-[var(--ui-text-muted)]">{{ job.location }}</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UBadge color="primary" variant="soft">{{ job.employmentType }}</UBadge>
              <UBadge v-if="application" color="success" variant="soft">Applied</UBadge>
            </div>
          </div>

          <p class="text-sm leading-6 text-[var(--ui-text-muted)]">{{ job.description }}</p>

          <div class="flex flex-wrap gap-3">
            <UButton
              v-if="application"
              :to="`/applications/${application.id}`"
              color="primary"
              label="View Submission"
            />
            <UButton
              v-else
              :to="{ path: '/jobs/apply', query: { jobId: String(job.id) } }"
              color="primary"
              label="Apply"
            />
            <UButton to="/jobs" color="neutral" variant="soft" label="Back to Jobs" />
          </div>
        </div>
      </UCard>

      <div class="grid gap-6 lg:grid-cols-2">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Responsibilities</h2>
          </template>
          <div class="space-y-3 text-sm leading-6 text-[var(--ui-text-muted)]">
            <div
              v-for="item in job.responsibilities"
              :key="item"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3"
            >
              {{ item }}
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Qualifications</h2>
          </template>
          <div class="space-y-3 text-sm leading-6 text-[var(--ui-text-muted)]">
            <div
              v-for="item in job.qualifications"
              :key="item"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3"
            >
              {{ item }}
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <UAlert
      v-else
      color="error"
      variant="soft"
      title="Job not found"
      description="The requested job could not be found."
    />
  </ApplicantPortalShell>
</template>
