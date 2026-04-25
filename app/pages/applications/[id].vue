<script setup lang="ts">
  const toast = useToast()
  const route = useRoute()
  const applicationId = computed(() => Number(route.params.id))

  const { getApplication, getJob, withdrawApplication } = useApplicantPortal()

  const application = computed(() => getApplication(applicationId.value))
  const job = computed(() => getJob(application.value?.jobId || 0))

  function withdraw() {
    if (!application.value) {
      return
    }

    if (!withdrawApplication(application.value.id)) {
      return
    }

    toast.add({
      title: 'Application withdrawn',
      description: 'This application is now marked as withdrawn.',
      color: 'warning',
    })
  }
</script>

<template>
  <ApplicantPortalShell
    :title="application?.title || 'Application Details'"
    active-path="/applications"
  >
    <section v-if="application" class="space-y-6">
      <UCard>
        <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div>
            <p class="text-xl font-semibold text-[var(--ui-text)]">{{ application.title }}</p>
            <p class="text-sm text-[var(--ui-text-muted)]">{{ application.location }}</p>
          </div>

          <div class="space-y-2 text-sm text-[var(--ui-text-muted)] sm:text-right">
            <p>Status: {{ application.status }}</p>
            <p>Applied on {{ application.applied }}</p>
            <div class="flex flex-wrap justify-end gap-2">
              <UButton
                v-if="job"
                :to="`/jobs/${job.id}`"
                color="neutral"
                variant="soft"
                label="View Job"
              />
              <UButton
                color="error"
                variant="soft"
                label="Withdraw"
                :disabled="application.status === 'Withdrawn'"
                @click="withdraw"
              />
            </div>
          </div>
        </div>
      </UCard>

      <div class="grid gap-6 xl:grid-cols-3">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Applicant Information</h2>
          </template>
          <div class="space-y-3 text-sm text-[var(--ui-text-muted)]">
            <div>
              <span class="font-medium text-[var(--ui-text)]">Name:</span>
              {{ application.fullName }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Location:</span>
              {{ application.currentLocation }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Email:</span> {{ application.email }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Phone:</span> {{ application.phone }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Education:</span>
              {{ application.education }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Expected Graduation:</span>
              {{ application.graduation }}
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Experience & Questions</h2>
          </template>
          <div class="space-y-4 text-sm text-[var(--ui-text-muted)]">
            <div>
              <p class="font-medium text-[var(--ui-text)]">Experience</p>
              <p class="mt-1 leading-6">{{ application.experience }}</p>
            </div>
            <div>
              <p class="font-medium text-[var(--ui-text)]">Questions</p>
              <div class="mt-2 space-y-1">
                <div>Authorized to work? {{ application.answers.workAuthorization }}</div>
                <div>Need sponsorship? {{ application.answers.sponsorship }}</div>
                <div>Can commute? {{ application.answers.commute }}</div>
                <div>Veteran? {{ application.answers.veteran }}</div>
                <div>Disability? {{ application.answers.disability }}</div>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Documents & Skills</h2>
          </template>
          <div class="space-y-4 text-sm text-[var(--ui-text-muted)]">
            <div>
              <p class="font-medium text-[var(--ui-text)]">Skills</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="skill in application.skills"
                  :key="skill"
                  color="primary"
                  variant="soft"
                >
                  {{ skill }}
                </UBadge>
              </div>
            </div>
            <div>
              <p class="font-medium text-[var(--ui-text)]">Resume</p>
              <p class="mt-1">{{ application.resumeFileName }}</p>
            </div>
            <div>
              <p class="font-medium text-[var(--ui-text)]">Cover Letter</p>
              <p class="mt-1">{{ application.coverLetterFileName }}</p>
            </div>
            <div>
              <p class="font-medium text-[var(--ui-text)]">Why you are a fit</p>
              <p class="mt-1 leading-6">{{ application.fitSummary }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <UAlert
      v-else
      color="error"
      variant="soft"
      title="Application not found"
      description="The requested application could not be found."
    />
  </ApplicantPortalShell>
</template>
