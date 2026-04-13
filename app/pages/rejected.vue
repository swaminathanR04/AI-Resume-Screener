<script setup lang="ts">
import { authClient } from '~/utils/auth-client'
import { useResumeStore } from '~/composables/useResumeStore'

const expandedTabs = ref<Set<string>>(new Set())

const { data: session } = await useAsyncData('session', async () => {
  return authClient.getSession()
})

const currentUser = computed(() => session.value?.data?.user)
const isEditingDisplayName = ref(false)
const { displayName } = useProfileDisplayName(computed(() => currentUser.value?.email || 'user@example.com'))

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

const toggleTab = (tabId: string) => {
  if (expandedTabs.value.has(tabId)) {
    expandedTabs.value.delete(tabId)
  } else {
    expandedTabs.value.add(tabId)
  }
}

const isTabExpanded = (tabId: string) => expandedTabs.value.has(tabId)

const { rejectedResumes } = useResumeStore()
const menuItems = rejectedResumes

// State
const hoveredItemId = ref<number | null>(null)
const selectedItemId = ref<number | null>(null)
const editingRankingId = ref<number | null>(null)
const tempRankingValue = ref('')
const rankingAuditLog = ref<Array<{itemId: number, applicantName: string, oldRanking: number, newRanking: number, timestamp: string}>>([])

const startEditingRanking = (itemId: number, currentRanking: number) => {
  editingRankingId.value = itemId
  tempRankingValue.value = currentRanking.toString()
}

const saveRanking = (itemId: number) => {
  const newRanking = parseFloat(tempRankingValue.value)
  const item = menuItems.value.find(i => i.id === itemId)
  
  if (!isNaN(newRanking) && newRanking >= 0 && newRanking <= 10 && item) {
    const oldRanking = item.ranking
    
    // Only log if ranking actually changed
    if (oldRanking !== newRanking) {
      item.ranking = newRanking
      
      // Log the change with timestamp
      rankingAuditLog.value.push({
        itemId: itemId,
        applicantName: item.applicantName,
        oldRanking: oldRanking,
        newRanking: newRanking,
        timestamp: new Date().toLocaleString()
      })
      
      console.log('Ranking updated:', {
        applicant: item.applicantName,
        from: oldRanking,
        to: newRanking,
        time: new Date().toLocaleString()
      })
    }
  }
  editingRankingId.value = null
  tempRankingValue.value = ''
}

const isFilterSelected = (filterId: string) => false
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
      <nav class="mt-6 space-y-1 px-4 flex-1">
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
                'h-5 w-5 flex-shrink-0 transition-transform',
                isTabExpanded(tab.id) ? 'rotate-90' : '',
              ]"
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
        <!-- Resume List -->
        <div class="space-y-4">
          <button
            v-for="item in menuItems"
            :key="item.id"
            class="w-full bg-white rounded-lg shadow hover:shadow-md transition-all text-left border-2 cursor-pointer"
            style="border-color: #F4BC15;"
            :class="hoveredItemId === item.id ? 'p-6 pb-32' : 'p-6'"
            @click="selectedItemId = item.id"
            @mouseenter="hoveredItemId = item.id"
            @mouseleave="hoveredItemId = null"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 flex-1">
                <div
                  class="px-3 py-2 rounded-lg font-bold min-w-fit"
                  style="background-color: #F4BC15; color: #7a5900;"
                >
                  {{ item.ranking }}/10
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ item.applicantName }}</h3>
                  <p class="mt-1 text-sm text-gray-600">{{ item.positionAppliedFor }} • {{ item.dateSubmitted }}</p>
                </div>
              </div>
              <UIcon name="i-heroicons:chevron-right-20-solid" class="h-6 w-6 text-gray-400 flex-shrink-0" />
            </div>
            
            <!-- AI Analysis Preview on Hover -->
            <div v-if="hoveredItemId === item.id" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-xs font-semibold text-gray-500 uppercase">AI Analysis</p>
              <p class="mt-2 text-sm text-gray-700 leading-relaxed">
                Strong technical background with 8+ years of experience. Excellent problem-solving skills and team collaboration. 
                Demonstrated leadership in previous roles and mentoring capabilities. Shows strong cultural fit based on resume analysis.
                Previous company achievements include leading successful product launches and managing cross-functional teams.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedItemId !== null"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="selectedItemId = null"
      >
        <div
          class="bg-white rounded-lg shadow-xl p-8 w-11/12 h-5/6 max-w-6xl overflow-auto"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ menuItems.find(item => item.id === selectedItemId)?.applicantName }}
              </h2>
              <p class="text-gray-600 mt-1">
                <span class="font-semibold">{{ menuItems.find(item => item.id === selectedItemId)?.positionAppliedFor }}</span> • 
                <span class="font-semibold">Ranking: <span class="text-blue-600">{{ menuItems.find(item => item.id === selectedItemId)?.ranking }}/10</span></span>
              </p>
            </div>
            <button
              @click="selectedItemId = null"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <UIcon name="i-heroicons:x-mark-20-solid" class="h-6 w-6" />
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-8">
            <!-- PDF Preview Section -->
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-6 flex items-center justify-center h-96">
              <div class="text-center">
                <UIcon name="i-heroicons:document-20-solid" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-500 font-medium">Resume PDF</p>
                <p class="text-gray-400 text-sm mt-2">PDF preview placeholder</p>
              </div>
            </div>
            
            <!-- AI Analysis Section -->
            <div class="border-l border-gray-200 pl-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <div class="space-y-4 text-sm text-gray-700">
                <div>
                  <p class="font-semibold text-gray-900 mb-1">Technical Skills</p>
                  <p class="leading-relaxed">Strong technical background with 8+ years of experience in software development. Proficient in multiple programming languages and frameworks. Demonstrated expertise in cloud technologies and distributed systems.</p>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 mb-1">Experience Level</p>
                  <p class="leading-relaxed">Excellent problem-solving skills with proven track record. Demonstrated leadership in previous roles and mentoring capabilities. Previous company achievements include leading successful product launches and managing cross-functional teams.</p>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 mb-1">Cultural Fit</p>
                  <p class="leading-relaxed">Shows strong cultural fit based on resume analysis. Strong collaboration skills and team player mentality evident from work history. Values align with company mission based on previous role selections.</p>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 mb-1">Overall Assessment</p>
                  <p class="leading-relaxed">This candidate demonstrates strong potential for the Senior Software Engineer position. Highly recommended for technical interview round. Expected to perform well in both technical and behavioral assessments.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 rounded-lg border border-red-200 bg-red-50 p-5">
            <p class="text-xs font-semibold uppercase tracking-wide text-red-700">Rejection Comment</p>
            <p class="mt-2 text-sm leading-relaxed text-gray-700">
              {{ menuItems.find(item => item.id === selectedItemId)?.rejectionComment }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
