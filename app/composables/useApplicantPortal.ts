export type ApplicantNotification = {
  id: number
  title: string
  detail: string
  createdAt: string
}

export function useApplicantPortal() {
  const notifications = useState<ApplicantNotification[]>('applicant-notifications', () => [])

  function pushNotification(title: string, detail: string) {
    notifications.value.unshift({
      id: Date.now(),
      title,
      detail,
      createdAt: new Date().toLocaleString(),
    })
  }

  return {
    notifications,
    pushNotification,
  }
}
