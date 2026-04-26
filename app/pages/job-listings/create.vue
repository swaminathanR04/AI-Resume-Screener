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
        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Job Information</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Job Title" required>
              <UInput v-model="state.jobTitle" placeholder="Software Engineer Intern" />
            </UFormField>
            <UFormField label="Location" required>
              <UInput v-model="state.location" placeholder="Onsite, Dallas, Texas" />
            </UFormField>
          </div>

          <div class="mt-4 max-w-md">
            <UFormField label="Employment Type" required>
              <USelect v-model="state.employmentType" :items="employmentTypeOptions" />
            </UFormField>
          </div>
        </div>

        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Job Description:</h2>
          <UTextarea
            v-model="state.jobDescription"
            :rows="6"
            placeholder="Describe the role, responsibilities, and expectations for this job listing."
          />
        </div>

        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Required Skills:</h2>
          <UTextarea
            v-model="state.requiredSkills"
            :rows="4"
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
