export type AdminResumeReviewStatus = 'new' | 'advanced' | 'rejected' | 'archived'

export type AdminResumeItem = {
  reviewStatus: AdminResumeReviewStatus
  userId: string
  applicantName: string
  email: string
  appliedRole: string
  submittedAt: string
  applicationCount: number
  score: number | null
  aiSummary: string | null
  isRescoring?: boolean
}

type RescoreResumeResponse = {
  reviewStatus: AdminResumeReviewStatus
  userId: string
  score: number | null
  aiSummary: string | null
  aiMatchedSkills: string[]
  aiMissingSkills: string[]
  aiConcerns: string[]
  aiScoredAt: string | null
  aiModel: string | null
}

type BulkRescoreResponse = {
  total: number
  rescoredCount: number
  rejectedCount: number
  pendingCount: number
}

function sortResumes(items: AdminResumeItem[]) {
  return [...items].sort(
    (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
  )
}

function assignBuckets(
  items: AdminResumeItem[],
  buckets: {
    newResumes: Ref<AdminResumeItem[]>
    acceptedResumes: Ref<AdminResumeItem[]>
    rejectedResumes: Ref<AdminResumeItem[]>
    archivedResumes: Ref<AdminResumeItem[]>
  }
) {
  buckets.newResumes.value = sortResumes(items.filter((item) => item.reviewStatus === 'new'))
  buckets.acceptedResumes.value = sortResumes(
    items.filter((item) => item.reviewStatus === 'advanced')
  )
  buckets.rejectedResumes.value = sortResumes(
    items.filter((item) => item.reviewStatus === 'rejected')
  )
  buckets.archivedResumes.value = sortResumes(
    items.filter((item) => item.reviewStatus === 'archived')
  )
}

function getResumeScoreTextClass(score: number | null) {
  if (score === null) {
    return 'text-[var(--ui-text-muted)]'
  }

  if (score >= 8) {
    return 'text-green-600 dark:text-green-400'
  }

  if (score >= 6) {
    return 'text-amber-600 dark:text-amber-400'
  }

  if (score >= 4) {
    return 'text-orange-600 dark:text-orange-400'
  }

  return 'text-red-600 dark:text-red-400'
}

export async function useAdminResumes() {
  const isInitialized = useState<boolean>('admin-resumes-initialized', () => false)
  const newResumes = useState<AdminResumeItem[]>('admin-new-resumes', () => [])
  const acceptedResumes = useState<AdminResumeItem[]>('admin-accepted-resumes', () => [])
  const rejectedResumes = useState<AdminResumeItem[]>('admin-rejected-resumes', () => [])
  const archivedResumes = useState<AdminResumeItem[]>('admin-archived-resumes', () => [])

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

      assignBuckets(value, { newResumes, acceptedResumes, rejectedResumes, archivedResumes })
      isInitialized.value = true
    },
    { immediate: true }
  )

  function takeResume(userId: string) {
    const allBuckets = [
      newResumes.value,
      acceptedResumes.value,
      rejectedResumes.value,
      archivedResumes.value,
    ]

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
    archivedResumes.value = archivedResumes.value.filter((item) => item.userId !== userId)
  }

  async function moveResume(userId: string, target: 'advanced' | 'rejected' | 'archived') {
    const updatedResume = await $fetch<AdminResumeItem>(`/api/admin/resumes/${userId}/status`, {
      method: 'POST',
      body: {
        reviewStatus: target,
      },
    })

    removeResume(userId)

    if (target === 'advanced') {
      acceptedResumes.value = sortResumes([updatedResume, ...acceptedResumes.value])
    } else if (target === 'rejected') {
      rejectedResumes.value = sortResumes([updatedResume, ...rejectedResumes.value])
    } else {
      archivedResumes.value = sortResumes([updatedResume, ...archivedResumes.value])
    }

    return updatedResume
  }

  function updateResumeScore(
    userId: string,
    score: number | null,
    aiSummary: string | null,
    reviewStatus: AdminResumeReviewStatus
  ) {
    const resume = takeResume(userId)

    if (!resume) {
      return
    }

    removeResume(userId)

    const updatedResume: AdminResumeItem = {
      ...resume,
      reviewStatus,
      score,
      aiSummary,
      isRescoring: false,
    }

    if (reviewStatus === 'new') {
      newResumes.value = sortResumes([updatedResume, ...newResumes.value])
    } else if (reviewStatus === 'advanced') {
      acceptedResumes.value = sortResumes([updatedResume, ...acceptedResumes.value])
    } else if (reviewStatus === 'rejected') {
      rejectedResumes.value = sortResumes([updatedResume, ...rejectedResumes.value])
    } else {
      archivedResumes.value = sortResumes([updatedResume, ...archivedResumes.value])
    }
  }

  async function rescoreResume(userId: string) {
    const resume = takeResume(userId)

    if (resume && resume.reviewStatus === 'new') {
      resume.isRescoring = true
      resume.score = null
      resume.aiSummary = 'In progress'
      newResumes.value = sortResumes([...newResumes.value])
    }

    const result = await $fetch<RescoreResumeResponse>(`/api/admin/resumes/${userId}/rescore`, {
      method: 'POST',
    })

    updateResumeScore(userId, result.score, result.aiSummary, result.reviewStatus)

    return result
  }

  async function rescoreNewResumes() {
    const result = await $fetch<BulkRescoreResponse>('/api/admin/resumes/rescore-new', {
      method: 'POST',
    })

    await refreshResumes()

    return result
  }

  async function refreshResumes() {
    await refresh()

    if (!data.value) {
      return
    }

    assignBuckets(data.value, { newResumes, acceptedResumes, rejectedResumes, archivedResumes })
  }

  return {
    pending,
    error,
    refreshResumes,
    newResumes,
    acceptedResumes,
    rejectedResumes,
    archivedResumes,
    getResumeScoreTextClass,
    moveResume,
    rescoreResume,
    rescoreNewResumes,
  }
}
