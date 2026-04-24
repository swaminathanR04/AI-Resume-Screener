<script setup lang="ts">
const activeApps = [
  {
    id: 1,
    title: 'Backend Software Engineer',
    location: 'Dallas, Texas, United States',
    status: 'In Review',
    applied: '3/5/2026'
  }
]

const inactiveApps = [
  {
    id: 2,
    title: 'AI Software Engineer',
    location: 'Dallas, Texas, United States',
    status: 'Withdrawn',
    applied: '3/1/2026'
  }
]

function handleLogout() {
  console.log('Logout clicked')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <div class="bg-blue-500 text-white p-4 flex justify-between">
      <div class="flex items-center gap-3">
        <span class="font-medium">Bob Iger</span>
        <button
          @click="handleLogout"
          class="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-200 text-sm"
        >
          Log Out
        </button>
      </div>

      <div class="font-bold text-lg">Careers</div>

      <div class="space-x-4 font-medium">
        <NuxtLink to="/jobs">Home</NuxtLink>
        <NuxtLink to="/notifications">Notifications</NuxtLink>
        <NuxtLink to="/applications" class="underline">Applications</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
      </div>
    </div>

    <div class="p-6 space-y-10">

      <div>
        <h2 class="font-bold text-lg text-gray-900 mb-3">
          Active Job Applications
        </h2>

        <div class="space-y-3">
          <div
            v-for="job in activeApps"
            :key="job.id"
            class="bg-white border border-gray-300 p-4 flex justify-between items-center rounded"
          >
            <div>
              <p class="font-semibold text-gray-900">{{ job.title }}</p>
              <p class="text-sm text-gray-800">{{ job.location }}</p>
            </div>

            <div class="text-sm text-gray-900">
              <p>Status: {{ job.status }}</p>
              <p>Applied on {{ job.applied }}</p>
            </div>

            <div class="text-sm text-right space-y-1">
              <NuxtLink
                :to="`/applications/${job.id}`"
                class="text-blue-600 hover:underline"
              >
                Edit/View Application
                </NuxtLink>

              <p class="cursor-pointer hover:underline text-red-600">
                Withdraw Application
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="font-bold text-lg text-gray-900 mb-3">
          Inactive Job Applications
        </h2>

        <div class="space-y-3">
          <div
            v-for="job in inactiveApps"
            :key="job.id"
            class="bg-white border border-gray-300 p-4 flex justify-between items-center rounded"
          >
            <div>
              <p class="font-semibold text-gray-900">{{ job.title }}</p>
              <p class="text-sm text-gray-800">{{ job.location }}</p>
            </div>

            <div class="text-sm text-gray-900">
              <p>Status: {{ job.status }}</p>
              <p>Applied on {{ job.applied }}</p>
            </div>

            <div class="text-sm text-right">
              <NuxtLink
                :to="`/applications/${job.id}`"
                class="text-blue-600 hover:underline"
              >
                View Application
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>