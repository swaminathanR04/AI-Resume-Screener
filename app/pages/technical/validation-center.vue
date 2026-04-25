<script setup lang="ts">
  const toast = useToast()

  const queueMetrics = computed(() => {
    const pending = recentUploads.value.filter((upload) => upload.status === 'Pending').length
    const inProgress = recentUploads.value.filter((upload) => upload.status === 'Checking').length
    const failed = recentUploads.value.filter((upload) => upload.status === 'Rejected').length

    return [
      { label: 'Pending', value: pending },
      { label: 'In Progress', value: inProgress },
      { label: 'Failed', value: failed },
    ]
  })

  const latestCheck = ref({
    file: 'alex-carter-resume.pdf',
    fileType: 'Valid PDF',
    readability: 'Passed',
    duplicate: 'No duplicate found',
  })

  const errorRules = [
    'Corrupted file: reject upload.',
    'Unreadable file: request resubmission.',
    'Unsupported format: block and show an error.',
    'Duplicate detected: flag for admin review.',
  ]

  const recentUploads = ref([
    {
      id: 1,
      file: 'jamie_lee_resume.pdf',
      status: 'Pending',
      note: 'Waiting for readability scan',
    },
    {
      id: 2,
      file: 'michael_chen_resume.pdf',
      status: 'Checking',
      note: 'Readability scan in progress',
    },
    {
      id: 3,
      file: 'taylor_adams_resume.pdf',
      status: 'Rejected',
      note: 'Corrupted upload detected',
    },
  ])

  function getStatusColor(status: string) {
    if (status === 'Rejected') return 'error'
    if (status === 'Checking') return 'warning'
    return 'success'
  }

  function resetRules() {
    toast.add({
      title: 'Rules reset',
      description: 'Validation rules were restored to the Technical-UI defaults.',
      color: 'neutral',
    })
  }

  function runFullCheck() {
    const pendingUpload = recentUploads.value.find((upload) => upload.status === 'Pending')

    if (!pendingUpload) {
      toast.add({
        title: 'Validation queue is clear',
        description: 'There are no pending uploads to process right now.',
        color: 'neutral',
      })
      return
    }

    pendingUpload.status = 'Checking'
    pendingUpload.note = 'Validation started from the technical dashboard.'
    latestCheck.value = {
      file: pendingUpload.file,
      fileType: 'Valid PDF',
      readability: 'Running',
      duplicate: 'Queued for duplicate scan',
    }

    toast.add({
      title: 'Validation started',
      description: `${pendingUpload.file} is now being checked.`,
      color: 'primary',
    })
  }

  function sendToAi() {
    const checkedUpload = recentUploads.value.find((upload) => upload.status === 'Checking')

    if (!checkedUpload) {
      toast.add({
        title: 'No validated file ready',
        description: 'Run a check before sending a resume to AI processing.',
        color: 'warning',
      })
      return
    }

    checkedUpload.status = 'Completed'
    checkedUpload.note = 'Validation passed and sent to AI analysis.'
    latestCheck.value.readability = 'Passed'
    latestCheck.value.duplicate = 'No duplicate found'

    toast.add({
      title: 'Sent to AI',
      description: `${checkedUpload.file} moved to the processing queue.`,
      color: 'success',
    })
  }
</script>

<template>
  <ResumeScreenerShell
    title="Validation Center"
    active-section="technical"
    active-sub-item="Validation Center"
  >
    <section class="space-y-6">
      <div class="flex flex-wrap justify-between gap-3">
        <div>
          <p class="text-sm text-[var(--ui-text-muted)]">
            Verify resume uploads before they are sent to AI processing.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <UButton color="neutral" variant="soft" label="Reset Rules" @click="resetRules" />
          <UButton color="primary" variant="soft" label="Run Full Check" @click="runFullCheck" />
        </div>
      </div>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Validation Overview</h2>
            <UBadge color="success" variant="soft">Accepted format: PDF only</UBadge>
          </div>
        </template>

        <div class="space-y-6">
          <div class="grid gap-4 md:grid-cols-3">
            <div
              v-for="metric in queueMetrics"
              :key="metric.label"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <p class="text-sm text-[var(--ui-text-muted)]">{{ metric.label }}</p>
              <p class="mt-2 text-3xl font-semibold text-[var(--ui-text)]">{{ metric.value }}</p>
            </div>
          </div>

          <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-5">
              <h3 class="text-lg font-semibold text-[var(--ui-text)]">Latest Check</h3>
              <div class="mt-4 space-y-3 text-sm text-[var(--ui-text-muted)]">
                <div><span class="font-medium text-[var(--ui-text)]">File:</span> {{ latestCheck.file }}</div>
                <div>
                  <span class="font-medium text-[var(--ui-text)]">File Type:</span>
                  {{ latestCheck.fileType }}
                </div>
                <div>
                  <span class="font-medium text-[var(--ui-text)]">Readability:</span>
                  {{ latestCheck.readability }}
                </div>
                <div>
                  <span class="font-medium text-[var(--ui-text)]">Duplicate Check:</span>
                  {{ latestCheck.duplicate }}
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-5">
              <h3 class="text-lg font-semibold text-[var(--ui-text)]">Error Rules</h3>
              <div class="mt-4 space-y-3 text-sm leading-6 text-[var(--ui-text-muted)]">
                <div
                  v-for="rule in errorRules"
                  :key="rule"
                  class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] px-4 py-3"
                >
                  {{ rule }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton color="primary" label="Run Check" @click="runFullCheck" />
            <UButton color="success" variant="soft" label="Send to AI" @click="sendToAi" />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Recent Upload Activity</h2>
            <UBadge color="neutral" variant="soft">Validation Queue</UBadge>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="upload in recentUploads"
            :key="upload.id"
            class="flex flex-col gap-3 rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="font-medium text-[var(--ui-text)]">{{ upload.file }}</p>
              <p class="text-sm text-[var(--ui-text-muted)]">{{ upload.note }}</p>
            </div>

            <UBadge :color="getStatusColor(upload.status)" variant="soft" size="lg">
              {{ upload.status }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>