<script setup lang="ts">
  import { authClient } from '~/utils/auth-client'

  type SectionKey =
    | 'resumes'
    | 'job-listings'
    | 'audit-log'
    | 'ai-config'
    | 'dashboard'
    | 'technical'

  type NavItem = {
    label: string
    to?: string
  }

  type NavSection = {
    key: SectionKey
    label: string
    to?: string
    items?: NavItem[]
  }

  const props = defineProps<{
    title: string
    activeSection: SectionKey
    activeSubItem?: string
  }>()

  const colorMode = useColorMode()
  const isMobileSidebarOpen = ref(false)

  const { data: session } = await authClient.useSession(useFetch)

  const currentUser = computed(() => session.value?.user)
  const { displayName } = useProfileDisplayName(
    computed(() => currentUser.value?.name || currentUser.value?.email || 'Admin User')
  )

  const sections = computed<NavSection[]>(() => [
    {
      key: 'dashboard',
      label: 'Dashboard',
      to: '/dashboard',
    },
    {
      key: 'resumes',
      label: 'Resumes',
      items: [
        { label: 'All', to: '/allresumes' },
        { label: 'Accepted', to: '/accepted' },
        { label: 'Rejected', to: '/rejected' },
        { label: 'Archived', to: '/archived' },
      ],
    },
    {
      key: 'job-listings',
      label: 'Job Listings',
      items: [
        { label: 'List', to: '/joblist' },
        { label: 'Create New', to: '/job-listings/create' },
      ],
    },
    {
      key: 'audit-log',
      label: 'Audit Log',
      to: '/audit-log',
    },
    {
      key: 'ai-config',
      label: 'AI Config',
      to: '/ai-config',
    },
    {
      key: 'technical',
      label: 'Technical',
      items: [
        { label: 'Overview', to: '/technical' },
        { label: 'Validation Center', to: '/technical/validation-center' },
        { label: 'System Health', to: '/technical/system-health' },
        { label: 'Processing Queue', to: '/technical/processing-queue' },
        { label: 'Technical Audit Log', to: '/technical/audit-log' },
      ],
    },
  ])

  function isSectionActive(section: NavSection) {
    return section.key === props.activeSection
  }

  function isSubItemActive(item: NavItem) {
    return item.label === props.activeSubItem
  }

  const colorModeIcon = computed(() =>
    colorMode.value === 'dark' ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'
  )

  const colorModeLabel = computed(() =>
    colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  )

  function toggleColorMode() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  function toggleMobileSidebar() {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen.value = false
  }

  function getProfileImageLink() {
    if (!currentUser.value?.id || !currentUser.value?.image) {
      return undefined
    }

    return `/api/users/${currentUser.value.id}/profile`
  }
</script>

<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <div class="min-h-screen lg:flex">
      <aside
        class="flex w-full shrink-0 flex-col border-b border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] lg:min-h-screen lg:w-72 lg:border-r lg:border-b-0"
      >
        <div class="border-b border-[var(--ui-border)] p-4 sm:p-5">
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-start gap-3">
              <UAvatar
                :src="getProfileImageLink()"
                :alt="displayName"
                icon="i-heroicons-user-circle-20-solid"
                color="primary"
                variant="soft"
                size="lg"
                :as="{ img: 'img' }"
              />
              <div class="min-w-0 leading-tight">
                <p class="truncate text-sm font-semibold text-[var(--ui-text)]">{{ displayName }}</p>
                <p class="truncate text-xs text-[var(--ui-text-muted)]">Admin</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <ClientOnly>
                <UButton
                  color="neutral"
                  variant="soft"
                  :icon="colorModeIcon"
                  square
                  :aria-label="colorModeLabel"
                  @click="toggleColorMode"
                />
              </ClientOnly>

              <UButton
                class="lg:hidden"
                color="neutral"
                variant="soft"
                :icon="
                  isMobileSidebarOpen ? 'i-heroicons-x-mark-20-solid' : 'i-heroicons-bars-3-20-solid'
                "
                square
                :aria-label="isMobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'"
                @click="toggleMobileSidebar"
              />
            </div>
          </div>
        </div>

        <nav
          class="flex-1 space-y-3 p-4"
          :class="isMobileSidebarOpen ? 'block' : 'hidden lg:block'"
        >
          <div
            v-for="section in sections"
            :key="section.key"
            class="overflow-hidden rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] shadow-sm"
          >
            <NuxtLink
              v-if="section.to"
              :to="section.to"
              class="flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors"
              :class="
                isSectionActive(section)
                  ? 'border-l-4 border-[var(--ui-primary)] bg-[var(--ui-bg-elevated)] text-[var(--ui-primary)]'
                  : 'text-[var(--ui-text)] hover:bg-[var(--ui-bg-muted)]'
              "
              @click="closeMobileSidebar"
            >
              <span>{{ section.label }}</span>
              <UIcon name="i-heroicons-chevron-right-20-solid" class="h-4 w-4" />
            </NuxtLink>

            <div v-else>
              <div
                class="flex items-center justify-between px-4 py-3 text-sm font-medium text-[var(--ui-text)]"
              >
                <span>{{ section.label }}</span>
                <UIcon
                  name="i-heroicons-chevron-down-20-solid"
                  class="h-4 w-4 text-[var(--ui-text-muted)]"
                />
              </div>

              <div
                class="space-y-1 border-t border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-3 py-3 text-sm"
                :class="!isSectionActive(section) ? 'text-[var(--ui-text-muted)]' : ''"
              >
                <template v-for="item in section.items" :key="item.label">
                  <NuxtLink
                    v-if="item.to"
                    :to="item.to"
                    class="block rounded-md px-2 py-1.5 transition-colors"
                    :class="[
                      isSubItemActive(item)
                        ? 'bg-[var(--ui-bg)] font-medium text-[var(--ui-primary)]'
                        : 'hover:bg-[var(--ui-bg)]',
                      !isSectionActive(section)
                        ? 'text-[var(--ui-text-muted)]'
                        : 'text-[var(--ui-text)]',
                    ]"
                    @click="closeMobileSidebar"
                  >
                    {{ item.label }}
                  </NuxtLink>

                  <button
                    v-else
                    type="button"
                    class="block w-full rounded-md px-2 py-1.5 text-left transition-colors"
                    :class="[
                      isSubItemActive(item)
                        ? 'bg-[var(--ui-bg)] font-medium text-[var(--ui-primary)]'
                        : 'hover:bg-[var(--ui-bg)]',
                      !isSectionActive(section)
                        ? 'text-[var(--ui-text-muted)]'
                        : 'text-[var(--ui-text)]',
                    ]"
                  >
                    {{ item.label }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </nav>

        <div
          class="border-t border-[var(--ui-border)] px-4 py-4 text-sm font-semibold text-[var(--ui-text-muted)]"
          :class="isMobileSidebarOpen ? 'block' : 'hidden lg:block'"
        >
          AI Resume Screener
        </div>
      </aside>

      <main class="min-w-0 flex-1 bg-[var(--ui-bg-muted)]/40 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div
          class="mx-auto max-w-6xl rounded-3xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-4 shadow-sm sm:p-6 lg:min-h-[calc(100vh-4rem)] lg:p-8"
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
  </div>
</template>
