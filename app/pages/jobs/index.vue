<script setup lang="ts">
  const search = ref('')
  const location = ref('')

  const { jobs } = await useApplicantJobListings()
  const { getApplicationByJob } = await useApplicantApplications()

  const filteredJobs = computed(() => {
    const searchText = search.value.trim().toLowerCase()
    const locationText = location.value.trim().toLowerCase()

    return jobs.value.filter((job) => {
      const matchesSearch =
        !searchText ||
        job.title.toLowerCase().includes(searchText) ||
        job.description.toLowerCase().includes(searchText)
      const matchesLocation = !locationText || job.location.toLowerCase().includes(locationText)

      return matchesSearch && matchesLocation
    })
  })

  function clearFilters() {
    search.value = ''
    location.value = ''
  }
</script>

<template>
  <ApplicantPortalShell title="Jobs" active-path="/jobs">
    <section class="space-y-6">
      <UCard>
        <div class="grid gap-4 p-4 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
          <UInput
            v-model="search"
            placeholder="Find software roles"
            icon="i-heroicons-magnifying-glass-20-solid"
          />
          <UInput v-model="location" placeholder="Location" icon="i-heroicons-map-pin-20-solid" />
          <UButton
            color="neutral"
            variant="soft"
            label="Clear"
            :disabled="!search && !location"
            @click="clearFilters"
          />
        </div>
      </UCard>

      <div class="space-y-4">
        <UCard v-for="job in filteredJobs" :key="job.id">
          <div class="space-y-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 class="text-xl font-semibold text-[var(--ui-text)]">{{ job.title }}</h2>
                <p class="text-sm text-[var(--ui-text-muted)]">{{ job.location }}</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <UBadge color="primary" variant="soft">{{ job.employmentType }}</UBadge>
                <UBadge v-if="getApplicationByJob(job.id)" color="success" variant="soft">
                  Applied
                </UBadge>
              </div>
            </div>

            <p class="text-sm leading-6 text-[var(--ui-text-muted)]">{{ job.description }}</p>

            <div class="flex flex-wrap items-center justify-between gap-3">
              <span class="text-xs text-[var(--ui-text-muted)]">Posted: {{ job.posted }}</span>
              <div class="flex flex-wrap gap-3">
                <UButton :to="`/jobs/${job.id}`" color="primary" label="Read More" />
              </div>
            </div>
          </div>
        </UCard>

        <UCard v-if="filteredJobs.length === 0">
          <div class="py-6 text-center text-sm text-[var(--ui-text-muted)]">No jobs found.</div>
        </UCard>
      </div>
    </section>
  </ApplicantPortalShell>
</template>
