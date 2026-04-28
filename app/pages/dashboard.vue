<script setup lang="ts">
  import { authClient } from '../utils/auth-client'
  import { useAdminResumes } from '../composables/useAdminResumes'

  const { data: users, pending: usersPending, error: usersError } = await useFetch('/api/users')
  const { data: session } = await authClient.useSession(useFetch)
  const {
    pending: resumesPending,
    error: resumesError,
    newResumes,
    acceptedResumes,
    rejectedResumes,
    archivedResumes,
    getResumeScoreTextClass,
  } = await useAdminResumes()

  const currentUser = computed(() => session.value?.user)
  const { displayName } = useProfileDisplayName(
    computed(() => currentUser.value?.name || currentUser.value?.email || 'Admin User')
  )

  const allResumes = computed(() =>
    [
      ...newResumes.value,
      ...acceptedResumes.value,
      ...rejectedResumes.value,
      ...archivedResumes.value,
    ].sort(
      (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
    )
  )

  const appliedResumes = computed(() =>
    allResumes.value.filter((resume) => resume.applicationCount > 0)
  )

  const latestResume = computed(() => appliedResumes.value[0] || null)
  const latestResumePdfPath = computed(() =>
    latestResume.value ? `/api/admin/resumes/${latestResume.value.userId}` : ''
  )

  const notifications = computed(() =>
    appliedResumes.value.slice(0, 5).map((resume) => ({
      id: resume.userId,
      sender: resume.applicantName || 'Applicant',
      subject: 'New application received',
      preview: `${resume.applicantName || 'A candidate'} applied for ${resume.appliedRole}.`,
      time: formatRelativeTime(resume.submittedAt),
      details:
        resume.score === null
          ? (resume.aiSummary || 'AI not configured.')
          : `Current AI score: ${resume.score.toFixed(1)}/10.`,
    }))
  )

  const latestResumeScoreBadgeColor = computed(() => {
    const score = latestResume.value?.score

    if (score === null || score === undefined) {
      return 'neutral'
    }

    if (score >= 8) {
      return 'success'
    }

    if (score >= 6) {
      return 'warning'
    }

    return 'error'
  })

  const latestResumeSummary = computed(() => {
    if (!latestResume.value) {
      return 'No submitted resumes are available yet.'
    }

    if (latestResume.value.aiSummary) {
      return latestResume.value.aiSummary
    }

    return 'AI not configured'
  })

  function getImageLink(user: { image: boolean; id: string }) {
    return user.image ? 'api/users/' + user.id + '/profile' : undefined
  }

  function formatRelativeTime(value: string) {
    const submittedAt = new Date(value).getTime()
    const differenceInMinutes = Math.max(1, Math.round((Date.now() - submittedAt) / 60000))

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes}m ago`
    }

    const differenceInHours = Math.round(differenceInMinutes / 60)

    if (differenceInHours < 24) {
      return `${differenceInHours}h ago`
    }

    const differenceInDays = Math.round(differenceInHours / 24)
    return `${differenceInDays}d ago`
  }

  function formatSubmittedAt(value: string) {
    return new Date(value).toLocaleString()
  }
</script>

<template>
  <ResumeScreenerShell title="Dashboard" active-section="dashboard">
    <section class="space-y-6">
      <UCard>
        <div class="grid gap-6 p-4 lg:grid-cols-[1.3fr_0.7fr] lg:p-6">
          <div class="space-y-3">
            <p class="text-sm font-medium text-[var(--ui-primary)]">Talent Acquisition Workspace</p>
            <h2 class="text-2xl font-semibold text-[var(--ui-text)] sm:text-3xl">
              Welcome back, {{ displayName }}
            </h2>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <p class="text-xs tracking-[0.12em] text-[var(--ui-text-muted)] uppercase">
                Applicants
              </p>
              <p class="mt-2 text-3xl font-semibold text-[var(--ui-text)]">
                {{ appliedResumes.length }}
              </p>
            </div>
            <div
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <p class="text-xs tracking-[0.12em] text-[var(--ui-text-muted)] uppercase">
                Notifications
              </p>
              <p class="mt-2 text-3xl font-semibold text-[var(--ui-text)]">
                {{ notifications.length }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p class="text-[var(--ui-text-muted)]">Manage your application users and settings.</p>
        </div>
        <div class="flex flex-wrap justify-between gap-4 md:items-center">
          <UButton color="neutral" variant="soft" to="/admin-profile" label="Manage Profile" />
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-[var(--ui-text)]">Notifications</h2>
                <p class="text-sm text-[var(--ui-text-muted)]">
                  Recent application activity from submitted resumes.
                </p>
              </div>
              <UBadge color="primary" variant="soft">{{ notifications.length }}</UBadge>
            </div>
          </template>

          <UAlert
            v-if="resumesError"
            color="error"
            variant="soft"
            title="Unable to load notifications"
            :description="resumesError.message"
            class="mb-4"
          />

          <div v-if="resumesPending && notifications.length === 0" class="space-y-3">
            <USkeleton class="h-24 rounded-2xl" />
            <USkeleton class="h-24 rounded-2xl" />
            <USkeleton class="h-24 rounded-2xl" />
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="message in notifications"
              :key="message.id"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-[var(--ui-text)]">
                    {{ message.sender }}
                  </p>
                  <p class="mt-1 truncate text-sm text-[var(--ui-text)]">{{ message.subject }}</p>
                </div>
                <span class="text-xs text-[var(--ui-text-muted)]">{{ message.time }}</span>
              </div>
              <p class="mt-2 text-sm leading-6 text-[var(--ui-text-muted)]">
                {{ message.preview }}
              </p>
              <p class="mt-2 text-xs leading-5 text-[var(--ui-text-muted)]">
                {{ message.details }}
              </p>
            </div>

            <div
              v-if="notifications.length === 0"
              class="py-6 text-center text-sm text-[var(--ui-text-muted)]"
            >
              No notifications yet.
            </div>
          </div>
        </UCard>

        <div class="grid gap-6">
          <UCard>
            <template #header>
              <div>
                <h2 class="text-lg font-semibold text-[var(--ui-text)]">Latest Resume</h2>
                <p class="text-sm text-[var(--ui-text-muted)]">
                  {{ latestResume?.applicantName || 'No recent applicant' }}
                </p>
              </div>
            </template>

            <div
              class="h-72 overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)]"
            >
              <div
                v-if="resumesPending && !latestResume"
                class="flex h-full items-center justify-center p-6"
              >
                <USkeleton class="h-full w-full rounded-2xl" />
              </div>
              <div
                v-else-if="!latestResume"
                class="flex h-full items-center justify-center p-6 text-center text-sm text-[var(--ui-text-muted)]"
              >
                No resume has been submitted yet.
              </div>
              <iframe
                v-else
                :key="latestResume.userId"
                :src="latestResumePdfPath"
                title="Latest resume preview"
                class="h-full w-full"
              />
            </div>

            <div v-if="latestResume" class="mt-4 space-y-1 text-sm text-[var(--ui-text-muted)]">
              <p>
                Applied for
                <span class="text-[var(--ui-text)]">{{ latestResume.appliedRole }}</span>
              </p>
              <p>Submitted {{ formatSubmittedAt(latestResume.submittedAt) }}</p>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-lg font-semibold text-[var(--ui-text)]">AI Overview</h2>
                <UBadge :color="latestResumeScoreBadgeColor" variant="soft">
                  {{
                    latestResume?.score === null || latestResume?.score === undefined
                      ? 'Rank: -/10'
                      : `Rank: ${latestResume.score.toFixed(1)}/10`
                  }}
                </UBadge>
              </div>
            </template>

            <div class="space-y-4 text-sm leading-6 text-[var(--ui-text-muted)]">
              <UAlert
                v-if="resumesError"
                color="error"
                variant="soft"
                title="Unable to load AI overview"
                :description="resumesError.message"
              />
              <template v-else-if="latestResume">
                <p>{{ latestResumeSummary }}</p>
                <p>
                  Review status:
                  <span class="font-medium text-[var(--ui-text)]">{{
                    latestResume.reviewStatus
                  }}</span>
                </p>
                <p>
                  Current score:
                  <span class="font-semibold" :class="getResumeScoreTextClass(latestResume.score)">
                    {{
                      latestResume.score === null
                        ? '-/10'
                        : `${latestResume.score.toFixed(1)}/10`
                    }}
                  </span>
                </p>
              </template>
              <p v-else>No AI review data is available yet.</p>
            </div>
          </UCard>
        </div>
      </div>

      <UCard class="w-full">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-users-20-solid"
                class="h-5 w-5 text-[var(--ui-text-muted)]"
              />
              <h2 class="text-base leading-7 font-semibold text-[var(--ui-text)]">
                Registered Users
              </h2>
            </div>
            <UBadge variant="subtle" color="primary" size="md"
              >{{ users?.length || 0 }} Users</UBadge
            >
          </div>
        </template>

        <div v-if="usersPending" class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between py-2">
            <div class="flex w-full items-center gap-3">
              <USkeleton class="h-10 w-10 rounded-full" />
              <div class="w-full max-w-[200px] space-y-2">
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-3 w-2/3" />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="usersError">
          <UAlert
            icon="i-heroicons-exclamation-triangle-20-solid"
            color="error"
            variant="subtle"
            title="Error loading users"
            :description="usersError.message"
          />
        </div>

        <div v-else>
          <div
            v-for="user in users"
            :key="user.id"
            class="flex items-center justify-between border-t border-[var(--ui-border)] py-4 first:border-t-0 first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-3">
              <UAvatar :src="getImageLink(user)" :alt="user.name" size="md" :as="{ img: 'img' }" />
              <div>
                <p class="font-medium text-[var(--ui-text)]">{{ user.name }}</p>
                <p class="text-sm text-[var(--ui-text-muted)]">{{ user.email }}</p>
              </div>
            </div>
            <UBadge :color="user.emailVerified ? 'success' : 'warning'" variant="subtle" size="sm">
              {{ user.emailVerified ? 'Verified' : 'Pending' }}
            </UBadge>
          </div>

          <div v-if="users?.length === 0" class="py-8 text-center text-[var(--ui-text-muted)]">
            No users found.
          </div>
        </div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>
