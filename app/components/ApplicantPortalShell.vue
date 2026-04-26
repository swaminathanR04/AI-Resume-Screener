<script setup lang="ts">
  import { authClient } from '~/utils/auth-client'

  const props = defineProps<{
    title: string
    activePath: string
  }>()

  const colorMode = useColorMode()

  const { data: session } = await authClient.useSession(useFetch)

  const currentUser = computed(() => session.value?.user)
  const { displayName } = useProfileDisplayName(
    computed(() => currentUser.value?.name || currentUser.value?.email || 'Applicant User')
  )

  const navItems = [
    { label: 'Jobs', to: '/jobs' },
    { label: 'Resume', to: '/resume' },
    { label: 'Notifications', to: '/notifications' },
    { label: 'Applications', to: '/applications' },
    { label: 'Profile', to: '/profile' },
  ]

  const colorModeIcon = computed(() =>
    colorMode.value === 'dark' ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'
  )

  const colorModeLabel = computed(() =>
    colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  )

  function toggleColorMode() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  function getProfileImageLink() {
    if (!currentUser.value?.id || !currentUser.value?.image) {
      return undefined
    }

    return `/api/users/${currentUser.value.id}/profile`
  }

  async function logout() {
    await authClient.signOut()
    await navigateTo('/auth', { external: true })
  }
</script>

<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <div class="border-b border-[var(--ui-border)] bg-[var(--ui-bg-elevated)]">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8"
      >
        <div class="flex items-center gap-3">
          <UAvatar
            :src="getProfileImageLink()"
            :alt="displayName"
            icon="i-heroicons-user-circle-20-solid"
            color="primary"
            variant="soft"
            size="lg"
            :as="{ img: 'img' }"
          />
          <div>
            <p class="text-sm font-semibold text-[var(--ui-text)]">{{ displayName }}</p>
            <p class="text-xs text-[var(--ui-text-muted)]">Applicant</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
            :class="
              props.activePath === item.to
                ? 'bg-[var(--ui-primary)] text-white'
                : 'bg-[var(--ui-bg)] text-[var(--ui-text)] hover:bg-[var(--ui-bg-muted)]'
            "
          >
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2">
          <ClientOnly>
            <UButton
              color="neutral"
              variant="soft"
              :icon="colorModeIcon"
              :label="colorModeLabel"
              @click="toggleColorMode"
            />
          </ClientOnly>
          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-arrow-right-on-rectangle-20-solid"
            label="Logout"
            @click="logout"
          />
        </div>
      </div>
    </div>

    <main class="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
      <div
        class="rounded-3xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-5 shadow-sm sm:p-6 lg:p-8"
      >
        <div class="mb-6 border-b border-[var(--ui-border)] pb-4">
          <h1 class="text-3xl font-semibold tracking-tight text-[var(--ui-text)] sm:text-4xl">
            {{ title }}
          </h1>
        </div>
        <slot />
      </div>
    </main>
  </div>
</template>
