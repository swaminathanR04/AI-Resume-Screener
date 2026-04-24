<script setup lang="ts">
  const auditRows = [
    {
      dateTime: '03/01/26 12:02PM',
      user: 'Admin',
      action: 'Score changed',
      item: 'Candidate',
      details: 'Score changed from 8 to 9',
    },
    {
      dateTime: '03/01/26 12:00PM',
      user: 'System',
      action: 'Resume Scored',
      item: 'Candidate',
      details: 'AI generated score 6/10',
    },
    {
      dateTime: '02/28/26 09:00PM',
      user: 'System',
      action: 'Resume Scored',
      item: 'Candidate',
      details: 'AI generated score 9/10',
    },
    {
      dateTime: '02/27/26 01:00PM',
      user: 'Admin',
      action: 'Job Created',
      item: 'Job Listing',
      details: 'Software Engineer role added',
    },
    {
      dateTime: '02/26/26 04:15AM',
      user: 'Talent Acquisition',
      action: 'Status Change',
      item: 'Candidate',
      details: 'Moved to Interview Stage',
    },
  ]

  const placeholderRows = Array.from({ length: 4 }, () => ({
    dateTime: 'Date/Time',
    user: 'User',
    action: 'Action',
    item: 'Item',
    details: 'Details',
  }))
</script>

<template>
  <ResumeScreenerShell title="Audit Log" active-section="audit-log">
    <UCard class="overflow-hidden">
      <div
        class="hidden grid-cols-[1.15fr_0.9fr_1.1fr_0.9fr_1.7fr] gap-4 border-b border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-3 py-3 text-sm font-semibold text-[var(--ui-text)] md:grid"
      >
        <div>Date/Time</div>
        <div>User</div>
        <div>Action</div>
        <div>Item</div>
        <div>Details</div>
      </div>

      <div
        class="border-b border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-3 py-3 text-sm font-semibold text-[var(--ui-text)] md:hidden"
      >
        Audit Events
      </div>

      <div
        v-for="row in auditRows"
        :key="`${row.dateTime}-${row.action}`"
        class="border-b border-[var(--ui-border)] px-3 py-3 text-[0.82rem] text-[var(--ui-text)] odd:bg-[var(--ui-bg)] even:bg-[var(--ui-bg-elevated)] md:grid md:grid-cols-[1.15fr_0.9fr_1.1fr_0.9fr_1.7fr] md:gap-4"
      >
        <div class="font-semibold md:font-normal">{{ row.dateTime }}</div>
        <div>{{ row.user }}</div>
        <div>{{ row.action }}</div>
        <div>{{ row.item }}</div>
        <div>{{ row.details }}</div>
      </div>

      <div
        v-for="(row, index) in placeholderRows"
        :key="`placeholder-${index}`"
        class="border-b border-[var(--ui-border)] bg-[var(--ui-bg-muted)] px-3 py-3 text-[0.82rem] text-[var(--ui-text-muted)] md:grid md:grid-cols-[1.15fr_0.9fr_1.1fr_0.9fr_1.7fr] md:gap-4"
      >
        <div>{{ row.dateTime }}</div>
        <div>{{ row.user }}</div>
        <div>{{ row.action }}</div>
        <div>{{ row.item }}</div>
        <div>{{ row.details }}</div>
      </div>
    </UCard>
  </ResumeScreenerShell>
</template>
