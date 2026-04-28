<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      compact?: boolean
      showTagline?: boolean
      align?: 'left' | 'center'
    }>(),
    {
      compact: false,
      showTagline: false,
      align: 'left',
    }
  )

  const wrapperClass = computed(() =>
    props.align === 'center' ? 'items-center text-center' : 'items-start text-left'
  )
</script>

<template>
  <div class="company-brand" :class="[wrapperClass, props.compact ? 'company-brand--compact' : '']">
    <div class="company-brand__lockup" aria-label="40 Hours Inc.">
      <div class="company-brand__forty">40</div>
      <div class="company-brand__wordmark">
        <span class="company-brand__hours">HOURS</span>
        <span class="company-brand__inc">INC.</span>
      </div>
    </div>

    <p v-if="showTagline" class="company-brand__tagline">
      Faster resume review with a hiring workflow built for real teams.
    </p>
  </div>
</template>
