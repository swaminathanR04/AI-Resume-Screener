export const useProfileDisplayName = (fallbackValue: MaybeRefOrGetter<string>) => {
  const fallback = computed(() => toValue(fallbackValue) || 'user@example.com')
  const displayName = useState<string>('profile-display-name', () => fallback.value)

  watchEffect(() => {
    if (!displayName.value.trim()) {
      displayName.value = fallback.value
    }
  })

  return {
    displayName,
  }
}
