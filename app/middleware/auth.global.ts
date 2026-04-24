import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/', '/auth']

  const { data: session } = await authClient.useSession(useFetch)

  if (session.value) {
    if (to.path === '/auth') {
      return navigateTo('/dashboard')
    }
  } else {
    if (!publicRoutes.includes(to.path)) {
      return navigateTo('/auth')
    }
  }
})
