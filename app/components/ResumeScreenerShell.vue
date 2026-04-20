<script setup lang="ts">
  type SectionKey = 'resumes' | 'job-listings' | 'audit-log' | 'ai-config'

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

  const sections = computed<NavSection[]>(() => [
    {
      key: 'resumes',
      label: 'Resumes',
      items: [
        { label: 'All' },
        { label: 'Accepted' },
        { label: 'Rejected' },
        { label: 'Archived' },
      ],
    },
    {
      key: 'job-listings',
      label: 'Job Listings',
      items: [{ label: 'List' }, { label: 'Create New', to: '/job-listings/create' }],
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
  ])

  function isSectionActive(section: NavSection) {
    return section.key === props.activeSection
  }

  function isSubItemActive(item: NavItem) {
    return item.label === props.activeSubItem
  }
</script>

<template>
  <div class="resume-shell lg:flex">
    <aside class="resume-sidebar flex w-full shrink-0 flex-col p-3 lg:min-h-screen lg:w-[155px]">
      <div class="mb-5 flex items-start gap-3 border-b border-white/20 pb-4">
        <div class="h-7 w-7 shrink-0 bg-white/95"></div>
        <div class="leading-tight">
          <p class="text-[0.95rem] font-semibold">Steve Jobs</p>
          <p class="text-xs text-white/80">Admin</p>
        </div>
      </div>

      <nav class="space-y-3">
        <div
          v-for="section in sections"
          :key="section.key"
          class="border border-black/10 bg-white/95 text-[#1d1d1d] shadow-[2px_2px_0_rgba(0,0,0,0.06)]"
        >
          <NuxtLink
            v-if="section.to"
            :to="section.to"
            class="flex items-center justify-between px-3 py-2 text-[0.97rem]"
            :class="isSectionActive(section) ? 'bg-[#a8d9d4]' : ''"
          >
            <span>{{ section.label }}</span>
            <span class="resume-chevron text-xl leading-none">›</span>
          </NuxtLink>

          <div v-else>
            <div class="flex items-center justify-between px-3 py-2 text-[0.97rem]">
              <span>{{ section.label }}</span>
              <span class="resume-chevron text-xl leading-none">⌄</span>
            </div>

            <div
              class="space-y-0.5 border-t border-black/10 bg-[#e7e7e7] px-3 py-2 text-[0.85rem]"
              :class="isSectionActive(section) ? '' : 'text-[#9c9c9c]'"
            >
              <template v-for="item in section.items" :key="item.label">
                <NuxtLink
                  v-if="item.to"
                  :to="item.to"
                  class="block w-full text-left hover:text-black"
                  :class="[
                    isSubItemActive(item) ? 'bg-[#c7ece8] px-1 text-black' : '',
                    !isSectionActive(section) ? 'resume-link-muted' : '',
                  ]"
                >
                  {{ item.label }}
                </NuxtLink>

                <button
                  v-else
                  type="button"
                  class="block w-full text-left"
                  :class="[
                    isSubItemActive(item) ? 'bg-[#c7ece8] px-1 text-black' : '',
                    !isSectionActive(section) ? 'resume-link-muted' : '',
                  ]"
                >
                  {{ item.label }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </nav>

      <div class="mt-auto pt-6 text-[0.95rem] font-bold tracking-wide">LOGO</div>
    </aside>

    <main class="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-4 lg:py-4">
      <div class="mx-auto max-w-6xl bg-white/55 p-2 lg:min-h-[calc(100vh-2rem)]">
        <div class="px-2 py-1 sm:px-4 lg:px-3">
          <h1 class="mb-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-[2.1rem]">
            {{ title }}
          </h1>
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
