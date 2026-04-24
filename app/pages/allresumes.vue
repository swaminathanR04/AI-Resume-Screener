<script setup lang="ts">
  import type { ResumeDecision } from '~/composables/useResumeStore'

  const toast = useToast()
  const { allResumes, moveResumeToBucket } = useResumeStore()

  const selectedFilters = ref<Set<string>>(new Set())
  const selectedItemId = ref<number | null>(null)
  const selectedAction = ref<ResumeDecision | null>(null)
  const actionReason = ref('')
  const rankingAuditLog = ref<
    Array<{
      itemId: number
      applicantName: string
      oldRanking: number
      newRanking: number
      timestamp: string
    }>
  >([])

  const availableFilters = [
    { id: 'date', label: 'Date' },
    { id: 'rating', label: 'Rating' },
    { id: 'status', label: 'Status' },
    { id: 'skill', label: 'Skill' },
    { id: 'location', label: 'Location' },
    { id: 'experience', label: 'Experience' },
  ]

  const selectedResume = computed(() =>
    allResumes.value.find((item) => item.id === selectedItemId.value)
  )

  function updateRanking({ resumeId, ranking }: { resumeId: number; ranking: number }) {
    const item = allResumes.value.find((resume) => resume.id === resumeId)

    if (!item || item.ranking === ranking) {
      return
    }

    rankingAuditLog.value.unshift({
      itemId: resumeId,
      applicantName: item.applicantName,
      oldRanking: item.ranking,
      newRanking: ranking,
      timestamp: new Date().toLocaleString(),
    })

    item.ranking = ranking
  }

  function selectDecision({ resumeId, decision }: { resumeId: number; decision: ResumeDecision }) {
    selectedItemId.value = resumeId
    selectedAction.value = decision
  }

  function closeModal() {
    selectedItemId.value = null
    selectedAction.value = null
    actionReason.value = ''
  }

  function submitResumeDecision() {
    if (
      selectedItemId.value == null ||
      selectedAction.value == null ||
      !actionReason.value.trim()
    ) {
      return
    }

    if (moveResumeToBucket(selectedItemId.value, selectedAction.value, actionReason.value.trim())) {
      toast.add({
        title: 'Resume updated',
        description: 'Candidate status moved successfully.',
        color: 'success',
      })
      closeModal()
    }
  }

  function toggleFilter(filterId: string) {
    if (selectedFilters.value.has(filterId)) {
      selectedFilters.value.delete(filterId)
    } else {
      selectedFilters.value.add(filterId)
    }
  }
</script>

<template>
  <ResumeScreenerShell title="All Resumes" active-section="resumes" active-sub-item="All">
    <section class="space-y-6">
      <UCard>
        <div class="space-y-4 p-4 sm:p-6">
          <div class="flex flex-wrap gap-3">
            <UButton
              v-for="filter in availableFilters"
              :key="filter.id"
              color="neutral"
              :variant="selectedFilters.has(filter.id) ? 'solid' : 'soft'"
              :label="filter.label"
              @click="toggleFilter(filter.id)"
            />
          </div>

          <div v-if="selectedFilters.size" class="flex flex-wrap gap-2">
            <UBadge
              v-for="filterId in selectedFilters"
              :key="filterId"
              color="primary"
              variant="soft"
            >
              {{ availableFilters.find((filter) => filter.id === filterId)?.label }}
            </UBadge>
          </div>
        </div>
      </UCard>

      <ResumeListPanel
        :items="allResumes"
        empty-message="No resumes are waiting in the active review queue."
        show-actions
        @update-ranking="updateRanking"
        @select-decision="selectDecision"
      />

      <UCard v-if="rankingAuditLog.length">
        <template #header>
          <h2 class="text-lg font-semibold text-[var(--ui-text)]">Recent Ranking Updates</h2>
        </template>

        <div class="space-y-3 text-sm text-[var(--ui-text-muted)]">
          <div
            v-for="entry in rankingAuditLog.slice(0, 5)"
            :key="`${entry.itemId}-${entry.timestamp}`"
          >
            {{ entry.applicantName }} changed from {{ entry.oldRanking.toFixed(1) }}/10 to
            {{ entry.newRanking.toFixed(1) }}/10 at {{ entry.timestamp }}
          </div>
        </div>
      </UCard>

      <UModal :open="selectedItemId !== null">
        <template #content>
          <div class="m-6 space-y-4 text-[var(--ui-text)]">
            <h2 class="text-lg font-semibold">{{ selectedAction }} candidate</h2>
            <p class="text-sm text-[var(--ui-text-muted)]">
              Add a reason for {{ selectedResume?.applicantName || 'this candidate' }}.
            </p>
            <UTextarea
              v-model="actionReason"
              :rows="5"
              placeholder="Write your decision notes here..."
            />
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="soft" label="Cancel" @click="closeModal" />
              <UButton color="primary" label="Save" @click="submitResumeDecision" />
            </div>
          </div>
        </template>
      </UModal>
    </section>
  </ResumeScreenerShell>
</template>
