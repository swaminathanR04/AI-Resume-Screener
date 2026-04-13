<script setup lang="ts">
import TechnicalShell from '../../../components/TechnicalShell.vue'

const accessRules = [
  'Applicant → denied admin dashboard access',
  'Recruiter/Admin → allowed candidate actions',
  'IT → allowed logs, health, and monitoring tools',
]

const systemMetrics = [
  { label: 'Unreadable Files', value: 12 },
  { label: 'Rejected Uploads', value: 8 },
  { label: 'Access Violations', value: 4 },
]

const recentEvents = [
  {
    id: 1,
    title: 'Applicant blocked from admin dashboard',
    note: 'Role-based access rule enforced successfully',
    status: 'Blocked',
    statusClass: 'danger',
  },
  {
    id: 2,
    title: 'Resume export permission verified',
    note: 'Authorized admin completed export request',
    status: 'Approved',
    statusClass: 'success',
  },
  {
    id: 3,
    title: 'System health check completed',
    note: 'No outage detected during latest scan',
    status: 'Stable',
    statusClass: 'info',
  },
]
</script>

<template>
  <TechnicalShell>
    <section class="page-header">
      <div>
        <p class="eyebrow">IT Wireframes</p>
        <h1>Access Control &amp; System Health</h1>
        <p class="subtitle">
          Monitor role permissions, access violations, and overall technical health.
        </p>
      </div>

      <div class="header-actions">
        <button class="btn btn-secondary" type="button">View Logs</button>
        <button class="btn btn-primary" type="button">Refresh Health</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Role-Based Access</h2>
        <span class="tag warning">Protected Area</span>
      </div>

      <ul class="rule-list">
        <li v-for="rule in accessRules" :key="rule">
          {{ rule }}
        </li>
      </ul>
    </section>

    <section class="metric-grid">
      <article v-for="metric in systemMetrics" :key="metric.label" class="metric-card">
        <span class="metric-label">{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Recent System Events</h2>
        <span class="tag neutral">Performance</span>
      </div>

      <div class="event-list">
        <article v-for="event in recentEvents" :key="event.id" class="event-item">
          <div>
            <p class="event-title">{{ event.title }}</p>
            <p class="event-note">{{ event.note }}</p>
          </div>

          <span class="status-pill" :class="event.statusClass">
            {{ event.status }}
          </span>
        </article>
      </div>

      <div class="button-row">
        <button class="btn btn-secondary" type="button">Reset Rules</button>
        <button class="btn btn-primary" type="button">Save</button>
      </div>
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
  max-width: 720px;
}

.header-actions,
.button-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
  font-size: 0.78rem;
  font-weight: 700;
}

.tag.warning {
  background: #fef3c7;
  color: #92400e;
}

.tag.neutral {
  background: #e5e7eb;
  color: #374151;
}

.rule-list {
  margin: 0;
  padding-left: 20px;
  color: #374151;
}

.rule-list li {
  margin-bottom: 10px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.metric-label {
  display: block;
  font-size: 0.86rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.metric-card strong {
  font-size: 1.6rem;
  color: #1f2937;
}

.event-list {
  display: grid;
  gap: 12px;
  margin-bottom: 18px;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
}

.event-title {
  margin: 0;
  font-weight: 700;
  color: #1f2937;
}

.event-note {
  margin: 6px 0 0;
  color: #6b7280;
}

.status-pill {
  display: inline-block;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill.success {
  background: #dcfce7;
  color: #166534;
}

.status-pill.info {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-pill.danger {
  background: #fee2e2;
  color: #991b1b;
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

  .metric-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 1.6rem;
  }

  .event-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>