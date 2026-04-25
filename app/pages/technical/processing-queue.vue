<script setup lang="ts">
  const toast = useToast()

  const queueItems = ref([
    {
      id: 1,
      applicant: 'Jordan Park',
      role: 'Frontend Developer',
      status: 'Queued',
      note: 'Awaiting AI scoring assignment',
    },
    {
      id: 2,
      applicant: 'Avery Kim',
      role: 'Data Analyst',
      status: 'Running',
      note: 'Embedding and ranking in progress',
    },
    {
      id: 3,
      applicant: 'Taylor Adams',
      role: 'Product Designer',
      status: 'Failed',
      note: 'Model request timed out during analysis',
    },
  ])

  const performanceTargets = [
    'AI analysis should complete within 4 to 5 seconds.',
    'Unreadable or corrupted files should be blocked before queue entry.',
    'Failed analyses should support retry without forcing a new upload.',
  ]

  const queueStats = computed(() => [
    { label: 'Queued', value: queueItems.value.filter((item) => item.status === 'Queued').length },
    { label: 'Running', value: queueItems.value.filter((item) => item.status === 'Running').length },
    { label: 'Failed', value: queueItems.value.filter((item) => item.status === 'Failed').length },
  ])

  function getStatusColor(status: string) {
    if (status === 'Failed') return 'error'
    if (status === 'Running') return 'warning'
    return 'neutral'
  }

  function refreshQueue() {
    toast.add({
      title: 'Queue refreshed',
      description: 'Processing queue metrics were refreshed.',
      color: 'primary',
    })
  }

  function retryFailedItem(itemId: number) {
    const item = queueItems.value.find((entry) => entry.id === itemId)

    if (!item || item.status !== 'Failed') {
      return
    }

    item.status = 'Running'
    item.note = 'Retry started from the technical queue page.'

    toast.add({
      title: 'Retry started',
      description: `${item.applicant} is back in the AI processing queue.`,
      color: 'success',
    })
  }
</script>

<template>
  <ResumeScreenerShell
    title="Processing Queue"
    active-section="technical"
    active-sub-item="Processing Queue"
  >
    <section class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-[var(--ui-text-muted)]">
          Track current AI analysis work and retry failed items without changing your main UI flow.
        </p>
        <UButton color="primary" variant="soft" label="Refresh Queue" @click="refreshQueue" />
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <UCard v-for="stat in queueStats" :key="stat.label">
          <div class="space-y-2">
            <p class="text-sm text-[var(--ui-text-muted)]">{{ stat.label }}</p>
            <p class="text-3xl font-semibold text-[var(--ui-text)]">{{ stat.value }}</p>
          </div>
        </UCard>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-[var(--ui-text)]">Queue Items</h2>
              <UBadge color="neutral" variant="soft">Performance</UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="item in queueItems"
              :key="item.id"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="font-medium text-[var(--ui-text)]">{{ item.applicant }}</p>
                  <p class="text-sm text-[var(--ui-text-muted)]">{{ item.role }}</p>
                  <p class="mt-2 text-sm text-[var(--ui-text-muted)]">{{ item.note }}</p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <UBadge :color="getStatusColor(item.status)" variant="soft">
                    {{ item.status }}
                  </UBadge>
                  <UButton
                    v-if="item.status === 'Failed'"
                    color="primary"
                    variant="soft"
                    label="Retry"
                    @click="retryFailedItem(item.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-[var(--ui-text)]">Performance Targets</h2>
              <UBadge color="primary" variant="soft">Operational</UBadge>
            </div>
          </template>

          <div class="space-y-3 text-sm leading-6 text-[var(--ui-text-muted)]">
            <div
              v-for="target in performanceTargets"
              :key="target"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3"
            >
              {{ target }}
            </div>
          </div>
        </UCard>
      </div>
    </section>
  </ResumeScreenerShell>
</template>