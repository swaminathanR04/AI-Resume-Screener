<script setup lang="ts">
import { authClient } from '~/utils/auth-client'
import { useResumeStore, type ResumeDecision } from '~/composables/useResumeStore'

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

const { allResumes, moveResumeToBucket } = useResumeStore()
const menuItems = allResumes

// Filter options
const availableFilters = [
  { id: 'date', label: 'Date', icon: 'i-heroicons:calendar-20-solid' },
  { id: 'rating', label: 'Rating', icon: 'i-heroicons:star-20-solid' },
  { id: 'status', label: 'Status', icon: 'i-heroicons:check-circle-20-solid' },
  { id: 'skill', label: 'Skill', icon: 'i-heroicons:academic-cap-20-solid' },
  { id: 'location', label: 'Location', icon: 'i-heroicons:map-pin-20-solid' },
  { id: 'experience', label: 'Experience', icon: 'i-heroicons:briefcase-20-solid' },
]

// Search and filter state
const selectedFilters = ref<Set<string>>(new Set())
const showFilterDropdown = ref(false)
const hoveredItemId = ref<number | null>(null)
const selectedItemId = ref<number | null>(null)
const editingRankingId = ref<number | null>(null)
const tempRankingValue = ref('')
const rankingAuditLog = ref<Array<{itemId: number, applicantName: string, oldRanking: number, newRanking: number, timestamp: string}>>([])
const selectedAction = ref<'accept' | 'reject' | 'archive' | null>(null)
const actionReason = ref('')

const closeModal = () => {
  selectedItemId.value = null
  selectedAction.value = null
  actionReason.value = ''
}

const submitResumeDecision = () => {
  if (selectedItemId.value === null || selectedAction.value === null) {
    return
  }

  const trimmedReason = actionReason.value.trim()

  if (!trimmedReason) {
    return
  }

  const moved = moveResumeToBucket(selectedItemId.value, selectedAction.value as ResumeDecision, trimmedReason)

  if (moved) {
    closeModal()
  }
}

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

const toggleFilter = (filterId: string) => {
  if (selectedFilters.value.has(filterId)) {
    selectedFilters.value.delete(filterId)
  } else {
    selectedFilters.value.add(filterId)
  }
}

const removeFilter = (filterId: string) => {
  selectedFilters.value.delete(filterId)
}

const isFilterSelected = (filterId: string) => selectedFilters.value.has(filterId)
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
        <!-- Search and Filter Bar -->
        <div class="mb-6 relative">
          <button
            class="w-full bg-white rounded-lg shadow p-4 text-left flex items-center gap-3 transition-colors"
            style="border: 2px solid #E34D3E; color: #E34D3E;"
            @click="showFilterDropdown = !showFilterDropdown"
          >
            <UIcon name="i-heroicons:funnel-20-solid" class="h-5 w-5 flex-shrink-0" style="color: #E34D3E;" />
            
            <!-- Selected Filters Display -->
            <div class="flex-1 flex items-center gap-2 flex-wrap">
              <span v-if="selectedFilters.size === 0" class="text-sm" style="color: #E34D3E;">Add filters...</span>
              <div
                v-for="filterId of Array.from(selectedFilters)"
                :key="filterId"
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
              >
                <span>{{ availableFilters.find(f => f.id === filterId)?.label }}</span>
                <button
                  @click.stop="removeFilter(filterId)"
                  class="hover:text-blue-900 font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <UIcon
              name="i-heroicons:chevron-down-20-solid"
              :class="[
                'h-5 w-5 flex-shrink-0 transition-transform',
                showFilterDropdown ? 'rotate-180' : '',
              ]"
              style="color: #E34D3E;"
            />
          </button>

          <!-- Filter Dropdown Menu -->
          <Transition
            enter-active-class="transition-all duration-200"
            leave-active-class="transition-all duration-200"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div
              v-if="showFilterDropdown"
              class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4"
            >
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="filter in availableFilters"
                  :key="filter.id"
                  :class="[
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                    isFilterSelected(filter.id)
                      ? 'bg-blue-50 border border-blue-300'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
                  ]"
                  @click="toggleFilter(filter.id)"
                >
                  <UIcon
                    :name="filter.icon"
                    :class="[
                      'h-5 w-5 flex-shrink-0',
                      isFilterSelected(filter.id) ? 'text-blue-600' : 'text-gray-400',
                    ]"
                  />
                  <div class="flex-1">
                    <p :class="['text-sm font-medium', isFilterSelected(filter.id) ? 'text-blue-900' : 'text-gray-700']">
                      {{ filter.label }}
                    </p>
                  </div>
                  <div
                    v-if="isFilterSelected(filter.id)"
                    class="h-4 w-4 rounded bg-blue-600 flex items-center justify-center"
                  >
                    <UIcon name="i-heroicons:check-20-solid" class="h-3 w-3 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </Transition>
        </div>
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
        @click="closeModal"
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
                <span v-if="editingRankingId === selectedItemId" class="font-semibold">
                  Ranking: 
                  <input
                    v-model="tempRankingValue"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    class="w-16 px-2 py-1 border border-blue-300 rounded bg-blue-50"
                    @blur="saveRanking(selectedItemId!)"
                    @keyup.enter="saveRanking(selectedItemId!)"
                    autofocus
                  />/10
                </span>
                <span v-else class="font-semibold cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors" @click="startEditingRanking(selectedItemId!, menuItems.find(item => item.id === selectedItemId)?.ranking || 0)">
                  Ranking: 
                  <span class="text-blue-600">{{ menuItems.find(item => item.id === selectedItemId)?.ranking }}/10</span>
                  <UIcon name="i-heroicons:pencil-20-solid" class="h-4 w-4 text-blue-600" />
                </span>
              </p>
            </div>
            <button
              @click="closeModal"
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

          <!-- Action Buttons -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div v-if="selectedAction === null" class="flex gap-4 justify-end">
              <button
                @click="closeModal"
                class="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
              <button
                @click="selectedAction = 'archive'"
                class="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
              >
                <UIcon name="i-heroicons:archive-box-20-solid" class="h-4 w-4" />
                Archive
              </button>
              <button
                @click="selectedAction = 'reject'"
                class="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
              >
                <UIcon name="i-heroicons:x-circle-20-solid" class="h-4 w-4" />
                Reject
              </button>
              <button
                @click="selectedAction = 'accept'"
                class="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
              >
                <UIcon name="i-heroicons:check-circle-20-solid" class="h-4 w-4" />
                Accept
              </button>
            </div>

            <!-- Reason Input Section -->
            <div v-if="selectedAction !== null" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm font-semibold text-gray-900 mb-3">Reason for {{ selectedAction === 'accept' ? 'Accepting' : selectedAction === 'reject' ? 'Rejecting' : 'Archiving' }}</p>
              <textarea
                v-model="actionReason"
                placeholder="Enter your reason..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base text-gray-900 placeholder-gray-500 leading-relaxed"
                rows="4"
              ></textarea>
              <div class="flex gap-3 mt-3 justify-end">
                <button
                  @click="selectedAction = null; actionReason = ''"
                  class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Back
                </button>
                <button
                  @click="submitResumeDecision"
                  :disabled="actionReason.trim().length === 0"
                  class="px-4 py-2 text-white rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  :class="selectedAction === 'accept' ? 'bg-green-500 hover:bg-green-600' : selectedAction === 'reject' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    </div>
  </div>
</template>
