<script setup lang="ts">
  import { authClient } from '../../utils/auth-client'

  const toast = useToast()
  const { data: session } = await authClient.useSession(useFetch)
  const { profile } = useApplicantPortal()

  const currentUser = computed(() => session.value?.user)
  const { displayName } = useProfileDisplayName(
    computed(() => currentUser.value?.name || currentUser.value?.email || 'Applicant User')
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
    } catch (error) {
      toast.add({
        title: 'Upload failed',
        description: 'Unable to update your profile picture.',
        color: 'error',
      })
    } finally {
      isUploading.value = false
    }
  }
</script>

<template>
  <ApplicantPortalShell title="Profile" active-path="/profile">
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
              <p class="text-2xl font-semibold text-[var(--ui-text)]">
                {{ displayName }}
              </p>
              <p class="text-sm text-[var(--ui-text-muted)]">{{ currentUser?.email }}</p>
            </div>
          </div>

          <UModal :open="isModalOpen">
            <UButton
              color="primary"
              variant="soft"
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
                  class="w-full text-sm text-[var(--ui-text-muted)]"
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

      <div class="grid gap-6 lg:grid-cols-2">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Contact</h2>
          </template>
          <div class="space-y-3 text-sm text-[var(--ui-text-muted)]">
            <div>
              <span class="font-medium text-[var(--ui-text)]">Phone:</span> {{ profile.phone }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Address:</span> {{ profile.address }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Education:</span>
              {{ profile.education }}
            </div>
            <div>
              <span class="font-medium text-[var(--ui-text)]">Expected Graduation:</span>
              {{ profile.graduation }}
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-[var(--ui-text)]">Skills</h2>
          </template>
          <div class="flex flex-wrap gap-2">
            <UBadge v-for="skill in profile.skills" :key="skill" color="primary" variant="soft">
              {{ skill }}
            </UBadge>
          </div>
        </UCard>
      </div>
    </section>
  </ApplicantPortalShell>
</template>
