import { authClient } from '../utils/auth-client'
import { getUserHomePath, isAdminUser } from '../utils/user-role'

export default defineNuxtRouteMiddleware(async (to) => {
  const adminRoutePrefixes = [
    '/dashboard',
    '/allresumes',
    '/accepted',
    '/rejected',
    '/archived',
    '/joblist',
    '/job-listings',
    '/audit-log',
    '/ai-config',
    '/technical',
  ]

  const applicantRoutePrefixes = ['/jobs', '/applications', '/notifications', '/profile']

  const { data: session } = await authClient.useSession(useFetch)
  const currentUser = session.value?.user

  if (!session.value) {
    if (to.path !== '/auth') {
      return navigateTo('/auth')
    }

    return
  }

  if (to.path === '/' || to.path === '/auth') {
    return navigateTo(getUserHomePath(currentUser), { replace: true })
  }

  const isAdminRoute = adminRoutePrefixes.some((prefix) => to.path.startsWith(prefix))
  const isApplicantRoute = applicantRoutePrefixes.some((prefix) => to.path.startsWith(prefix))

  if (isAdminUser(currentUser) && isApplicantRoute) {
    return navigateTo('/dashboard')
  }

  if (!isAdminUser(currentUser) && isAdminRoute) {
    return navigateTo('/jobs')
  }
})
