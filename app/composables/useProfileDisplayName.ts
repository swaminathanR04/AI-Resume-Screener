import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export const useProfileDisplayName = (fallbackValue: MaybeRefOrGetter<string>) => {
  const fallback = computed(() => toValue(fallbackValue) || 'user@example.com')
  const displayName = computed(() => fallback.value)

  return {
    displayName,
  }
}
