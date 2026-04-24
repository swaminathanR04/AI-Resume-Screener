<script setup lang="ts">
const user = {
  name: 'Bob Iger',
  email: 'bob.iger@email.com',
  phone: '(214) 555-4821',
  address: '123 Main St, Dallas, Texas',
  education: 'B.S. Computer Science – UT Dallas',
  graduation: 'May 2027'
}

function handleLogout() {
  console.log('Logout clicked')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <div class="bg-blue-500 text-white p-4 flex justify-between">

      <div class="flex items-center gap-3">
        <span class="font-medium">{{ user.name }}</span>
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
        <NuxtLink to="/applications">Applications</NuxtLink>
        <NuxtLink to="/profile" class="underline">Profile</NuxtLink>
      </div>

    </div>

    <div class="p-6 max-w-2xl mx-auto">

      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        Profile
      </h1>

      <div class="bg-white p-6 rounded shadow border border-gray-300 space-y-4">

        <div>
          <p class="text-gray-600 text-sm">Full Name</p>
          <p class="text-gray-900 font-medium">{{ user.name }}</p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Email</p>
          <p class="text-gray-900 font-medium">{{ user.email }}</p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Phone Number</p>
          <p class="text-gray-900 font-medium">{{ user.phone }}</p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Address</p>
          <p class="text-gray-900 font-medium">{{ user.address }}</p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Education</p>
          <p class="text-gray-900 font-medium">{{ user.education }}</p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Expected Graduation</p>
          <p class="text-gray-900 font-medium">{{ user.graduation }}</p>
        </div>

      </div>

    </div>
  </div>
</template>