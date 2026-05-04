<script setup lang="ts">
  const toast = useToast()
  const { rejectedResumes, getResumeScoreTextClass, moveResume } = await useAdminResumes()

  async function archiveResume(userId: string, applicantName: string) {
    try {
      await moveResume(userId, 'archived')

      toast.add({
        title: 'Resume archived',
        description: `${applicantName} was moved to Archived.`,
        color: 'neutral',
      })
    } catch (error) {
      toast.add({
        title: 'Archive failed',
        description:
          error instanceof Error ? error.message : 'Unable to archive this resume right now.',
        color: 'error',
      })
    }
  }
</script>

<template>
  <ResumeScreenerShell title="Rejected Resumes" active-section="resumes" active-sub-item="Rejected">
    <section class="space-y-4">
      <UCard v-for="resume in rejectedResumes" :key="resume.userId">
        <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="text-lg font-semibold text-[var(--ui-text)]">
                {{ resume.applicantName }}
              </h3>
              <UBadge color="primary" variant="soft">{{ resume.appliedRole }}</UBadge>
            </div>
            <p class="text-sm text-[var(--ui-text-muted)]">{{ resume.email }}</p>
            <p class="text-sm text-[var(--ui-text-muted)]">
              Submitted {{ new Date(resume.submittedAt).toLocaleString() }}
            </p>
            <div class="max-w-2xl space-y-3">
              <div
                v-if="resume.aiSummary"
                class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3"
              >
                <p
                  class="text-xs font-medium tracking-[0.12em] text-[var(--ui-text-muted)] uppercase"
                >
                  AI Reason
                </p>
                <p class="mt-2 text-sm leading-6 text-[var(--ui-text)]">
                  {{ resume.aiSummary }}
                </p>
              </div>
              <div
                v-if="resume.manualScoreReason"
                class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3"
              >
                <p
                  class="text-xs font-medium tracking-[0.12em] text-[var(--ui-text-muted)] uppercase"
                >
                  Admin Reason
                </p>
                <p class="mt-2 text-sm leading-6 text-[var(--ui-text)]">
                  {{ resume.manualScoreReason }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-start gap-3 sm:items-end">
            <div
              class="flex items-center gap-3 self-start rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-2"
            >
              <span
                class="text-xs font-medium tracking-[0.12em] text-[var(--ui-text-muted)] uppercase"
                >Ranking</span
              >
              <span
                class="text-base font-semibold"
                :class="getResumeScoreTextClass(resume.score)"
                >{{ resume.score === null ? '-/10' : `${resume.score.toFixed(1)}/10` }}</span
              >
            </div>
            <UButton
              :to="`/api/admin/resumes/${resume.userId}`"
              target="_blank"
              color="primary"
              variant="soft"
              label="Open Resume"
            />
            <UButton
              color="neutral"
              variant="soft"
              label="Archive"
              @click="archiveResume(resume.userId, resume.applicantName)"
            />
          </div>
        </div>
      </UCard>

      <UCard v-if="rejectedResumes.length === 0">
        <div class="p-8 text-center text-[var(--ui-text-muted)]">No rejected resumes yet.</div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>
