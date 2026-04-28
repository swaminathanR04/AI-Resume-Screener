<script setup lang="ts">
  useHead({
    title: '40 Hours Inc.',
    link: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: '',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap',
      },
    ],
    meta: [
      {
        name: 'application-name',
        content: '40 Hours Inc.',
      },
    ],
  })
</script>

<template>
  <UApp class="brand-app-shell">
    <NuxtPage />
  </UApp>
</template>
