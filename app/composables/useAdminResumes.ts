export type AdminResumeItem = {
  userId: string
  applicantName: string
  email: string
  appliedRole: string
  submittedAt: string
  applicationCount: number
  score: number
}

function sortResumes(items: AdminResumeItem[]) {
  return [...items].sort(
    (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
  )
}

export async function useAdminResumes() {
  const { data, pending, error, refresh } = await useFetch<AdminResumeItem[]>(
    '/api/admin/resumes',
    {
      key: 'admin-resumes',
    }
  )

  const isInitialized = useState<boolean>('admin-resumes-initialized', () => false)
  const newResumes = useState<AdminResumeItem[]>('admin-new-resumes', () => [])
  const acceptedResumes = useState<AdminResumeItem[]>('admin-accepted-resumes', () => [])
  const rejectedResumes = useState<AdminResumeItem[]>('admin-rejected-resumes', () => [])

  watch(
    () => data.value,
    (value) => {
      if (!value || isInitialized.value) {
        return
      }

      newResumes.value = sortResumes(value)
      acceptedResumes.value = []
      rejectedResumes.value = []
      isInitialized.value = true
    },
    { immediate: true }
  )

  function takeResume(userId: string) {
    const allBuckets = [newResumes.value, acceptedResumes.value, rejectedResumes.value]

    for (const bucket of allBuckets) {
      const resume = bucket.find((item) => item.userId === userId)

      if (resume) {
        return resume
      }
    }

    return null
  }

  function removeResume(userId: string) {
    newResumes.value = newResumes.value.filter((item) => item.userId !== userId)
    acceptedResumes.value = acceptedResumes.value.filter((item) => item.userId !== userId)
    rejectedResumes.value = rejectedResumes.value.filter((item) => item.userId !== userId)
  }

  function moveResume(userId: string, target: 'accepted' | 'rejected') {
    const resume = takeResume(userId)

    if (!resume) {
      return false
    }

    removeResume(userId)

    if (target === 'accepted') {
      acceptedResumes.value = sortResumes([resume, ...acceptedResumes.value])
    } else {
      rejectedResumes.value = sortResumes([resume, ...rejectedResumes.value])
    }

    return true
  }

  async function refreshResumes() {
    await refresh()

    if (!data.value) {
      return
    }

    const acceptedIds = new Set(acceptedResumes.value.map((item) => item.userId))
    const rejectedIds = new Set(rejectedResumes.value.map((item) => item.userId))

    newResumes.value = sortResumes(
      data.value.filter((item) => !acceptedIds.has(item.userId) && !rejectedIds.has(item.userId))
    )
  }

  return {
    pending,
    error,
    refreshResumes,
    newResumes,
    acceptedResumes,
    rejectedResumes,
    moveResume,
  }
}
