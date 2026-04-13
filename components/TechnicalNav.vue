<script setup lang="ts">
const navItems = [
  {
    label: 'Overview',
    subtext: 'Dashboard Home',
    to: '/technical',
  },
  {
    label: 'Audit Log',
    subtext: 'System Activity',
    to: '/technical/audit-log',
  },
  {
    label: 'Validation Center',
    subtext: 'Resume Checks',
    to: '/technical/validation-center',
  },
  {
    label: 'System Health',
    subtext: 'Access + Monitoring',
    to: '/technical/system-health',
  },
  {
    label: 'Processing Queue',
    subtext: 'AI Workflow',
    to: '/technical/processing-queue',
  },
]
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="avatar-box"></div>
      <div>
        <p class="user-name">Technical Dashboard</p>
        <p class="user-role">IT / Technical</p>
      </div>
    </div>

    <nav class="nav-list">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
      >
        <span class="nav-text">
          <strong>{{ item.label }}</strong>
          <small>{{ item.subtext }}</small>
        </span>
        <span class="arrow">›</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-logo">AI Resume Screener</div>
  </aside>
</template>

<style scoped>
.sidebar {
  background: #5d82e8;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 18px;
  min-height: 100vh;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-box {
  width: 18px;
  height: 18px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 4px;
}

.user-name {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
}

.user-role {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.9;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  background: #e8f0ea;
  color: #1f2937;
  border-left: 4px solid transparent;
  border-radius: 10px;
  padding: 14px 12px;
  transition: 0.15s ease;
}

.nav-item:hover {
  transform: translateX(2px);
}

.nav-text strong {
  display: block;
  font-size: 1rem;
}

.nav-text small {
  display: block;
  color: #6b7280;
  margin-top: 2px;
}

.nav-item.router-link-active {
  background: #cfe8c8;
  border-left-color: #2d7d46;
}

.arrow {
  font-size: 1.4rem;
  color: #4b5563;
  line-height: 1;
}

.sidebar-logo {
  margin-top: auto;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
}
</style>