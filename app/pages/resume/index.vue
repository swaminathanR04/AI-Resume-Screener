<script setup lang="ts">
  const toast = useToast()

  type ApplicantSummary = {
    name: string
    resumePath: string | null
    applications: Array<{
      jobListingId: number
      appliedAt: string
    }>
  }

  const {
    data: applicantInfo,
    pending,
    error,
    refresh,
  } = await useFetch<ApplicantSummary>('/api/applicants/me')

  const selectedFile = ref<File | null>(null)
  const isUploading = ref(false)
  const fileInput = useTemplateRef<HTMLInputElement>('resume-file-input')
  const resumePreviewKey = ref(0)

  const resumePreviewUrl = computed(() => {
    if (!applicantInfo.value?.resumePath) {
      return ''
    }

    return `/api/applicants/resume?preview=${resumePreviewKey.value}`
  })

  function openFilePicker() {
    fileInput.value?.click()
  }

  function handleResumeSelection(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) {
      selectedFile.value = null
      return
    }

    if (file.type !== 'application/pdf') {
      toast.add({
        title: 'Invalid file type',
        description: 'Please upload a PDF resume.',
        color: 'error',
      })
      target.value = ''
      selectedFile.value = null
      return
    }

    selectedFile.value = file
  }

  async function uploadResume() {
    if (!selectedFile.value) {
      return
    }

    isUploading.value = true

    try {
      const formData = new FormData()
      formData.append('file', selectedFile.value)

      await $fetch('/api/applicants/resume', {
        method: 'POST',
        body: formData,
      })

      await refresh()
      resumePreviewKey.value += 1
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }

      toast.add({
        title: 'Resume uploaded',
        description: 'Your resume was saved to the server.',
        color: 'success',
      })
    } catch (uploadError) {
      const description =
        uploadError instanceof Error ? uploadError.message : 'Unable to upload your resume.'

      toast.add({
        title: 'Upload failed',
        description,
        color: 'error',
      })
    } finally {
      isUploading.value = false
    }
  }
</script>

<template>
  <ApplicantPortalShell title="Resume" active-path="/resume">
    <section class="space-y-6">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        title="Unable to load resume data"
        :description="error.message"
      />

      <UCard>
        <div class="space-y-4 p-4 sm:p-6">
          <div>
            <h2 class="text-xl font-semibold text-[var(--ui-text)]">Upload and View Your Resume</h2>
          </div>

          <UCard v-if="applicantInfo?.resumePath" class="overflow-hidden">
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-lg font-semibold text-[var(--ui-text)]">Resume Preview</h3>
                <UBadge color="success" variant="soft">PDF</UBadge>
              </div>
            </template>

            <div class="overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-white">
              <iframe
                :key="resumePreviewUrl"
                :src="resumePreviewUrl"
                title="Resume preview"
                class="h-[32rem] w-full"
              />
            </div>

            <p class="mt-4 text-sm font-medium text-[var(--ui-text)]">
              Current resume saved on the server.
            </p>
          </UCard>

          <div class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4">
            <input
              ref="resume-file-input"
              type="file"
              accept="application/pdf"
              class="hidden"
              @change="handleResumeSelection"
            />

            <button
              type="button"
              class="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--ui-border)] bg-[var(--ui-bg)] px-5 py-5 text-center transition hover:border-[var(--ui-primary)] hover:bg-[var(--ui-bg-muted)]"
              @click="openFilePicker"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ui-bg-elevated)] text-[var(--ui-primary)]"
              >
                <UIcon name="i-heroicons-document-arrow-up-20-solid" class="h-5 w-5" />
              </div>

              <p class="mt-3 text-base font-semibold text-[var(--ui-text)]">Choose PDF Resume</p>
              <p class="mt-1 max-w-2xl text-sm text-[var(--ui-text-muted)]">
                Select a single PDF file to save under your applicant profile.
              </p>

              <div
                class="mt-3 rounded-full border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-2 text-sm text-[var(--ui-text-muted)]"
              >
                {{ selectedFile?.name || 'No file chosen' }}
              </div>
            </button>

            <p v-if="selectedFile" class="mt-3 text-sm font-medium text-[var(--ui-text)]">
              {{ applicantInfo?.resumePath ? 'Ready to replace:' : 'Ready to upload:' }}
              {{ selectedFile.name }}
            </p>

            <p
              v-else-if="!pending && !applicantInfo?.resumePath"
              class="mt-3 text-sm text-[var(--ui-text-muted)]"
            >
              No resume uploaded yet.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <UButton
              color="primary"
              :label="applicantInfo?.resumePath ? 'Update Resume' : 'Upload Resume'"
              :disabled="!selectedFile"
              :loading="isUploading"
              @click="uploadResume"
            />

            <UButton
              v-if="applicantInfo?.resumePath"
              to="/api/applicants/resume"
              target="_blank"
              color="neutral"
              variant="soft"
              label="View Current Resume"
            />
          </div>
        </div>
      </UCard>
    </section>
  </ApplicantPortalShell>
</template>
