<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

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

// Edit modal state
const editingJobId = ref<number | null>(null)
const editingJobData = ref({
  title: '',
  postedBy: '',
  applications: 0,
  reviewsPending: 0,
  description: ''
})

const openEditModal = (item: any) => {
  editingJobId.value = item.id
  editingJobData.value = {
    title: item.title,
    postedBy: item.postedBy,
    applications: item.applications,
    reviewsPending: item.reviewsPending,
    description: item.description
  }
}

const saveEditedJob = () => {
  const jobToUpdate = menuItems.find(item => item.id === editingJobId.value)
  if (jobToUpdate) {
    jobToUpdate.title = editingJobData.value.title
    jobToUpdate.postedBy = editingJobData.value.postedBy
    jobToUpdate.applications = editingJobData.value.applications
    jobToUpdate.reviewsPending = editingJobData.value.reviewsPending
    jobToUpdate.description = editingJobData.value.description
  }
  editingJobId.value = null
}

const cancelEdit = () => {
  editingJobId.value = null
}

// Placeholder menu items
const menuItems = [
  { 
    id: 1, 
    title: 'Senior Software Engineer', 
    postedBy: 'Sarah Johnson',
    postedDate: '2 days ago',
    applications: 24,
    reviewsPending: 8,
    description: 'We are looking for an experienced Senior Software Engineer to join our growing team. You will work on building scalable systems and mentoring junior developers.' 
  },
  { 
    id: 2, 
    title: 'Product Manager', 
    postedBy: 'Michael Chen',
    postedDate: '1 week ago',
    applications: 15,
    reviewsPending: 5,
    description: 'Ready to lead product strategy in a fast-paced environment? Join our team to drive innovation and customer success.' 
  },
  { 
    id: 3, 
    title: 'Frontend Developer', 
    postedBy: 'Emma Williams',
    postedDate: '3 days ago',
    applications: 32,
    reviewsPending: 12,
    description: 'Looking for a talented Frontend Developer with React expertise to create beautiful and responsive user interfaces.' 
  },
  { 
    id: 4, 
    title: 'Data Scientist', 
    postedBy: 'Alex Rodriguez',
    postedDate: '5 days ago',
    applications: 18,
    reviewsPending: 6,
    description: 'Help us unlock insights from data. We need a Data Scientist with strong Python and ML experience.' 
  },
  { 
    id: 5, 
    title: 'UX/UI Designer', 
    postedBy: 'Jessica Lee',
    postedDate: '1 day ago',
    applications: 28,
    reviewsPending: 10,
    description: 'Design stunning user experiences for our portfolio of innovative digital products.' 
  },
  { 
    id: 6, 
    title: 'DevOps Engineer', 
    postedBy: 'David Martinez',
    postedDate: '4 days ago',
    applications: 12,
    reviewsPending: 3,
    description: 'Manage and optimize our cloud infrastructure. Experience with Kubernetes and AWS required.' 
  },
]

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
            class="w-full bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 text-left border-2"
            style="border-color: #F4BC15;"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ item.title }}</h3>
                <p class="mt-2 text-sm text-gray-600">
                  Posted by <span class="font-medium">{{ item.postedBy }}</span> • {{ item.postedDate }} • 
                  <span class="font-medium">{{ item.applications }}</span> applications • 
                  <span class="font-medium">{{ item.reviewsPending }}</span> resumes to review
                </p>
                <p class="mt-3 text-sm text-gray-700 leading-relaxed">{{ item.description }}</p>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0 mt-1">
                <button
                  @click.stop="openEditModal(item)"
                  class="p-2 rounded-lg transition-colors hover:bg-yellow-50"
                  style="color: #F4BC15;"
                  title="Edit job listing"
                >
                  <UIcon name="i-heroicons:pencil-20-solid" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Job Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="editingJobId !== null"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="cancelEdit"
      >
        <div
          class="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-2xl max-h-5/6 overflow-auto"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Edit Job Listing</h2>
            <button
              @click="cancelEdit"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <UIcon name="i-heroicons:x-mark-20-solid" class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Job Title</label>
              <input
                v-model="editingJobData.title"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Posted By</label>
              <input
                v-model="editingJobData.postedBy"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Applications</label>
                <div class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                  {{ editingJobData.applications }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Resumes to Review</label>
                <div class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                  {{ editingJobData.reviewsPending }}
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <textarea
                v-model="editingJobData.description"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 leading-relaxed"
                rows="5"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              @click="cancelEdit"
              class="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              @click="saveEditedJob"
              class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
