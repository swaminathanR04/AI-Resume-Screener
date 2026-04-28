<script setup lang="ts">
  type AiConfigState = {
    skillsWeight: number
    experienceWeight: number
    educationWeight: number
    portfolioWeight: number
    customRules: string[]
    minimumScore: number
  }

  const toast = useToast()
  const { refreshResumes, rescoreNewResumes } = await useAdminResumes()
  const isSaving = ref(false)
  const isRescoring = ref(false)
  const defaults = ref<AiConfigState | null>(null)

  const state = reactive<AiConfigState>({
    skillsWeight: 40,
    experienceWeight: 30,
    educationWeight: 20,
    portfolioWeight: 10,
    customRules: ['Add a point if applicant is a US Veteran'],
    minimumScore: 6,
  })

  const { data, pending, error, refresh } = await useFetch<{
    config: AiConfigState
    defaults: AiConfigState
  }>('/api/admin/ai-config', {
    key: 'admin-ai-config',
  })

  watchEffect(() => {
    if (!data.value) {
      return
    }

    defaults.value = {
      ...data.value.defaults,
      customRules: [...data.value.defaults.customRules],
    }

    Object.assign(state, {
      ...data.value.config,
      customRules: [...data.value.config.customRules],
    })
  })

  const totalWeight = computed(
    () =>
      Number(state.skillsWeight || 0) +
      Number(state.experienceWeight || 0) +
      Number(state.educationWeight || 0) +
      Number(state.portfolioWeight || 0)
  )

  function normalizeConfig() {
    return {
      skillsWeight: Number(state.skillsWeight || 0),
      experienceWeight: Number(state.experienceWeight || 0),
      educationWeight: Number(state.educationWeight || 0),
      portfolioWeight: Number(state.portfolioWeight || 0),
      minimumScore: Number(state.minimumScore || 0),
      customRules: state.customRules.map((rule) => rule.trim()).filter(Boolean),
    }
  }

  function addCustomRule() {
    state.customRules.push('')
  }

  function removeCustomRule(index: number) {
    state.customRules.splice(index, 1)
  }

  async function saveConfig(
    config = normalizeConfig(),
    successMessage = 'AI configuration saved.'
  ) {
    isSaving.value = true

    try {
      const response = await $fetch<{ config: AiConfigState }>('/api/admin/ai-config', {
        method: 'PUT',
        body: config,
      })

      Object.assign(state, {
        ...response.config,
        customRules: [...response.config.customRules],
      })

      await refresh()

      toast.add({
        title: 'Configuration updated',
        description: successMessage,
        color: 'success',
      })
    } catch (saveError) {
      toast.add({
        title: 'Save failed',
        description:
          saveError instanceof Error ? saveError.message : 'Unable to save AI configuration.',
        color: 'error',
      })
    } finally {
      isSaving.value = false
    }
  }

  async function resetToDefault() {
    if (!defaults.value) {
      return
    }

    await saveConfig(
      {
        ...defaults.value,
        customRules: [...defaults.value.customRules],
      },
      'AI configuration was reset to the default values.'
    )
  }

  async function handleRescoreNew() {
    isRescoring.value = true

    try {
      const result = await rescoreNewResumes()
      await refreshResumes()

      toast.add({
        title: 'New resumes re-scored',
        description: `Processed ${result.total} new resumes. ${result.rejectedCount} moved to Rejected, ${result.rescoredCount} stayed in New, and ${result.pendingCount} remain pending.`,
        color: 'success',
      })
    } catch (rescoreError) {
      toast.add({
        title: 'Re-score failed',
        description:
          rescoreError instanceof Error
            ? rescoreError.message
            : 'Unable to re-score new resumes right now.',
        color: 'error',
      })
    } finally {
      isRescoring.value = false
    }
  }
</script>

<template>
  <ResumeScreenerShell title="AI Configuration" active-section="ai-config">
    <section class="space-y-6">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        title="Unable to load AI configuration"
        :description="error.message"
      />

      <UCard>
        <div class="space-y-7 p-4 sm:p-6">
          <div class="space-y-2">
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">AI Scoring Weights</h2>
            <p class="text-sm text-[var(--ui-text-muted)]">
              These values are included in the AI scoring prompt for every new application and for
              re-scoring resumes in the New Resumes tab.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Skills">
              <UInput
                v-model.number="state.skillsWeight"
                type="number"
                :disabled="pending || isSaving"
              />
            </UFormField>
            <UFormField label="Experience">
              <UInput
                v-model.number="state.experienceWeight"
                type="number"
                :disabled="pending || isSaving"
              />
            </UFormField>
            <UFormField label="Education">
              <UInput
                v-model.number="state.educationWeight"
                type="number"
                :disabled="pending || isSaving"
              />
            </UFormField>
            <UFormField label="Portfolio">
              <UInput
                v-model.number="state.portfolioWeight"
                type="number"
                :disabled="pending || isSaving"
              />
            </UFormField>
          </div>

          <div
            class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3"
          >
            <p class="text-sm font-medium text-[var(--ui-text)]">Weight Total</p>
            <p
              class="mt-1 text-sm"
              :class="
                totalWeight === 100
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              {{ totalWeight }}%
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-[var(--ui-text)]">Custom Rules</h2>
                <p class="text-sm text-[var(--ui-text-muted)]">
                  Add any extra rules the AI should consider when scoring a resume.
                </p>
              </div>
              <UButton color="neutral" variant="soft" label="Add Rule" @click="addCustomRule" />
            </div>

            <div v-if="state.customRules.length" class="space-y-3">
              <div
                v-for="(rule, index) in state.customRules"
                :key="index"
                class="flex flex-col gap-3 rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4 sm:flex-row sm:items-center"
              >
                <UInput
                  v-model="state.customRules[index]"
                  class="flex-1"
                  :disabled="pending || isSaving"
                  placeholder="Add a point if the applicant has active security clearance"
                />
                <UButton
                  color="error"
                  variant="ghost"
                  label="Remove"
                  @click="removeCustomRule(index)"
                />
              </div>
            </div>

            <UAlert
              v-else
              color="neutral"
              variant="soft"
              title="No custom rules"
              description="Add a custom rule if you want the AI to consider something beyond the default weights."
            />
          </div>

          <UFormField label="Minimum Candidate Score Threshold">
            <UInput
              v-model.number="state.minimumScore"
              type="number"
              :disabled="pending || isSaving"
            />
          </UFormField>

          <p class="text-sm text-[var(--ui-text-muted)]">
            Any newly scored resume below this threshold will be automatically moved to Rejected.
          </p>

          <div class="flex flex-wrap gap-4 pt-2 sm:justify-between">
            <UButton
              type="button"
              color="neutral"
              variant="soft"
              label="Reset to Default"
              :disabled="pending || isSaving || !defaults"
              @click="resetToDefault"
            />
            <div class="flex flex-wrap gap-4">
              <UButton
                type="button"
                color="primary"
                variant="solid"
                label="Save"
                :loading="isSaving"
                @click="saveConfig()"
              />
              <UButton
                type="button"
                color="primary"
                variant="outline"
                label="Re-score New Resumes"
                :loading="isRescoring"
                @click="handleRescoreNew"
              />
            </div>
          </div>
        </div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>
