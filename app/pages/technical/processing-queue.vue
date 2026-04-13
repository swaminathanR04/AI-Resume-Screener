<script setup lang="ts">
import TechnicalShell from '../../../components/TechnicalShell.vue'

const queueItems = [
  {
    id: 1,
    file: 'jamie_lee_resume.pdf',
    note: 'Waiting for validation',
    status: 'Pending',
    statusClass: 'pending',
  },
  {
    id: 2,
    file: 'michael_chen_resume.pdf',
    note: 'AI analysis started',
    status: 'In Progress',
    statusClass: 'progress',
  },
  {
    id: 3,
    file: 'taylor_adams_resume.pdf',
    note: 'Corrupted upload detected',
    status: 'Failed',
    statusClass: 'failed',
  },
  {
    id: 4,
    file: 'nora_smith_resume.pdf',
    note: 'Ready for recruiter review',
    status: 'Completed',
    statusClass: 'completed',
  },
]

const performanceTargets = [
  'AI analysis should complete within 4–5 seconds',
  'Unreadable/corrupted files should be blocked early',
  'Failed analyses should support retry without full resubmission',
]

const queueStats = [
  { label: 'Total in Queue', value: 14 },
  { label: 'Currently Processing', value: 3 },
  { label: 'Failures Today', value: 2 },
]
</script>

<template>
  <TechnicalShell>
    <section class="page-header">
      <div>
        <p class="eyebrow">IT Wireframes</p>
        <h1>Processing Queue</h1>
        <p class="subtitle">
          Track resume processing activity, failures, and AI analysis progress.
        </p>
      </div>

      <div class="header-actions">
        <button class="btn btn-secondary" type="button">Retry Failed</button>
        <button class="btn btn-primary" type="button">Refresh Queue</button>
      </div>
    </section>

    <section class="stats-grid">
      <article v-for="stat in queueStats" :key="stat.label" class="stat-card">
        <span class="stat-label">{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Queue Activity</h2>
        <span class="tag neutral">Performance</span>
      </div>

      <div class="queue-list">
        <article v-for="item in queueItems" :key="item.id" class="queue-item">
          <div>
            <p class="queue-file">{{ item.file }}</p>
            <p class="queue-note">{{ item.note }}</p>
          </div>

          <span class="status-pill" :class="item.statusClass">
            {{ item.status }}
          </span>
        </article>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Performance Targets</h2>
        <span class="tag info">Monitoring</span>
      </div>

      <ul class="target-list">
        <li v-for="target in performanceTargets" :key="target">
          {{ target }}
        </li>
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
  max-width: 720px;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  font-size: 0.78rem;
  font-weight: 700;
}

.tag.neutral {
  background: #e5e7eb;
  color: #374151;
}

.tag.info {
  background: #dbeafe;
  color: #1d4ed8;
}

.queue-list {
  display: grid;
  gap: 12px;
}

.queue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
}

.queue-file {
  margin: 0;
  font-weight: 700;
  color: #1f2937;
}

.queue-note {
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

.status-pill.pending {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-pill.progress {
  background: #e5e7eb;
  color: #374151;
}

.status-pill.failed {
  background: #fee2e2;
  color: #991b1b;
}

.status-pill.completed {
  background: #dcfce7;
  color: #166534;
}

.target-list {
  margin: 0;
  padding-left: 20px;
  color: #374151;
}

.target-list li {
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
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 1.6rem;
  }

  .queue-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>