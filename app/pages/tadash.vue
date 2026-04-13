<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

const expandedTabs = ref<Set<string>>(new Set())

const { data: session } = await useAsyncData('session', async () => {
  return authClient.getSession()
})

const currentUser = computed(() => session.value?.data?.user)
const isEditingDisplayName = ref(false)
const { displayName } = useProfileDisplayName(computed(() => currentUser.value?.email || 'user@example.com'))
const sampleResumePdfPath = '/sample-resume.pdf'

const getProfileImageLink = () => {
  if (!currentUser.value?.id || !currentUser.value?.image) {
    return undefined
  }

  return `/api/users/${currentUser.value.id}/profile`
}

const startEditingDisplayName = () => {
  isEditingDisplayName.value = true
}

const stopEditingDisplayName = () => {
  if (!displayName.value.trim()) {
    displayName.value = currentUser.value?.email || 'user@example.com'
  }

  isEditingDisplayName.value = false
}

const tabs = [
  {
    id: 'tab1',
    label: 'Resumes',
    icon: 'i-heroicons:document-20-solid',
    submenu: [
      { id: 'tab1-1', label: 'All', route: '/allresumes' },
      { id: 'tab1-2', label: 'Accepted', route: '/accepted' },
      { id: 'tab1-3', label: 'Rejected', route: '/rejected' },
      { id: 'tab1-4', label: 'Archived', route: '/archived' },
    ],
  },
  {
    id: 'tab2',
    label: 'Job Listings',
    icon: 'i-heroicons:briefcase-20-solid',
    submenu: [
      { id: 'tab2-1', label: 'List', route: '/joblist' },
      { id: 'tab2-2', label: 'Create New', route: '/createnewjob' },
    ],
  },
  {
    id: 'tab3',
    label: 'Audit Log',
    icon: 'i-heroicons:clock-20-solid',
    submenu: [],
  },
  {
    id: 'tab4',
    label: 'AI Config',
    icon: 'i-heroicons:cog-6-tooth-20-solid',
    submenu: [],
  },
]

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
  {
    id: 'msg-4',
    sender: 'System Alert',
    subject: 'Profile update requested',
    preview: 'A candidate has updated contact details and portfolio links.',
    time: '1h ago',
  },
  {
    id: 'msg-5',
    sender: 'Talent Pipeline',
    subject: 'Shortlist refreshed',
    preview: 'Your shortlist for the Backend Engineer role has been updated.',
    time: '3h ago',
  },
  {
    id: 'msg-6',
    sender: 'Admin',
    subject: 'Reminder',
    preview: 'Placeholder inbox items can be replaced with real data later.',
    time: 'Today',
  },
])

const removePlaceholderMessage = (messageId: string) => {
  inboxPlaceholders.value = inboxPlaceholders.value.filter((message) => message.id !== messageId)
}

const toggleTab = (tabId: string) => {
  if (expandedTabs.value.has(tabId)) {
    expandedTabs.value.delete(tabId)
  } else {
    expandedTabs.value.add(tabId)
  }
}

const isTabExpanded = (tabId: string) => expandedTabs.value.has(tabId)
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left Sidebar -->
    <div class="w-64 shadow-lg flex flex-col" style="background-color: #4D86F9;">
      <!-- User Profile Section -->
      <div class="p-6" style="border-bottom: 1px solid rgba(255, 255, 255, 0.24);">
        <button
          class="w-full flex items-center gap-4 rounded-lg bg-white/95 hover:bg-white transition-colors p-3"
          @click="navigateTo('/tadash')"
        >
          <UAvatar
            :src="getProfileImageLink()"
            :alt="currentUser?.name || 'User'"
            size="lg"
            :as="{ img: 'img' }"
            class="flex-shrink-0"
          />
          <div class="flex-1 min-w-0 text-left">
            <button
              v-if="!isEditingDisplayName"
              type="button"
              class="block w-full truncate text-left text-sm font-semibold text-gray-900 hover:text-blue-600"
              @click.stop="startEditingDisplayName"
            >
              {{ displayName }}
            </button>
            <input
              v-else
              v-model="displayName"
              type="text"
              class="w-full rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-sm font-semibold text-gray-900 outline-none ring-2 ring-blue-200"
              @blur="stopEditingDisplayName"
              @keyup.enter="stopEditingDisplayName"
              @click.stop
              autofocus
            />
            <p class="text-xs text-gray-600 truncate">Admin</p>
          </div>
        </button>
      </div>

      <!-- Navigation Tabs -->
      <nav class="mt-6 space-y-1 px-4">
        <div v-for="tab in tabs" :key="tab.id" class="space-y-1">
          <!-- Main Tab Button -->
          <button
            :class="[
              'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-colors bg-white shadow-sm',
              isTabExpanded(tab.id)
                ? 'text-blue-700 font-semibold ring-2 ring-blue-200'
                : 'text-gray-700 hover:bg-blue-50',
            ]"
            @click="tab.submenu.length > 0 && toggleTab(tab.id)"
          >
            <div class="flex items-center gap-3">
              <UIcon :name="tab.icon" class="h-5 w-5 flex-shrink-0" />
              <span>{{ tab.label }}</span>
            </div>
            <UIcon
              v-if="tab.submenu.length > 0"
              name="i-heroicons:chevron-right-20-solid"
              :class="[
                'h-6 w-6 flex-shrink-0 transition-transform',
                isTabExpanded(tab.id) ? 'rotate-90' : '',
              ]"
              style="color: #5DA45A;"
            />
          </button>

          <!-- Submenu Items -->
          <Transition
            v-if="tab.submenu.length > 0"
            enter-active-class="transition-all duration-200"
            leave-active-class="transition-all duration-200"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="isTabExpanded(tab.id)" class="overflow-hidden space-y-1 pl-4">
              <button
                v-for="item in tab.submenu"
                :key="item.id"
                class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-sm text-gray-700 bg-white/95 hover:bg-white hover:text-gray-900 transition-colors"
                @click="navigateTo(item.route)"
              >
                <div class="h-1 w-1 rounded-full bg-gray-400" />
                <span>{{ item.label }}</span>
              </button>
            </div>
          </Transition>
        </div>
      </nav>

      <div class="mt-auto px-4 pb-4 pt-6">
        <img src="/google-logo.jpg" alt="Google logo" class="h-16 w-auto object-contain" />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-auto">
      <div class="p-8">
        <!-- Two Placeholder Sections -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Section 1 -->
          <div class="rounded-lg p-8 shadow" style="background-color: #F6BC00;">
            <div class="mb-4">
              <div class="inline-flex rounded-full bg-white px-4 py-2 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900">Inbox</h3>
              </div>
            </div>

            <div class="h-[34rem] overflow-y-auto rounded-lg border border-white/60 bg-white/35 p-3 backdrop-blur-sm">
              <div class="space-y-3">
                <div
                  v-for="message in inboxPlaceholders"
                  :key="message.id"
                  class="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-gray-900">{{ message.sender }}</p>
                      <p class="mt-1 truncate text-sm text-gray-800">{{ message.subject }}</p>
                    </div>
                    <div class="flex shrink-0 items-center gap-2">
                      <span class="text-xs font-medium" style="color: #5DA45A;">{{ message.time }}</span>
                      <button
                        type="button"
                        class="rounded-md p-2 transition-colors hover:bg-white/70"
                        style="color: #5DA45A;"
                        aria-label="Delete message"
                        @click.stop="removePlaceholderMessage(message.id)"
                      >
                        <UIcon name="i-heroicons:trash-20-solid" class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p class="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                    {{ message.preview }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2 - Split into PDF and Text -->
          <div class="flex flex-col gap-6">
            <!-- PDF Preview Section -->
            <div class="flex-1 rounded-lg p-8 shadow" style="background-color: #E14233;">
              <div class="mb-4">
                <div class="inline-flex rounded-full bg-white px-4 py-2 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900">Latest Resume</h3>
                </div>
                <p class="mt-3 text-sm text-white">Jordan Lee</p>
              </div>

              <div class="h-64 overflow-hidden rounded-lg border border-white/50 bg-white/25">
                <iframe
                  :src="sampleResumePdfPath"
                  title="Sample resume preview"
                  class="h-full w-full"
                />
              </div>
            </div>

            <!-- Text Paragraph Section -->
            <div class="flex-1 rounded-lg p-8 shadow" style="background-color: #E14233;">
              <div class="mb-4 flex items-start justify-between gap-4">
                <div class="inline-flex rounded-full bg-white px-4 py-2 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900">AI Overview</h3>
                </div>
                <div class="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-red-600">
                  Rank: 8.6/10
                </div>
              </div>

              <div class="h-64 overflow-y-auto rounded-lg border border-white/50 bg-white p-4">
                <p class="leading-relaxed text-gray-700">
                  This candidate demonstrates strong alignment with a mid-level frontend engineering role. Their resume
                  highlights hands-on experience building responsive web interfaces, collaborating across product and
                  design teams, and shipping features in modern JavaScript frameworks. The strongest signals are
                  consistent project ownership, measurable impact on user experience, and familiarity with component-
                  based architecture.
                </p>
                <p class="mt-4 leading-relaxed text-gray-700">
                  Strengths include solid technical breadth, clear teamwork experience, and evidence of delivering
                  production-ready features from planning through release. Areas to explore further in an interview
                  would be backend depth, testing strategy, and the scale of systems they have supported. Overall, the
                  resume suggests a well-qualified candidate with a strong chance of succeeding in a collaborative,
                  product-focused environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
