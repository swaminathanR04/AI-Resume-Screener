<script setup lang="ts">
const search = ref('')
const location = ref('')

const jobs = [
  {
    id: 1,
    title: 'Software Engineer',
    location: 'Houston, Texas',
    description: 'Assist in developing web applications and collaborating with teams.',
    posted: '2/1/2026'
  },
  {
    id: 2,
    title: 'Backend Software Engineer',
    location: 'Dallas, Texas',
    description: 'Build APIs and scalable backend systems.',
    posted: '2/1/2026'
  }
]

const filteredJobs = computed(() => {
  return jobs.filter((job) => {
    const searchText = search.value.toLowerCase()
    const locationText = location.value.toLowerCase()

    const matchesSearch = job.title.toLowerCase().includes(searchText)
    const matchesLocation = job.location.toLowerCase().includes(locationText)

    return matchesSearch && matchesLocation
  })
})

function clearFilters() {
  search.value = ''
  location.value = ''
}

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
        <NuxtLink to="/jobs" class="underline">Home</NuxtLink>
        <NuxtLink to="/notifications">Notifications</NuxtLink>
        <NuxtLink to="/applications">Applications</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
      </div>

    </div>

    <div class="p-6 grid grid-cols-3 gap-6">

      <div class="col-span-2 space-y-4">

        <div class="grid grid-cols-2 gap-2 items-center">
          <input
            v-model="search"
            placeholder="Find Software"
            class="p-3 border border-gray-400 rounded bg-white text-black placeholder-gray-600"
          />

          <div class="flex gap-2">
            <input
              v-model="location"
              placeholder="Location"
              class="p-3 border border-gray-400 rounded bg-white text-black placeholder-gray-600 w-full"
            />

            <button
              v-if="search || location"
              @click="clearFilters"
              class="px-3 bg-gray-300 rounded hover:bg-gray-400 text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        <div
          v-for="job in filteredJobs"
          :key="job.id"
          class="bg-white p-5 rounded shadow border border-gray-200"
        >
          <h2 class="font-bold text-lg text-gray-900">
            {{ job.title }}
          </h2>

          <p class="text-sm text-gray-700">
            {{ job.location }}
          </p>

          <p class="mt-2 text-gray-800">
            {{ job.description }}
          </p>

          <div class="flex justify-between mt-4">
            <NuxtLink
              :to="`/jobs/${job.id}`"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Read More
            </NuxtLink>

            <span class="text-xs text-gray-500">
              Posted: {{ job.posted }}
            </span>
          </div>
        </div>

        <div v-if="filteredJobs.length === 0" class="text-center text-gray-500 mt-4">
          No jobs found
        </div>

      </div>

      <div class="bg-white p-4 rounded shadow border border-gray-200">
        <h2 class="font-bold mb-2 text-gray-900">Recommendations</h2>

        <div class="space-y-2">

          <NuxtLink to="/jobs" class="flex justify-between hover:underline">
            <span class="text-gray-900">Software Engineer I</span>
            <span class="text-gray-600">Dallas, Texas</span>
          </NuxtLink>

          <NuxtLink to="/jobs" class="flex justify-between hover:underline">
            <span class="text-gray-900">Backend Developer</span>
            <span class="text-gray-600">Dallas, Texas</span>
          </NuxtLink>

          <NuxtLink to="/jobs" class="flex justify-between hover:underline">
            <span class="text-gray-900">Full Stack Developer</span>
            <span class="text-gray-600">Dallas, Texas</span>
          </NuxtLink>

        </div>
      </div>

    </div>
  </div>
</template>