<script setup lang="ts">
  import { authClient } from '../utils/auth-client'
  import { getUserHomePath } from '../utils/user-role'

  const { data: session } = await useAsyncData('index-session', async () => authClient.getSession())

  if (session.value?.data?.user) {
    await navigateTo(getUserHomePath(session.value.data.user), { replace: true })
  } else {
    await navigateTo('/auth', { replace: true })
  }
</script>

<template>
  <div />
</template>
