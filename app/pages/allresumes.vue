<script setup lang="ts">
  const toast = useToast()
  const isRescoring = ref<string | null>(null)
  const isManualScoreModalOpen = ref(false)
  const isSavingManualScore = ref(false)
  const selectedResumeId = ref<string | null>(null)
  const selectedApplicantName = ref('')
  const manualScore = ref<number | null>(null)
  const manualReason = ref('')
  const {
    newResumes,
    pending,
    error,
    refreshResumes,
    moveResume,
    rescoreResume,
    setManualResumeScore,
    getResumeScoreTextClass,
  } = await useAdminResumes()

  const selectedResume = computed(
    () => newResumes.value.find((resume) => resume.userId === selectedResumeId.value) || null
  )

  const manualReasonError = computed(() => {
    if (!isManualScoreModalOpen.value) {
      return ''
    }

    return manualReason.value.trim() ? '' : 'A reason is required.'
  })

  function openManualScoreModal(userId: string, applicantName: string, score: number | null) {
    selectedResumeId.value = userId
    selectedApplicantName.value = applicantName
    manualScore.value = score
    manualReason.value = ''
    isManualScoreModalOpen.value = true
  }

  function closeManualScoreModal() {
    isManualScoreModalOpen.value = false
    isSavingManualScore.value = false
    selectedResumeId.value = null
    selectedApplicantName.value = ''
    manualScore.value = null
    manualReason.value = ''
  }

  async function advanceResume(userId: string, applicantName: string) {
    try {
      await moveResume(userId, 'advanced')

      toast.add({
        title: 'Resume advanced',
        description: `${applicantName} was moved to Advanced.`,
        color: 'success',
      })
    } catch (error) {
      toast.add({
        title: 'Move failed',
        description:
          error instanceof Error ? error.message : 'Unable to move this resume right now.',
        color: 'error',
      })
    }
  }

  async function rejectResume(userId: string, applicantName: string) {
    try {
      await moveResume(userId, 'rejected')

      toast.add({
        title: 'Resume rejected',
        description: `${applicantName} was moved to Rejected.`,
        color: 'warning',
      })
    } catch (error) {
      toast.add({
        title: 'Move failed',
        description:
          error instanceof Error ? error.message : 'Unable to move this resume right now.',
        color: 'error',
      })
    }
  }

  async function handleRescore(userId: string, applicantName: string) {
    const resume = newResumes.value.find((item) => item.userId === userId)

    if (
      resume?.manualScoreReason &&
      !window.confirm(
        'Re-scoring will delete the current manual score reason and replace it with the AI result. Continue?'
      )
    ) {
      return
    }

    isRescoring.value = userId

    try {
      const result = await rescoreResume(userId)

      toast.add({
        title: 'Resume re-scored',
        description:
          result.score === null
            ? `${applicantName} was re-scored, but no AI score is available because the model is not configured.`
            : `${applicantName} now has an AI match score of ${result.score}/10.`,
        color: result.score === null ? 'warning' : 'success',
      })
    } catch (error) {
      const description =
        error instanceof Error ? error.message : 'Unable to re-score this resume right now.'

      toast.add({
        title: 'Re-score failed',
        description,
        color: 'error',
      })
    } finally {
      isRescoring.value = null
    }
  }

  async function saveManualScore() {
    if (!selectedResumeId.value) {
      return
    }

    const nextManualScore = manualScore.value

    if (
      typeof nextManualScore !== 'number' ||
      !Number.isInteger(nextManualScore) ||
      nextManualScore < 1 ||
      nextManualScore > 10
    ) {
      toast.add({
        title: 'Manual score required',
        description: 'Enter a whole number from 1 to 10.',
        color: 'error',
      })
      return
    }

    if (!manualReason.value.trim()) {
      toast.add({
        title: 'Reason required',
        description: 'Provide a reason for the manual score change.',
        color: 'error',
      })
      return
    }

    isSavingManualScore.value = true

    try {
      await setManualResumeScore(selectedResumeId.value, nextManualScore, manualReason.value.trim())

      toast.add({
        title: 'Manual score saved',
        description: `${selectedApplicantName.value} now has a manual score of ${nextManualScore}/10.`,
        color: 'success',
      })

      closeManualScoreModal()
    } catch (error) {
      toast.add({
        title: 'Manual update failed',
        description:
          error instanceof Error ? error.message : 'Unable to save the manual score right now.',
        color: 'error',
      })
      isSavingManualScore.value = false
    }
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
        <UModal :open="isManualScoreModalOpen">
          <template #content>
            <div class="m-8 space-y-5 text-[var(--ui-text)]">
              <div class="space-y-1">
                <h3 class="text-lg font-semibold">Modify score manually</h3>
                <p class="text-sm text-[var(--ui-text-muted)]">
                  Update the score for {{ selectedApplicantName }} and record why it changed.
                </p>
              </div>

              <UFormField label="Score" required>
                <UInput
                  v-model.number="manualScore"
                  type="number"
                  :min="1"
                  :max="10"
                  :step="1"
                  :disabled="isSavingManualScore"
                />
              </UFormField>

              <UFormField label="Reason" required :error="manualReasonError || undefined">
                <UTextarea
                  v-model="manualReason"
                  :rows="5"
                  :maxlength="1000"
                  :disabled="isSavingManualScore"
                  placeholder="Explain why the AI score was changed."
                />
              </UFormField>

              <div
                v-if="selectedResume?.manualScoreReason"
                class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              >
                Saving a new manual score will replace the current admin reason.
              </div>

              <div class="flex justify-end gap-2">
                <UButton
                  color="neutral"
                  variant="soft"
                  label="Cancel"
                  :disabled="isSavingManualScore"
                  @click="closeManualScoreModal"
                />
                <UButton
                  color="primary"
                  label="Save"
                  :loading="isSavingManualScore"
                  @click="saveManualScore"
                />
              </div>
            </div>
          </template>
        </UModal>

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
                    {{ resume.isRescoring ? 'In progress' : resume.aiSummary }}
                  </p>
                </div>
                <div
                  v-if="resume.manualScoreReason && !resume.isRescoring"
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
                >
                  Ranking
                </span>
                <span
                  class="text-base font-semibold"
                  :class="getResumeScoreTextClass(resume.score)"
                >
                  {{
                    resume.isRescoring
                      ? 'In progress'
                      : resume.score === null
                        ? '-/10'
                        : `${resume.score.toFixed(1)}/10`
                  }}
                </span>
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
                label="Re-score"
                :loading="isRescoring === resume.userId"
                :disabled="resume.applicationCount === 0"
                @click="handleRescore(resume.userId, resume.applicantName)"
              />
              <UButton
                color="neutral"
                variant="soft"
                label="Modify Manually"
                :disabled="resume.applicationCount === 0 || isRescoring === resume.userId"
                @click="openManualScoreModal(resume.userId, resume.applicantName, resume.score)"
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
