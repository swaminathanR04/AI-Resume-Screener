<script setup lang="ts">
  import { authClient } from '../utils/auth-client'

  const toast = useToast()
  const { data: session } = await authClient.useSession(useFetch)
  const { data: users } = await useFetch<Array<{ id: string }>>('/api/users')

  const currentUser = computed(() => session.value?.user)
  const { displayName } = useProfileDisplayName(
    computed(() => currentUser.value?.name || currentUser.value?.email || 'Admin User')
  )

  const selectedFile = ref<File | null>(null)
  const imagePreview = ref('')
  const isUploading = ref(false)
  const isModalOpen = ref(false)

  function getProfileImageLink() {
    if (!currentUser.value?.id || !currentUser.value?.image) {
      return undefined
    }

    return `/api/users/${currentUser.value.id}/profile`
  }

  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file || !file.type.startsWith('image/')) {
      return
    }

    selectedFile.value = file

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      imagePreview.value = String(loadEvent.target?.result || '')
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
    if (!selectedFile.value) {
      return
    }

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

      toast.add({
        title: 'Profile updated',
        description: 'Your profile picture was updated.',
        color: 'success',
      })
    } catch {
      toast.add({
        title: 'Upload failed',
        description: 'Unable to update your profile picture.',
        color: 'error',
      })
    } finally {
      isUploading.value = false
    }
  }

  async function logout() {
    await authClient.signOut()
    await navigateTo('/auth', { external: true })
  }
</script>

<template>
  <ResumeScreenerShell title="Profile" active-section="profile">
    <section class="space-y-6">
      <UCard>
        <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div class="flex items-center gap-4">
            <UAvatar
              :src="imagePreview || getProfileImageLink()"
              :alt="displayName"
              icon="i-heroicons-user-circle-20-solid"
              color="primary"
              variant="soft"
              size="3xl"
              :as="{ img: 'img' }"
            />
            <div>
              <p class="text-2xl font-semibold text-[var(--ui-text)]">{{ displayName }}</p>
              <p class="text-sm text-[var(--ui-text-muted)]">{{ currentUser?.email }}</p>
            </div>
          </div>

          <UModal :open="isModalOpen">
            <UButton
              color="primary"
              variant="soft"
              icon="i-heroicons-arrow-up-on-square-20-solid"
              label="Update Profile Picture"
              @click="openModal"
            />

            <template #content>
              <div class="m-8 space-y-4 text-[var(--ui-text)]">
                <h3 class="text-lg font-medium">Update Profile Picture</h3>

                <div v-if="imagePreview" class="flex justify-center">
                  <UAvatar :src="imagePreview" size="3xl" />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  class="block w-full cursor-pointer rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text-muted)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--ui-bg-elevated)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--ui-text)]"
                  @change="handleImageUpload"
                />

                <div class="flex justify-end gap-2">
                  <UButton color="neutral" variant="soft" label="Cancel" @click="closeModal" />
                  <UButton
                    color="primary"
                    :loading="isUploading"
                    :disabled="!selectedFile"
                    label="Upload"
                    @click="updatePfp"
                  />
                </div>
              </div>
            </template>
          </UModal>
        </div>
      </UCard>

      <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Account</h2>
          </template>

          <div class="space-y-3 text-sm text-[var(--ui-text-muted)]">
            <div>
              <span class="font-medium text-[var(--ui-text)]">Name:</span> {{ displayName }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Email:</span>
              {{ currentUser?.email || 'Not available' }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Role:</span> Admin
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Registered users:</span>
              {{ users?.length || 0 }}
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Session</h2>
          </template>

          <div class="space-y-4">
            <p class="text-sm leading-6 text-[var(--ui-text-muted)]">
              Manage your admin account here instead of from the dashboard.
            </p>
            <UButton
              color="error"
              variant="soft"
              icon="i-heroicons-arrow-right-on-rectangle-20-solid"
              label="Logout"
              @click="logout"
            />
          </div>
        </UCard>
      </div>
    </section>
  </ResumeScreenerShell>
</template>