<script setup lang="ts">
  const toast = useToast()
  const { newResumes, pending, error, refreshResumes, moveResume } = await useAdminResumes()

  function advanceResume(userId: string, applicantName: string) {
    if (!moveResume(userId, 'accepted')) {
      return
    }

    toast.add({
      title: 'Resume advanced',
      description: `${applicantName} was moved to Accepted.`,
      color: 'success',
    })
  }

  function rejectResume(userId: string, applicantName: string) {
    if (!moveResume(userId, 'rejected')) {
      return
    }

    toast.add({
      title: 'Resume rejected',
      description: `${applicantName} was moved to Rejected.`,
      color: 'warning',
    })
  }
</script>

<template>
  <ResumeScreenerShell title="New Resumes" active-section="resumes" active-sub-item="New Resumes">
    <section class="space-y-6">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        title="Unable to load resumes"
        :description="error.message"
      />

      <UCard>
        <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Applicant Resumes</h2>
            <p class="text-sm text-[var(--ui-text-muted)]">
              This list only shows actual applicants with resumes saved on the server.
            </p>
          </div>

          <UButton color="neutral" variant="soft" label="Refresh" @click="() => refreshResumes()" />
        </div>
      </UCard>

      <div v-if="pending" class="grid gap-4">
        <USkeleton class="h-32 rounded-3xl" />
        <USkeleton class="h-32 rounded-3xl" />
      </div>

      <div v-else class="space-y-4">
        <UCard v-for="resume in newResumes" :key="resume.userId">
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
              <p class="text-sm text-[var(--ui-text-muted)]">
                Applications: {{ resume.applicationCount }}
              </p>
            </div>

            <div class="flex flex-col items-start gap-3 sm:items-end">
              <div
                class="flex items-center gap-3 self-start rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-2"
              >
                <span
                  class="text-xs font-medium tracking-[0.12em] text-[var(--ui-text-muted)] uppercase"
                >
                  Ranking
                </span>
                <span class="text-base font-semibold text-[var(--ui-primary)]">
                  {{ resume.score.toFixed(1) }}/10
                </span>
              </div>
              <UButton
                :to="`/api/admin/resumes/${resume.userId}`"
                target="_blank"
                color="primary"
                variant="soft"
                label="Open Resume"
              />
              <div class="flex flex-wrap justify-end gap-2">
                <UButton
                  color="success"
                  variant="soft"
                  label="Advance"
                  @click="advanceResume(resume.userId, resume.applicantName)"
                />
                <UButton
                  color="error"
                  variant="soft"
                  label="Reject"
                  @click="rejectResume(resume.userId, resume.applicantName)"
                />
              </div>
            </div>
          </div>
        </UCard>

        <UCard v-if="newResumes.length === 0">
          <div class="p-8 text-center text-[var(--ui-text-muted)]">
            No new resumes are waiting for review.
          </div>
        </UCard>
      </div>
    </section>
  </ResumeScreenerShell>
</template>
