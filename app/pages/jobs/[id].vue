<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)

const jobs = [
  {
    id: 1,
    title: 'Software Engineer',
    location: 'Dallas, Texas',
    description: 'Join our team to build scalable web applications and work with modern technologies.'
  }
]

const job = jobs.find(j => j.id === id)

function handleLogout() {
  console.log('Logout clicked')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <div class="bg-blue-500 text-white p-4 flex justify-between">
      <div class="flex items-center gap-3">
        <span>Bob Iger</span>
        <button
          @click="handleLogout"
          class="bg-white text-blue-500 px-3 py-1 rounded text-sm"
        >
          Log Out
        </button>
      </div>

      <div class="font-bold text-lg">Careers</div>

      <div class="space-x-4">
        <NuxtLink to="/jobs" class="underline">Home</NuxtLink>
        <NuxtLink to="/notifications">Notifications</NuxtLink>
        <NuxtLink to="/applications">Applications</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
      </div>
    </div>

    <div class="p-6 max-w-3xl mx-auto bg-white rounded shadow">

      <h1 class="text-3xl font-bold text-gray-900">{{ job?.title }}</h1>
      <p class="text-gray-600 mt-1">{{ job?.location }}</p>

      <p class="mt-4 text-gray-800">
        {{ job?.description }}
      </p>

      <div class="mt-6">
        <h2 class="font-bold text-lg text-gray-900">Responsibilities</h2>
        <ul class="list-disc ml-5 text-gray-700 mt-2">
          <li>Develop and maintain web applications</li>
          <li>Collaborate with cross-functional teams</li>
          <li>Write clean and efficient code</li>
        </ul>
      </div>

      <div class="mt-6">
        <h2 class="font-bold text-lg text-gray-900">Qualifications</h2>
        <ul class="list-disc ml-5 text-gray-700 mt-2">
          <li>Experience with JavaScript or Python</li>
          <li>Understanding of databases</li>
          <li>Strong problem-solving skills</li>
        </ul>
      </div>

      <NuxtLink
        to="/jobs/apply"
        class="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        Apply
      </NuxtLink>

    </div>
  </div>
</template>