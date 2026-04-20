import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/', '/auth', '/audit-log', '/ai-config', '/job-listings/create']

  const { data: session } = await authClient.useSession(useFetch)

  if (session.value) {
    if (to.path === '/auth') {
      return navigateTo('/audit-log')
    }
  } else {
    if (!publicRoutes.includes(to.path)) {
      return navigateTo('/auth')
    }
  }
})
