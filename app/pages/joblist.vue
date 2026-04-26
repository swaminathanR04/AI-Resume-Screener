<script setup lang="ts">
  type JobListing = {
    id: number
    jobTitle: string
    location: string
    employmentType: string
    jobDescription: string
    requiredSkills: string[]
    createdAt: string
  }

  const {
    data: jobListings,
    pending,
    error,
    refresh,
  } = await useFetch<JobListing[]>('/api/job-listings')
</script>

<template>
  <ResumeScreenerShell title="Job Listings" active-section="job-listings" active-sub-item="List">
    <section class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <p class="text-sm text-[var(--ui-text-muted)]">Review and manage saved job listings.</p>
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-path-20-solid"
          @click="refresh"
        >
          Refresh
        </UButton>
      </div>

      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        title="Unable to load job listings"
        :description="error.message"
      />

      <UCard v-else-if="pending">
        <div class="py-6 text-center text-sm text-[var(--ui-text-muted)]">
          Loading job listings...
        </div>
      </UCard>

      <UCard v-for="job in jobListings || []" :key="job.id">
        <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div class="space-y-3">
            <div class="space-y-1">
              <h2 class="text-lg font-semibold text-[var(--ui-text)]">{{ job.jobTitle }}</h2>
              <p class="text-sm text-[var(--ui-text-muted)]">
                {{ job.location }} · {{ job.employmentType }}
              </p>
            </div>

            <p class="max-w-3xl text-sm leading-6 text-[var(--ui-text-muted)]">
              {{ job.jobDescription }}
            </p>

            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="skill in job.requiredSkills"
                :key="skill"
                color="primary"
                variant="soft"
              >
                {{ skill }}
              </UBadge>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <UBadge color="neutral" variant="soft">
              {{ new Date(job.createdAt).toLocaleDateString() }}
            </UBadge>
          </div>
        </div>
      </UCard>

      <UCard v-if="!pending && !error && (jobListings?.length || 0) === 0">
        <div class="py-6 text-center text-sm text-[var(--ui-text-muted)]">
          No job listings saved yet.
        </div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>
