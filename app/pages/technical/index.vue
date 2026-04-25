<script setup lang="ts">
  const overviewCards = [
    {
      title: 'Validation Center',
      value: '12 checks',
      note: 'Review upload validation and file screening status.',
      link: '/technical/validation-center',
    },
    {
      title: 'System Health',
      value: '99.2% uptime',
      note: 'Track access control, response times, and service readiness.',
      link: '/technical/system-health',
    },
    {
      title: 'Processing Queue',
      value: '14 items',
      note: 'Monitor AI analysis progress and retry failures quickly.',
      link: '/technical/processing-queue',
    },
    {
      title: 'Technical Audit Log',
      value: '24 events',
      note: 'Inspect recent system and security events.',
      link: '/technical/audit-log',
    },
  ]

  const quickStats = [
    { label: 'Unreadable Files', value: 12 },
    { label: 'Rejected Uploads', value: 8 },
    { label: 'Access Violations', value: 4 },
    { label: 'Failed Analyses', value: 2 },
  ]

  const summaryItems = [
    'Resume uploads must be validated before AI scoring begins.',
    'Corrupted or unsupported files should be blocked early.',
    'Role-based access should keep non-admin users out of protected screens.',
    'Failed analyses need clear retry paths without restarting the whole workflow.',
  ]
</script>

<template>
  <ResumeScreenerShell title="Technical Overview" active-section="technical" active-sub-item="Overview">
    <section class="space-y-6">
      <UCard>
        <div class="grid gap-6 p-4 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
          <div class="space-y-3">
            <p class="text-sm font-medium text-[var(--ui-primary)]">Technical Workspace</p>
            <h2 class="text-2xl font-semibold text-[var(--ui-text)] sm:text-3xl">
              Monitor validation, system health, and AI processing flow.
            </h2>
            <p class="max-w-2xl text-sm leading-6 text-[var(--ui-text-muted)] sm:text-base">
              This brings over the Technical-UI branch sections as operational pages while keeping
              the current product shell, navigation, and design language intact.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="stat in quickStats"
              :key="stat.label"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <p class="text-xs tracking-[0.12em] text-[var(--ui-text-muted)] uppercase">
                {{ stat.label }}
              </p>
              <p class="mt-2 text-3xl font-semibold text-[var(--ui-text)]">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-[var(--ui-text)]">Technical Sections</h2>
                <p class="text-sm text-[var(--ui-text-muted)]">
                  Operational pages added from the Technical-UI branch.
                </p>
              </div>
              <UBadge color="primary" variant="soft">Overview</UBadge>
            </div>
          </template>

          <div class="grid gap-4 md:grid-cols-2">
            <NuxtLink
              v-for="card in overviewCards"
              :key="card.title"
              :to="card.link"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-5 transition hover:border-[var(--ui-primary)] hover:shadow-sm"
            >
              <p class="text-sm font-medium text-[var(--ui-primary)]">{{ card.title }}</p>
              <h3 class="mt-2 text-2xl font-semibold text-[var(--ui-text)]">{{ card.value }}</h3>
              <p class="mt-2 text-sm leading-6 text-[var(--ui-text-muted)]">{{ card.note }}</p>
              <span class="mt-4 inline-flex text-sm font-medium text-[var(--ui-primary)]">
                Open section
              </span>
            </NuxtLink>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-[var(--ui-text)]">IT Summary</h2>
              <UBadge color="neutral" variant="soft">Monitoring</UBadge>
            </div>
          </template>

          <div class="space-y-3 text-sm leading-6 text-[var(--ui-text-muted)]">
            <div
              v-for="item in summaryItems"
              :key="item"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3"
            >
              {{ item }}
            </div>
          </div>
        </UCard>
      </div>
    </section>
  </ResumeScreenerShell>
</template>