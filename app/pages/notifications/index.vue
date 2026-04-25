<script setup lang="ts">
  const { notifications } = useApplicantPortal()
</script>

<template>
  <ApplicantPortalShell title="Notifications" active-path="/notifications">
    <section class="space-y-3">
      <UCard v-for="notification in notifications" :key="notification.id">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="font-semibold text-[var(--ui-text)]">{{ notification.title }}</p>
            <span class="text-xs text-[var(--ui-text-muted)]">{{ notification.createdAt }}</span>
          </div>
          <p class="text-sm leading-6 text-[var(--ui-text-muted)]">{{ notification.detail }}</p>
        </div>
      </UCard>

      <UCard v-if="notifications.length === 0">
        <div class="py-6 text-sm text-[var(--ui-text-muted)]">No notifications yet.</div>
      </UCard>
    </section>
  </ApplicantPortalShell>
</template>
