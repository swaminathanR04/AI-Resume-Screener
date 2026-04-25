type UserLike = {
  name?: string | null
  email?: string | null
}

function normalizeValue(value?: string | null) {
  return value?.trim().toLowerCase() || ''
}

export function isAdminUser(user?: UserLike | null) {
  const normalizedName = normalizeValue(user?.name)
  const normalizedEmail = normalizeValue(user?.email)
  const emailLocalPart = normalizedEmail.split('@')[0] || ''

  return normalizedName === 'alice' || emailLocalPart === 'alice'
}

export function getUserHomePath(user?: UserLike | null) {
  return isAdminUser(user) ? '/dashboard' : '/jobs'
}

export function isApplicantUser(user?: UserLike | null) {
  return Boolean(user) && !isAdminUser(user)
}
