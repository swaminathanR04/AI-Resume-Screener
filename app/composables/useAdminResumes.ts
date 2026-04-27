export type AdminResumeItem = {
  userId: string
  applicantName: string
  email: string
  appliedRole: string
  submittedAt: string
  applicationCount: number
  score: number | null
}

type RescoreResumeResponse = {
  userId: string
  score: number | null
  aiSummary: string | null
  aiMatchedSkills: string[]
  aiMissingSkills: string[]
  aiConcerns: string[]
  aiScoredAt: string | null
  aiModel: string | null
}

function sortResumes(items: AdminResumeItem[]) {
  return [...items].sort(
    (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
  )
}

export async function useAdminResumes() {
  const isInitialized = useState<boolean>('admin-resumes-initialized', () => false)
  const newResumes = useState<AdminResumeItem[]>('admin-new-resumes', () => [])
  const acceptedResumes = useState<AdminResumeItem[]>('admin-accepted-resumes', () => [])
  const rejectedResumes = useState<AdminResumeItem[]>('admin-rejected-resumes', () => [])

  const { data, pending, error, refresh } = await useFetch<AdminResumeItem[]>(
    '/api/admin/resumes',
    {
      key: 'admin-resumes',
    }
  )

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

  function updateResumeScore(userId: string, score: number | null) {
    const allBuckets = [newResumes.value, acceptedResumes.value, rejectedResumes.value]

    for (const bucket of allBuckets) {
      const resume = bucket.find((item) => item.userId === userId)

      if (resume) {
        resume.score = score
        break
      }
    }
  }

  async function rescoreResume(userId: string) {
    const result = await $fetch<RescoreResumeResponse>(`/api/admin/resumes/${userId}/rescore`, {
      method: 'POST',
    })

    updateResumeScore(userId, result.score)

    return result
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
    rescoreResume,
  }
}
