<script setup lang="ts">
import TechnicalNav from './TechnicalNav.vue'
</script>

<template>
  <div class="page-shell">
    <TechnicalNav />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 220px 1fr;
  background: #eef1f5;
  color: #1f2937;
}

.content {
  padding: 24px;
}

@media (max-width: 900px) {
  .page-shell {
    grid-template-columns: 1fr;
  }
}
</style>