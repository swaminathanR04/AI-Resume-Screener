<script setup lang="ts">
  import type { ResumeDecision, ResumeItem } from '~/composables/useResumeStore'

  type CommentKey = 'acceptanceComment' | 'rejectionComment' | 'archiveComment'

  const props = withDefaults(
    defineProps<{
      items: ResumeItem[]
      emptyMessage: string
      commentKey?: CommentKey
      showActions?: boolean
    }>(),
    {
      commentKey: undefined,
      showActions: false,
    }
  )

  const emit = defineEmits<{
    updateRanking: [payload: { resumeId: number; ranking: number }]
    selectDecision: [payload: { resumeId: number; decision: ResumeDecision }]
  }>()

  const editingRankingId = ref<number | null>(null)
  const tempRankingValue = ref('')

  function startEditingRanking(itemId: number, currentRanking: number) {
    editingRankingId.value = itemId
    tempRankingValue.value = currentRanking.toString()
  }

  function saveRanking(itemId: number) {
    const newRanking = parseFloat(tempRankingValue.value)

    if (!Number.isNaN(newRanking) && newRanking >= 0 && newRanking <= 10) {
      emit('updateRanking', { resumeId: itemId, ranking: newRanking })
    }

    editingRankingId.value = null
    tempRankingValue.value = ''
  }

  function commentText(item: ResumeItem) {
    if (!props.commentKey) {
      return ''
    }

    return item[props.commentKey] || ''
  }
</script>

<template>
  <div class="space-y-4">
    <UCard
      v-for="item in items"
      :key="item.id"
      class="overflow-hidden border border-[var(--ui-border)] bg-[var(--ui-bg)]"
    >
      <div class="space-y-4 p-4 sm:p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="text-lg font-semibold text-[var(--ui-text)]">{{ item.applicantName }}</h3>
              <UBadge color="primary" variant="soft">{{ item.positionAppliedFor }}</UBadge>
            </div>
            <p class="text-sm text-[var(--ui-text-muted)]">Submitted {{ item.dateSubmitted }}</p>
          </div>

          <div
            class="flex items-center gap-3 self-start rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-2"
          >
            <span
              class="text-xs font-medium tracking-[0.12em] text-[var(--ui-text-muted)] uppercase"
              >Ranking</span
            >
            <div v-if="editingRankingId === item.id" class="flex items-center gap-2">
              <UInput
                v-model="tempRankingValue"
                type="number"
                step="0.1"
                min="0"
                max="10"
                class="w-24"
              />
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                label="Save"
                @click="saveRanking(item.id)"
              />
            </div>
            <button
              v-else
              type="button"
              class="text-base font-semibold text-[var(--ui-primary)]"
              @click="startEditingRanking(item.id, item.ranking)"
            >
              {{ item.ranking.toFixed(1) }}/10
            </button>
          </div>
        </div>

        <p
          v-if="commentKey"
          class="rounded-2xl bg-[var(--ui-bg-elevated)] p-4 text-sm leading-6 text-[var(--ui-text-muted)]"
        >
          {{ commentText(item) }}
        </p>

        <div v-if="showActions" class="flex flex-wrap gap-3">
          <UButton
            color="success"
            variant="soft"
            label="Accept"
            @click="emit('selectDecision', { resumeId: item.id, decision: 'accept' })"
          />
          <UButton
            color="error"
            variant="soft"
            label="Reject"
            @click="emit('selectDecision', { resumeId: item.id, decision: 'reject' })"
          />
          <UButton
            color="neutral"
            variant="soft"
            label="Archive"
            @click="emit('selectDecision', { resumeId: item.id, decision: 'archive' })"
          />
        </div>
      </div>
    </UCard>

    <UCard v-if="items.length === 0">
      <div class="p-8 text-center text-[var(--ui-text-muted)]">{{ emptyMessage }}</div>
    </UCard>
  </div>
</template>
