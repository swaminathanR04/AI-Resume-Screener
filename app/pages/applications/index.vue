<script setup lang="ts">
  const toast = useToast()
  const { applications, withdrawApplication } = await useApplicantApplications()

  async function withdraw(id: number) {
    await withdrawApplication(id)

    toast.add({
      title: 'Application withdrawn',
      description: 'This application was removed from your submissions.',
      color: 'warning',
    })
  }
</script>

<template>
  <ApplicantPortalShell title="Applications" active-path="/applications">
    <section class="space-y-6">
      <div>
        <h2 class="mb-3 text-lg font-semibold text-[var(--ui-text)]">Submitted Applications</h2>
        <div class="space-y-3">
          <UCard v-for="application in applications" :key="application.id">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="font-semibold text-[var(--ui-text)]">{{ application.title }}</p>
                <p class="text-sm text-[var(--ui-text-muted)]">{{ application.location }}</p>
              </div>

              <div class="text-sm text-[var(--ui-text-muted)]">
                <p>Submitted: {{ new Date(application.appliedAt).toLocaleDateString() }}</p>
                <p>Resume: {{ application.resumePath ? 'On file' : 'Missing' }}</p>
              </div>

              <div class="flex flex-wrap gap-3 text-sm">
                <UButton
                  :to="`/applications/${application.id}`"
                  color="primary"
                  variant="soft"
                  label="View Submission"
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

          <UCard v-if="applications.length === 0">
            <div class="py-4 text-sm text-[var(--ui-text-muted)]">
              You have not submitted any applications yet.
            </div>
          </UCard>
        </div>
      </div>
    </section>
  </ApplicantPortalShell>
</template>
