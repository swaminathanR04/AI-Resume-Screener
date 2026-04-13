<script setup lang="ts">
import TechnicalShell from '../../../components/TechnicalShell.vue'

const overviewCards = [
  {
    title: 'Audit Log',
    value: '24 Events',
    note: 'Recent security and system activity',
    link: '/technical/audit-log',
  },
  {
    title: 'Validation Center',
    value: '12 Checks',
    note: 'Resume file screening and validation',
    link: '/technical/validation-center',
  },
  {
    title: 'System Health',
    value: '99% Uptime',
    note: 'Access control and health monitoring',
    link: '/technical/system-health',
  },
  {
    title: 'Processing Queue',
    value: '14 In Queue',
    note: 'Current AI analysis workflow status',
    link: '/technical/processing-queue',
  },
]

const quickStats = [
  { label: 'Unreadable Files', value: 12 },
  { label: 'Rejected Uploads', value: 8 },
  { label: 'Access Violations', value: 4 },
  { label: 'Failed Analyses', value: 2 },
]
</script>

<template>
  <TechnicalShell>
    <section class="page-header">
      <div>
        <p class="eyebrow">IT Wireframes</p>
        <h1>AI Resume Screener</h1>
        <p class="subtitle">
          Technical dashboard overview for monitoring validation, access control,
          audit activity, and AI processing performance.
        </p>
      </div>

      <div class="header-actions">
        <button class="btn btn-secondary" type="button">View Reports</button>
        <button class="btn btn-primary" type="button">Refresh Dashboard</button>
      </div>
    </section>

    <section class="stats-grid">
      <article v-for="stat in quickStats" :key="stat.label" class="stat-card">
        <span class="stat-label">{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Technical Sections</h2>
        <span class="tag">Overview</span>
      </div>

      <div class="card-grid">
        <NuxtLink
          v-for="card in overviewCards"
          :key="card.title"
          :to="card.link"
          class="overview-card"
        >
          <p class="card-title">{{ card.title }}</p>
          <h3>{{ card.value }}</h3>
          <p class="card-note">{{ card.note }}</p>
          <span class="card-link">Open Section →</span>
        </NuxtLink>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>IT Summary</h2>
        <span class="tag secondary">Monitoring</span>
      </div>

      <ul class="summary-list">
        <li>Resume uploads must be validated before AI scoring begins.</li>
        <li>Corrupted or unsupported files should be blocked early.</li>
        <li>Role-based access must prevent applicants from entering protected pages.</li>
        <li>Failed analyses should be visible and easy to retry.</li>
      </ul>
    </section>
  </TechnicalShell>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #e66973;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  line-height: 1.1;
}

.subtitle {
  margin: 0;
  color: #6b7280;
  max-width: 760px;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.stat-label {
  display: block;
  font-size: 0.86rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 1.6rem;
  color: #1f2937;
}

.panel {
  background: white;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  margin-bottom: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.panel-header h2 {
  margin: 0;
}

.tag {
  padding: 7px 12px;
  border-radius: 999px;
  background: #e5e7eb;
  color: #374151;
  font-size: 0.78rem;
  font-weight: 700;
}

.tag.secondary {
  background: #dbeafe;
  color: #1d4ed8;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.overview-card {
  display: block;
  text-decoration: none;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 18px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
}

.card-title {
  margin: 0 0 8px;
  font-weight: 700;
  color: #1f2937;
}

.overview-card h3 {
  margin: 0 0 8px;
  font-size: 1.4rem;
  color: #5d82e8;
}

.card-note {
  margin: 0 0 12px;
  color: #6b7280;
}

.card-link {
  font-weight: 700;
  color: #1d4ed8;
}

.summary-list {
  margin: 0;
  padding-left: 20px;
  color: #374151;
}

.summary-list li {
  margin-bottom: 10px;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  background: #5d82e8;
  color: white;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

@media (max-width: 1000px) {
  .page-header {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 1.6rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>