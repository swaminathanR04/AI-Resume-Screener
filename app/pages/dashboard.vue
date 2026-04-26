<script setup lang="ts">
  import { authClient } from '../utils/auth-client'

  const { data: users, pending, error } = await useFetch('/api/users')
  const { data: session } = await authClient.useSession(useFetch)

  const selectedFile = ref<File | null>(null)
  const imagePreview = ref<string>('')
  const isUploading = ref(false)
  const isModalOpen = ref(false)
  const sampleResumePdfPath = '/sample-resume.pdf'

  const currentUser = computed(() => session.value?.user)
  const { displayName } = useProfileDisplayName(
    computed(() => currentUser.value?.name || currentUser.value?.email || 'Admin User')
  )

  const inboxPlaceholders = ref([
    {
      id: 'msg-1',
      sender: 'Hiring Team',
      subject: 'New applicant uploaded',
      preview: 'A new resume was added for the Frontend Developer opening.',
      time: '2m ago',
    },
    {
      id: 'msg-2',
      sender: 'Screening Bot',
      subject: 'Resume screening complete',
      preview: 'Initial analysis finished for 12 newly submitted candidates.',
      time: '18m ago',
    },
    {
      id: 'msg-3',
      sender: 'Recruiting Ops',
      subject: 'Interview notes ready',
      preview: 'Notes were attached for the Product Designer candidate review.',
      time: '45m ago',
    },
  ])

  async function logout() {
    await authClient.signOut()
    await navigateTo('/auth', { external: true })
  }

  function getImageLink(user: { image: boolean; id: string }) {
    return user.image ? 'api/users/' + user.id + '/profile' : undefined
  }

  function removePlaceholderMessage(messageId: string) {
    inboxPlaceholders.value = inboxPlaceholders.value.filter((message) => message.id !== messageId)
  }

  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files as FileList

    if (!files || files.length === 0) return

    const file = files[0]

    if (!file?.type.startsWith('image/')) {
      return
    }

    selectedFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  function openModal() {
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  async function updatePfp() {
    if (!selectedFile.value) return

    isUploading.value = true

    try {
      const formData = new FormData()
      formData.append('file', selectedFile.value)

      await $fetch('/api/users/upload', {
        method: 'POST',
        body: formData,
      })

      await refreshNuxtData()

      selectedFile.value = null
      imagePreview.value = ''
      isModalOpen.value = false
    } catch (uploadError) {
      console.error('Upload failed:', uploadError)
    } finally {
      isUploading.value = false
    }
  }
</script>

<template>
  <ResumeScreenerShell title="Dashboard" active-section="dashboard">
    <section class="space-y-6">
      <UCard>
        <div class="grid gap-6 p-4 lg:grid-cols-[1.3fr_0.7fr] lg:p-6">
          <div class="space-y-3">
            <p class="text-sm font-medium text-[var(--ui-primary)]">Talent Acquisition Workspace</p>
            <h2 class="text-2xl font-semibold text-[var(--ui-text)] sm:text-3xl">
              Welcome back, {{ displayName }}
            </h2>
            <p class="max-w-2xl text-sm leading-6 text-[var(--ui-text-muted)] sm:text-base">
              This dashboard combines the admin controls from this branch with the TA inbox and
              resume review flow from the `TA_Functions` branch.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <p class="text-xs tracking-[0.12em] text-[var(--ui-text-muted)] uppercase">
                Applicants
              </p>
              <p class="mt-2 text-3xl font-semibold text-[var(--ui-text)]">
                {{ users?.length || 0 }}
              </p>
            </div>
            <div
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <p class="text-xs tracking-[0.12em] text-[var(--ui-text-muted)] uppercase">
                Inbox Items
              </p>
              <p class="mt-2 text-3xl font-semibold text-[var(--ui-text)]">
                {{ inboxPlaceholders.length }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p class="text-[var(--ui-text-muted)]">Manage your application users and settings.</p>
        </div>
        <div class="flex flex-wrap justify-between gap-4 md:items-center">
          <UModal :open="isModalOpen">
            <UButton
              color="success"
              variant="soft"
              @click="openModal"
              icon="i-heroicons-arrow-up-on-square-20-solid"
              label="Update Profile Picture"
            />

            <template #content>
              <div class="m-12 space-y-4 text-[var(--ui-text)]">
                <h3 class="text-lg font-medium text-[var(--ui-text)]">Update Profile Picture</h3>

                <div v-if="imagePreview" class="flex justify-center">
                  <UAvatar :src="imagePreview" size="3xl" />
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    class="block w-full cursor-pointer rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text-muted)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--ui-bg-elevated)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--ui-text)]"
                    @change="handleImageUpload"
                  />
                </div>

                <div class="flex justify-end gap-2">
                  <UButton variant="soft" @click="closeModal">Cancel</UButton>
                  <UButton
                    color="success"
                    :loading="isUploading"
                    :disabled="!selectedFile"
                    @click="updatePfp"
                  >
                    Upload
                  </UButton>
                </div>
              </div>
            </template>
          </UModal>

          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-arrow-right-on-rectangle-20-solid"
            label="Logout"
            @click="logout"
          />
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-[var(--ui-text)]">Inbox</h2>
                <p class="text-sm text-[var(--ui-text-muted)]">TA branch message placeholders</p>
              </div>
              <UBadge color="primary" variant="soft">{{ inboxPlaceholders.length }}</UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="message in inboxPlaceholders"
              :key="message.id"
              class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-[var(--ui-text)]">
                    {{ message.sender }}
                  </p>
                  <p class="mt-1 truncate text-sm text-[var(--ui-text)]">{{ message.subject }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-[var(--ui-text-muted)]">{{ message.time }}</span>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-trash-20-solid"
                    @click="removePlaceholderMessage(message.id)"
                  />
                </div>
              </div>
              <p class="mt-2 text-sm leading-6 text-[var(--ui-text-muted)]">
                {{ message.preview }}
              </p>
            </div>

            <div
              v-if="inboxPlaceholders.length === 0"
              class="py-6 text-center text-sm text-[var(--ui-text-muted)]"
            >
              Inbox cleared.
            </div>
          </div>
        </UCard>

        <div class="grid gap-6">
          <UCard>
            <template #header>
              <div>
                <h2 class="text-lg font-semibold text-[var(--ui-text)]">Latest Resume</h2>
                <p class="text-sm text-[var(--ui-text-muted)]">Jordan Lee</p>
              </div>
            </template>

            <div
              class="h-72 overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)]"
            >
              <iframe
                :src="sampleResumePdfPath"
                title="Sample resume preview"
                class="h-full w-full"
              />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-lg font-semibold text-[var(--ui-text)]">AI Overview</h2>
                <UBadge color="error" variant="soft">Rank: 8.6/10</UBadge>
              </div>
            </template>

            <div class="space-y-4 text-sm leading-6 text-[var(--ui-text-muted)]">
              <p>
                This candidate demonstrates strong alignment with a mid-level frontend engineering
                role. Their resume highlights hands-on experience building responsive web
                interfaces, collaborating across product and design teams, and shipping features in
                modern JavaScript frameworks.
              </p>
              <p>
                Strengths include solid technical breadth, clear teamwork experience, and evidence
                of delivering production-ready features from planning through release. Areas to
                explore further in an interview would be backend depth, testing strategy, and the
                scale of systems they have supported.
              </p>
            </div>
          </UCard>
        </div>
      </div>

      <UCard class="w-full">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-users-20-solid"
                class="h-5 w-5 text-[var(--ui-text-muted)]"
              />
              <h2 class="text-base leading-7 font-semibold text-[var(--ui-text)]">
                Registered Users
              </h2>
            </div>
            <UBadge variant="subtle" color="primary" size="md"
              >{{ users?.length || 0 }} Users</UBadge
            >
          </div>
        </template>

        <div v-if="pending" class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between py-2">
            <div class="flex w-full items-center gap-3">
              <USkeleton class="h-10 w-10 rounded-full" />
              <div class="w-full max-w-[200px] space-y-2">
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-3 w-2/3" />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="error">
          <UAlert
            icon="i-heroicons-exclamation-triangle-20-solid"
            color="error"
            variant="subtle"
            title="Error loading users"
            :description="error.message"
          />
        </div>

        <div v-else>
          <div
            v-for="user in users"
            :key="user.id"
            class="flex items-center justify-between border-t border-[var(--ui-border)] py-4 first:border-t-0 first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-3">
              <UAvatar :src="getImageLink(user)" :alt="user.name" size="md" :as="{ img: 'img' }" />
              <div>
                <p class="font-medium text-[var(--ui-text)]">{{ user.name }}</p>
                <p class="text-sm text-[var(--ui-text-muted)]">{{ user.email }}</p>
              </div>
            </div>
            <UBadge :color="user.emailVerified ? 'success' : 'warning'" variant="subtle" size="sm">
              {{ user.emailVerified ? 'Verified' : 'Pending' }}
            </UBadge>
          </div>

          <div v-if="users?.length === 0" class="py-8 text-center text-[var(--ui-text-muted)]">
            No users found.
          </div>
        </div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>
