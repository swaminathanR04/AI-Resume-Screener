<script setup lang="ts">
  const auditRows = [
    {
      dateTime: '03/12/26 12:20 PM',
      user: 'IT',
      action: 'Access Denied',
      item: 'Dashboard',
      details: 'Applicant blocked from a protected page.',
      severity: 'warning',
    },
    {
      dateTime: '03/12/26 12:10 PM',
      user: 'System',
      action: 'File Rejected',
      item: 'Resume',
      details: 'Unreadable PDF was flagged before AI analysis.',
      severity: 'error',
    },
    {
      dateTime: '03/11/26 09:00 PM',
      user: 'System',
      action: 'Duplicate Found',
      item: 'Application',
      details: 'Possible duplicate submission moved to review.',
      severity: 'warning',
    },
    {
      dateTime: '03/10/26 01:00 PM',
      user: 'IT',
      action: 'Config Update',
      item: 'AI Weights',
      details: 'Technical configuration threshold changed to 6/10.',
      severity: 'success',
    },
  ]

  function getSeverityColor(severity: string) {
    if (severity === 'error') return 'error'
    if (severity === 'warning') return 'warning'
    return 'success'
  }
</script>

<template>
  <ResumeScreenerShell
    title="Technical Audit Log"
    active-section="technical"
    active-sub-item="Technical Audit Log"
  >
    <UCard class="overflow-hidden">
      <div
        class="hidden grid-cols-[1.1fr_0.85fr_1fr_0.95fr_1.6fr] gap-4 border-b border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--ui-text)] md:grid"
      >
        <div>Date/Time</div>
        <div>User</div>
        <div>Action</div>
        <div>Item</div>
        <div>Details</div>
      </div>

      <div class="space-y-0 md:block">
        <div
          v-for="row in auditRows"
          :key="`${row.dateTime}-${row.action}`"
          class="border-b border-[var(--ui-border)] px-4 py-4 text-sm text-[var(--ui-text)] odd:bg-[var(--ui-bg)] even:bg-[var(--ui-bg-elevated)] md:grid md:grid-cols-[1.1fr_0.85fr_1fr_0.95fr_1.6fr] md:gap-4"
        >
          <div class="font-semibold md:font-normal">{{ row.dateTime }}</div>
          <div>{{ row.user }}</div>
          <div>
            <UBadge :color="getSeverityColor(row.severity)" variant="soft">{{ row.action }}</UBadge>
          </div>
          <div>{{ row.item }}</div>
          <div>{{ row.details }}</div>
        </div>
      </div>
    </UCard>
  </ResumeScreenerShell>
</template>