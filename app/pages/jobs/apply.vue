<script setup lang="ts">
  import { authClient } from '../../utils/auth-client'

  const toast = useToast()
  const route = useRoute()

  const jobId = computed(() => Number(route.query.jobId || route.params.id || 0))
  const { data: session } = await useAsyncData('job-apply-session', async () =>
    authClient.getSession()
  )
  const { getJob, profile, submitApplication } = useApplicantPortal()

  const currentUser = computed(() => session.value?.data?.user)
  const job = computed(() => getJob(jobId.value))

  const state = reactive({
    fullName: '',
    email: '',
    phone: profile.value.phone,
    currentLocation: profile.value.address,
    education: profile.value.education,
    graduation: profile.value.graduation,
    experience: '',
    skills: profile.value.skills.join(', '),
    resumeFileName: '',
    coverLetterFileName: '',
    fitSummary: '',
    workAuthorization: 'Yes',
    sponsorship: 'No',
    commute: 'Yes',
    veteran: 'No',
    disability: 'Prefer not to answer',
  })

  watchEffect(() => {
    if (!state.fullName) {
      state.fullName = currentUser.value?.name || ''
    }

    if (!state.email) {
      state.email = currentUser.value?.email || ''
    }
  })

  function updateFileName(field: 'resumeFileName' | 'coverLetterFileName', event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    state[field] = file?.name || ''
  }

  async function handleSubmit() {
    if (!job.value) {
      toast.add({
        title: 'Job not found',
        description: 'Choose a valid job before applying.',
        color: 'error',
      })
      return
    }

    const application = submitApplication(job.value.id, {
      fullName: state.fullName,
      email: state.email,
      phone: state.phone,
      currentLocation: state.currentLocation,
      education: state.education,
      graduation: state.graduation,
      experience: state.experience,
      skills: state.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      resumeFileName: state.resumeFileName || 'resume.pdf',
      coverLetterFileName: state.coverLetterFileName || 'cover-letter.pdf',
      fitSummary: state.fitSummary,
      answers: {
        workAuthorization: state.workAuthorization,
        sponsorship: state.sponsorship,
        commute: state.commute,
        veteran: state.veteran,
        disability: state.disability,
      },
    })

    if (!application) {
      toast.add({
        title: 'Application failed',
        description: 'Unable to submit this application.',
        color: 'error',
      })
      return
    }

    toast.add({
      title: 'Application submitted',
      description: `Your ${job.value.title} application was saved.`,
      color: 'success',
    })
    await navigateTo(`/applications/${application.id}`)
  }
</script>

<template>
  <ApplicantPortalShell title="Apply" active-path="/jobs">
    <section v-if="job" class="space-y-6">
      <UCard>
        <div class="space-y-2 p-4 sm:p-6">
          <h2 class="text-2xl font-semibold text-[var(--ui-text)]">Apply for {{ job.title }}</h2>
          <p class="text-sm text-[var(--ui-text-muted)]">{{ job.location }}</p>
        </div>
      </UCard>

      <UCard>
        <div class="grid gap-4 p-4 sm:p-6">
          <UInput v-model="state.fullName" placeholder="Full Name" />
          <UInput v-model="state.email" placeholder="Email" />
          <UInput v-model="state.phone" placeholder="Phone Number" />
          <UInput v-model="state.currentLocation" placeholder="Current Location" />
          <UInput v-model="state.education" placeholder="Education" />
          <UInput v-model="state.graduation" placeholder="Expected Graduation" />
          <UTextarea v-model="state.experience" :rows="4" placeholder="Relevant Experience" />
          <UInput v-model="state.skills" placeholder="Skills, separated by commas" />

          <div class="grid gap-4 lg:grid-cols-2">
            <div
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <p class="mb-2 text-sm font-medium text-[var(--ui-text)]">Upload Resume</p>
              <input
                type="file"
                class="w-full text-sm text-[var(--ui-text-muted)]"
                @change="updateFileName('resumeFileName', $event)"
              />
              <p v-if="state.resumeFileName" class="mt-2 text-xs text-[var(--ui-text-muted)]">
                {{ state.resumeFileName }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <p class="mb-2 text-sm font-medium text-[var(--ui-text)]">Upload Cover Letter</p>
              <input
                type="file"
                class="w-full text-sm text-[var(--ui-text-muted)]"
                @change="updateFileName('coverLetterFileName', $event)"
              />
              <p v-if="state.coverLetterFileName" class="mt-2 text-xs text-[var(--ui-text-muted)]">
                {{ state.coverLetterFileName }}
              </p>
            </div>
          </div>

          <UTextarea
            v-model="state.fitSummary"
            :rows="4"
            placeholder="Why are you a good fit for this role?"
          />

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <UInput v-model="state.workAuthorization" placeholder="Authorized to work?" />
            <UInput v-model="state.sponsorship" placeholder="Need sponsorship?" />
            <UInput v-model="state.commute" placeholder="Can commute?" />
            <UInput v-model="state.veteran" placeholder="Veteran status" />
            <UInput v-model="state.disability" placeholder="Disability status" />
          </div>

          <div class="flex flex-wrap justify-end gap-3">
            <UButton to="/jobs" color="neutral" variant="soft" label="Cancel" />
            <UButton color="primary" label="Submit Application" @click="handleSubmit" />
          </div>
        </div>
      </UCard>
    </section>

    <UAlert
      v-else
      color="error"
      variant="soft"
      title="Job not found"
      description="Return to the jobs page and choose a valid listing before applying."
    />
  </ApplicantPortalShell>
</template>
