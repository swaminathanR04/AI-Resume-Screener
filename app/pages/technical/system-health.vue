<script setup lang="ts">
  const toast = useToast()

  const refreshedAt = ref(new Date().toLocaleTimeString())

  const accessRules = [
    'Applicant users are blocked from protected dashboard routes.',
    'Recruiter and Admin users can review candidate records and job listings.',
    'Technical users can inspect monitoring, validation, and processing pages.',
  ]

  const healthMetrics = ref([
    { label: 'Uptime', value: '99.2%' },
    { label: 'Auth Checks', value: 'Healthy' },
    { label: 'Queue Latency', value: '4.4s avg' },
    { label: 'Open Alerts', value: '2' },
  ])

  const incidentFeed = ref([
    {
      id: 1,
      title: 'Applicant blocked from admin dashboard',
      detail: 'Route middleware redirected the user to /auth.',
      severity: 'warning',
    },
    {
      id: 2,
      title: 'Resume upload rejected',
      detail: 'Unreadable PDF was prevented from entering the AI queue.',
      severity: 'error',
    },
    {
      id: 3,
      title: 'Nightly health sweep completed',
      detail: 'Authentication and profile image endpoints responded normally.',
      severity: 'success',
    },
  ])

  function refreshStatus() {
    refreshedAt.value = new Date().toLocaleTimeString()
    healthMetrics.value = [
      { label: 'Uptime', value: '99.3%' },
      { label: 'Auth Checks', value: 'Healthy' },
      { label: 'Queue Latency', value: '4.1s avg' },
      { label: 'Open Alerts', value: '1' },
    ]

    toast.add({
      title: 'System status refreshed',
      description: `Technical health metrics updated at ${refreshedAt.value}.`,
      color: 'primary',
    })
  }

  function getSeverityColor(severity: string) {
    if (severity === 'error') return 'error'
    if (severity === 'warning') return 'warning'
    return 'success'
  }
</script>

<template>
  <ResumeScreenerShell
    title="System Health"
    active-section="technical"
    active-sub-item="System Health"
  >
    <section class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm text-[var(--ui-text-muted)]">
            Monitor access control and operational health across technical workflows.
          </p>
          <p class="mt-1 text-xs text-[var(--ui-text-muted)]">Last refreshed: {{ refreshedAt }}</p>
        </div>
        <UButton color="primary" variant="soft" label="Refresh Status" @click="refreshStatus" />
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <UCard v-for="metric in healthMetrics" :key="metric.label">
          <div class="space-y-2">
            <p class="text-sm text-[var(--ui-text-muted)]">{{ metric.label }}</p>
            <p class="text-3xl font-semibold text-[var(--ui-text)]">{{ metric.value }}</p>
          </div>
        </UCard>
      </div>

      <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-[var(--ui-text)]">Role-Based Access</h2>
              <UBadge color="warning" variant="soft">Protected Area</UBadge>
            </div>
          </template>

          <div class="space-y-3 text-sm leading-6 text-[var(--ui-text-muted)]">
            <div
              v-for="rule in accessRules"
              :key="rule"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3"
            >
              {{ rule }}
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-[var(--ui-text)]">Incident Feed</h2>
              <UBadge color="neutral" variant="soft">Live Monitoring</UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="item in incidentFeed"
              :key="item.id"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="font-medium text-[var(--ui-text)]">{{ item.title }}</p>
                  <p class="mt-1 text-sm text-[var(--ui-text-muted)]">{{ item.detail }}</p>
                </div>
                <UBadge :color="getSeverityColor(item.severity)" variant="soft">
                  {{ item.severity }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </section>
  </ResumeScreenerShell>
</template>