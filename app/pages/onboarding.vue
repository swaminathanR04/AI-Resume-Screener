<script setup lang="ts">
  const toast = useToast()

  type ApplicantOnboarding = {
    name: string
    phoneNumber: string
    isComplete: boolean
  }

  const {
    data: onboarding,
    pending,
    error,
  } = await useFetch<ApplicantOnboarding>('/api/applicants/onboarding')

  const state = reactive({
    name: '',
    phoneNumber: '',
  })

  const isSaving = ref(false)

  watchEffect(() => {
    if (onboarding.value) {
      state.name = onboarding.value.name || ''
      state.phoneNumber = onboarding.value.phoneNumber || ''
    }
  })

  async function saveOnboarding() {
    if (!state.name.trim() || !state.phoneNumber.trim()) {
      toast.add({
        title: 'Missing information',
        description: 'Enter your name and phone number to continue.',
        color: 'error',
      })
      return
    }

    isSaving.value = true

    try {
      await $fetch('/api/applicants/onboarding', {
        method: 'POST',
        body: {
          name: state.name,
          phoneNumber: state.phoneNumber,
        },
      })

      toast.add({
        title: 'Profile completed',
        description: 'Your applicant profile information was saved.',
        color: 'success',
      })

      await navigateTo('/jobs')
    } catch (saveError) {
      const description =
        saveError instanceof Error ? saveError.message : 'Unable to save profile information.'

      toast.add({
        title: 'Save failed',
        description,
        color: 'error',
      })
    } finally {
      isSaving.value = false
    }
  }
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[var(--ui-bg-muted)]/40 px-4 py-12">
    <UCard class="w-full max-w-xl">
      <template #header>
        <div>
          <h1 class="text-2xl font-semibold text-[var(--ui-text)]">Complete Your Profile</h1>
          <p class="mt-2 text-sm text-[var(--ui-text-muted)]">
            Before continuing, enter your name and phone number.
          </p>
        </div>
      </template>

      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        title="Unable to load onboarding"
        :description="error.message"
        class="mb-4"
      />

      <div class="space-y-4 p-1">
        <UInput v-model="state.name" placeholder="Full Name" :disabled="pending || isSaving" />
        <UInput
          v-model="state.phoneNumber"
          placeholder="Phone Number"
          :disabled="pending || isSaving"
        />
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="primary" label="Continue" :loading="isSaving" @click="saveOnboarding" />
        </div>
      </template>
    </UCard>
  </div>
</template>
