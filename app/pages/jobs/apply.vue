<script setup lang="ts">
function handleSubmit() {
  alert('Application submitted (demo)')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <div class="bg-blue-500 text-white p-4 flex justify-between">
      <div>Bob Iger</div>

      <div class="font-bold text-lg">Careers</div>

      <div class="space-x-4">
        <NuxtLink to="/jobs" class="underline">Home</NuxtLink>
        <NuxtLink to="/notifications">Notifications</NuxtLink>
        <NuxtLink to="/applications">Applications</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
      </div>
    </div>

    <div class="p-6 max-w-xl mx-auto bg-white rounded shadow">

      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Apply for Software Engineer
      </h1>

      <!-- Name -->
      <input
        placeholder="Full Name"
        class="w-full p-3 border border-gray-400 rounded mb-3 text-gray-900 placeholder-gray-500"
      />

      <!-- Email -->
      <input
        placeholder="Email"
        class="w-full p-3 border border-gray-400 rounded mb-3 text-gray-900 placeholder-gray-500"
      />

      <!-- Phone -->
      <input
        placeholder="Phone Number"
        class="w-full p-3 border border-gray-400 rounded mb-3 text-gray-900 placeholder-gray-500"
      />

      <!-- Location -->
      <input
        placeholder="Current Location"
        class="w-full p-3 border border-gray-400 rounded mb-3 text-gray-900 placeholder-gray-500"
      />

      <!-- Education -->
      <input
        placeholder="Education (e.g. B.S. Computer Science)"
        class="w-full p-3 border border-gray-400 rounded mb-3 text-gray-900 placeholder-gray-500"
      />

      <!-- Experience -->
      <textarea
        placeholder="Relevant Experience"
        class="w-full p-3 border border-gray-400 rounded mb-3 text-gray-900 placeholder-gray-500"
      ></textarea>

      <!-- Resume Upload -->
      <div class="mb-3">
        <p class="text-gray-900 font-medium mb-1">Upload Resume</p>
        <input type="file" class="w-full text-gray-900" />
      </div>

      <!-- Cover Letter Upload -->
      <div class="mb-3">
        <p class="text-gray-900 font-medium mb-1">Upload Cover Letter</p>
        <input type="file" class="w-full text-gray-900" />
      </div>

      <!-- Additional Question -->
      <textarea
        placeholder="Why are you a good fit for this role?"
        class="w-full p-3 border border-gray-400 rounded mb-4 text-gray-900 placeholder-gray-500"
      ></textarea>

      <!-- Submit -->
      <button
        @click="handleSubmit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Submit Application
      </button>

    </div>
  </div>
</template>