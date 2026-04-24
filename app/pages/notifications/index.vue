<script setup lang="ts">
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
        <NuxtLink to="/notifications" class="underline">Notifications</NuxtLink>
        <NuxtLink to="/applications">Applications</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>      </div>

    </div>

    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Notifications
      </h1>

      <div class="bg-white p-6 rounded shadow border border-gray-300 text-gray-600">
        No notifications yet.
      </div>
    </div>

  </div>
</template>