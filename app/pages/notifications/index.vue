<script setup lang="ts">
  type ApplicantNotification = {
    id: number
    title: string
    detail: string
    createdAt: string
  }

  const toast = useToast()
  const deletingNotificationId = ref<number | null>(null)

  const { data, pending, error, refresh } = await useFetch<ApplicantNotification[]>(
    '/api/applicants/notifications',
    {
      key: 'applicant-notifications',
    }
  )

  const notifications = computed(() => data.value || [])

  async function deleteNotification(notificationId: number) {
    if (deletingNotificationId.value === notificationId) {
      return
    }

    deletingNotificationId.value = notificationId

    try {
      await $fetch(`/api/applicants/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      data.value = notifications.value.filter((notification) => notification.id !== notificationId)

      toast.add({
        title: 'Notification deleted',
        color: 'success',
      })
    } catch (deleteError: any) {
      toast.add({
        title: 'Unable to delete notification',
        description:
          deleteError?.data?.statusMessage || deleteError?.message || 'Please try again.',
        color: 'error',
      })
    } finally {
      deletingNotificationId.value = null
    }
  }
</script>

<template>
  <ApplicantPortalShell title="Notifications" active-path="/notifications">
    <section class="space-y-3">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        title="Unable to load notifications"
        :description="error.message"
      />

      <UCard>
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-[var(--ui-text)]">Application Notifications</p>
            <p class="text-sm text-[var(--ui-text-muted)]">
              Updates about your submitted applications.
            </p>
          </div>
          <UButton color="neutral" variant="soft" label="Refresh" @click="() => refresh()" />
        </div>
      </UCard>

      <div v-if="pending && notifications.length === 0" class="grid gap-3">
        <USkeleton class="h-20 rounded-2xl" />
        <USkeleton class="h-20 rounded-2xl" />
      </div>

      <UCard v-for="notification in notifications" :key="notification.id">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-semibold text-[var(--ui-text)]">{{ notification.title }}</p>
              <span class="text-xs text-[var(--ui-text-muted)]">{{
                new Date(notification.createdAt).toLocaleString()
              }}</span>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-trash-20-solid"
              label="Delete"
              :loading="deletingNotificationId === notification.id"
              :disabled="deletingNotificationId !== null"
              @click="deleteNotification(notification.id)"
            />
          </div>
          <p class="text-sm leading-6 text-[var(--ui-text-muted)]">{{ notification.detail }}</p>
        </div>
      </UCard>

      <UCard v-if="!pending && notifications.length === 0">
        <div class="py-6 text-sm text-[var(--ui-text-muted)]">No notifications yet.</div>
      </UCard>
    </section>
  </ApplicantPortalShell>
</template>
