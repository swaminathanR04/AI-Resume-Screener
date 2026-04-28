<script setup lang="ts">
  type AuditRow = {
    id: number
    dateTime: string
    user: string
    action: string
    item: string
    details: string
  }

  const { data, pending, error, refresh } = await useFetch<AuditRow[]>('/api/admin/audit-log', {
    key: 'admin-audit-log',
  })

  const auditRows = computed(() => data.value || [])

  function formatDateTime(value: string) {
    return new Date(value).toLocaleString()
  }
</script>

<template>
  <ResumeScreenerShell title="Audit Log" active-section="audit-log">
    <section class="space-y-4">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        title="Unable to load audit log"
        :description="error.message"
      />

      <UCard>
        <div class="flex items-center justify-between gap-3 p-4 sm:p-6">
          <div>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Audit Events</h2>
            <p class="text-sm text-[var(--ui-text-muted)]">
              Recent admin and system activity across resume review, AI configuration, and job
              management.
            </p>
          </div>

          <UButton color="neutral" variant="soft" label="Refresh" @click="() => refresh()" />
        </div>
      </UCard>

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

        <div v-if="pending && auditRows.length === 0" class="grid gap-3 p-4">
          <USkeleton class="h-14 rounded-2xl" />
          <USkeleton class="h-14 rounded-2xl" />
          <USkeleton class="h-14 rounded-2xl" />
        </div>

        <div
          v-for="row in auditRows"
          :key="row.id"
          class="border-b border-[var(--ui-border)] px-3 py-3 text-[0.82rem] text-[var(--ui-text)] odd:bg-[var(--ui-bg)] even:bg-[var(--ui-bg-elevated)] md:grid md:grid-cols-[1.15fr_0.9fr_1.1fr_0.9fr_1.7fr] md:gap-4"
        >
          <div class="font-semibold md:font-normal">{{ formatDateTime(row.dateTime) }}</div>
          <div>{{ row.user }}</div>
          <div>{{ row.action }}</div>
          <div>{{ row.item }}</div>
          <div>{{ row.details }}</div>
        </div>

        <div
          v-if="!pending && auditRows.length === 0"
          class="p-8 text-center text-[var(--ui-text-muted)]"
        >
          No audit events have been recorded yet.
        </div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>
