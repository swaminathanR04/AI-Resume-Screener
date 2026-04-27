<script setup lang="ts">
  const toast = useToast()

  const employmentTypeOptions = ['Internship', 'Full-time', 'Part-time', 'Contract', 'Temporary']

  const state = reactive({
    jobTitle: '',
    location: '',
    employmentType: employmentTypeOptions[0],
    jobDescription: '',
    requiredSkills: '',
  })

  const isSaving = ref(false)

  async function saveListing() {
    const requiredSkills = state.requiredSkills
      .split(/\r?\n|,/)
      .map((skill) => skill.trim())
      .filter(Boolean)

    if (
      !state.jobTitle.trim() ||
      !state.location.trim() ||
      !state.employmentType.trim() ||
      !state.jobDescription.trim() ||
      requiredSkills.length === 0
    ) {
      toast.add({
        title: 'Missing information',
        description: 'Complete all fields before saving the job listing.',
        color: 'error',
      })
      return
    }

    isSaving.value = true

    try {
      await $fetch('/api/job-listings', {
        method: 'POST',
        body: {
          jobTitle: state.jobTitle,
          location: state.location,
          employmentType: state.employmentType,
          jobDescription: state.jobDescription,
          requiredSkills,
        },
      })

      toast.add({
        title: 'Job listing saved',
        description: 'The new job listing was added successfully.',
        color: 'success',
      })

      await navigateTo('/joblist')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save the job listing.'

      toast.add({
        title: 'Save failed',
        description: message,
        color: 'error',
      })
    } finally {
      isSaving.value = false
    }
  }

  async function cancel() {
    await navigateTo('/joblist')
  }
</script>

<template>
  <ResumeScreenerShell
    title="Create New Job Listing"
    active-section="job-listings"
    active-sub-item="Create New"
  >
    <UCard>
      <div class="space-y-7 p-4 text-[1.02rem] text-[var(--ui-text)] sm:p-6">
        <div class="form-section">
          <h2 class="mb-1 text-[1.12rem] font-semibold">Job Information</h2>
          <p class="mb-4 text-sm leading-6 text-[var(--ui-text-muted)]">
            Add the core details applicants need to understand the role at a glance.
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Job Title" required>
              <UInput
                v-model="state.jobTitle"
                class="listing-field"
                size="xl"
                placeholder="Software Engineer Intern"
              />
            </UFormField>
            <UFormField label="Location" required>
              <UInput
                v-model="state.location"
                class="listing-field"
                size="xl"
                placeholder="Onsite, Dallas, Texas"
              />
            </UFormField>
          </div>

          <div class="mt-4 max-w-md">
            <UFormField label="Employment Type" required>
              <USelect
                v-model="state.employmentType"
                :items="employmentTypeOptions"
                class="listing-field"
                size="xl"
              />
            </UFormField>
          </div>
        </div>

        <div class="form-section">
          <h2 class="mb-1 text-[1.12rem] font-semibold">Job Description:</h2>
          <UTextarea
            v-model="state.jobDescription"
            class="listing-field listing-field--textarea"
            :rows="7"
            size="xl"
            placeholder="Describe the role, responsibilities, and expectations for this job listing."
          />
        </div>

        <div class="form-section">
          <h2 class="mb-1 text-[1.12rem] font-semibold">Required Skills:</h2>
          <UTextarea
            v-model="state.requiredSkills"
            class="listing-field listing-field--textarea"
            :rows="5"
            size="xl"
            placeholder="Enter one skill per line or separate skills with commas."
          />
        </div>
      </div>

      <div
        class="flex flex-wrap gap-4 border-t border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-4 sm:px-6"
      >
        <UButton
          type="button"
          color="primary"
          variant="solid"
          label="Save Listing"
          :loading="isSaving"
          @click="saveListing"
        />
        <UButton type="button" color="neutral" variant="soft" label="Cancel" @click="cancel" />
      </div>
    </UCard>
  </ResumeScreenerShell>
</template>

<style scoped>
  .form-section {
    border: 1px solid color-mix(in srgb, var(--ui-border) 82%, transparent);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--ui-bg-elevated) 55%, transparent);
    padding: 1.25rem;
  }

  .listing-field {
    display: block;
    width: 100%;
  }

  .listing-field :deep(input),
  .listing-field :deep(textarea),
  .listing-field :deep(button) {
    width: 100%;
    border: 1px solid color-mix(in srgb, var(--ui-border) 80%, transparent);
    border-radius: 0.95rem;
    background: color-mix(in srgb, var(--ui-bg) 78%, var(--ui-bg-elevated) 22%);
    box-shadow: inset 0 1px 0 color-mix(in srgb, white 4%, transparent);
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      background-color 180ms ease,
      transform 180ms ease;
  }

  .listing-field :deep(input),
  .listing-field :deep(button) {
    min-height: 3.2rem;
    padding-inline: 0.95rem;
  }

  .listing-field--textarea :deep(textarea) {
    min-height: 10.5rem;
    padding: 0.95rem 1rem;
    line-height: 1.6;
    resize: vertical;
  }

  .listing-field :deep(button) {
    justify-content: space-between;
  }

  .listing-field :deep(input::placeholder),
  .listing-field :deep(textarea::placeholder) {
    color: color-mix(in srgb, var(--ui-text-muted) 88%, transparent);
  }

  .listing-field :deep(input:hover),
  .listing-field :deep(textarea:hover),
  .listing-field :deep(button:hover) {
    border-color: color-mix(in srgb, var(--ui-primary) 26%, var(--ui-border) 74%);
  }

  .listing-field :deep(input:focus),
  .listing-field :deep(textarea:focus),
  .listing-field :deep(button:focus-visible) {
    border-color: color-mix(in srgb, var(--ui-primary) 55%, var(--ui-border) 45%);
    background: color-mix(in srgb, var(--ui-bg) 62%, var(--ui-primary) 8%);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-primary) 14%, transparent);
    outline: none;
  }

  @media (max-width: 640px) {
    .form-section {
      padding: 1rem;
    }

    .listing-field--textarea :deep(textarea) {
      min-height: 9rem;
    }
  }
</style>
