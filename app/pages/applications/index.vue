<script setup lang="ts">
  const toast = useToast()
  const { activeApplications, inactiveApplications, withdrawApplication } = useApplicantPortal()

  function withdraw(id: number) {
    if (!withdrawApplication(id)) {
      return
    }

    toast.add({
      title: 'Application withdrawn',
      description: 'The application was moved to your inactive list.',
      color: 'warning',
    })
  }
</script>

<template>
  <ApplicantPortalShell title="Applications" active-path="/applications">
    <section class="space-y-8">
      <div>
        <h2 class="mb-3 text-lg font-semibold text-[var(--ui-text)]">Active Applications</h2>
        <div class="space-y-3">
          <UCard v-for="application in activeApplications" :key="application.id">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="font-semibold text-[var(--ui-text)]">{{ application.title }}</p>
                <p class="text-sm text-[var(--ui-text-muted)]">{{ application.location }}</p>
              </div>

              <div class="text-sm text-[var(--ui-text-muted)]">
                <p>Status: {{ application.status }}</p>
                <p>Applied on {{ application.applied }}</p>
              </div>

              <div class="flex flex-wrap gap-3 text-sm">
                <UButton
                  :to="`/applications/${application.id}`"
                  color="primary"
                  variant="soft"
                  label="Edit/View Application"
                />
                <UButton
                  color="error"
                  variant="ghost"
                  label="Withdraw"
                  @click="withdraw(application.id)"
                />
              </div>
            </div>
          </UCard>

          <UCard v-if="activeApplications.length === 0">
            <div class="py-4 text-sm text-[var(--ui-text-muted)]">No active applications yet.</div>
          </UCard>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-[var(--ui-text)]">Inactive Applications</h2>
        <div class="space-y-3">
          <UCard v-for="application in inactiveApplications" :key="application.id">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="font-semibold text-[var(--ui-text)]">{{ application.title }}</p>
                <p class="text-sm text-[var(--ui-text-muted)]">{{ application.location }}</p>
              </div>

              <div class="text-sm text-[var(--ui-text-muted)]">
                <p>Status: {{ application.status }}</p>
                <p>Applied on {{ application.applied }}</p>
              </div>

              <UButton
                :to="`/applications/${application.id}`"
                color="neutral"
                variant="soft"
                label="View Application"
              />
            </div>
          </UCard>

          <UCard v-if="inactiveApplications.length === 0">
            <div class="py-4 text-sm text-[var(--ui-text-muted)]">No inactive applications.</div>
          </UCard>
        </div>
      </div>
    </section>
  </ApplicantPortalShell>
</template>
