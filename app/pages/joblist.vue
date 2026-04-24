<script setup lang="ts">
  const jobListings = [
    {
      id: 1,
      title: 'Software Engineer Intern',
      location: 'Dallas, Texas',
      type: 'Internship',
      applicants: 24,
      status: 'Active',
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      location: 'Remote',
      type: 'Full-time',
      applicants: 18,
      status: 'Reviewing',
    },
    {
      id: 3,
      title: 'Data Analyst',
      location: 'Austin, Texas',
      type: 'Contract',
      applicants: 11,
      status: 'Draft',
    },
  ]
</script>

<template>
  <ResumeScreenerShell title="Job Listings" active-section="job-listings" active-sub-item="List">
    <section class="space-y-4">
      <UCard v-for="job in jobListings" :key="job.id">
        <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div class="space-y-1">
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">{{ job.title }}</h2>
            <p class="text-sm text-[var(--ui-text-muted)]">{{ job.location }} · {{ job.type }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <UBadge color="primary" variant="soft">{{ job.applicants }} applicants</UBadge>
            <UBadge color="neutral" variant="soft">{{ job.status }}</UBadge>
            <UButton color="primary" variant="outline" label="Open" to="/job-listings/create" />
          </div>
        </div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>
