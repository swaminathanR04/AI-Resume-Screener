<script setup lang="ts">
import TechnicalShell from '../../../components/TechnicalShell.vue'

type QueueMetric = {
  label: string
  value: number
}

const queueMetrics: QueueMetric[] = [
  { label: 'Pending', value: 7 },
  { label: 'In Progress', value: 3 },
  { label: 'Failed', value: 2 },
]

const latestCheck = {
  file: 'alex-carter-resume.pdf',
  fileType: 'Valid PDF',
  readability: 'Passed',
  duplicate: 'No duplicate found',
}

const errorRules = [
  'Corrupted file → reject upload',
  'Unreadable file → ask for resubmission',
  'Unsupported format → block and display error',
  'Duplicate detected → flag for admin review',
]

const recentUploads = [
  {
    id: 1,
    file: 'jamie_lee_resume.pdf',
    status: 'Validated',
    statusClass: 'success',
    note: 'Ready for AI analysis',
  },
  {
    id: 2,
    file: 'michael_chen_resume.pdf',
    status: 'Checking',
    statusClass: 'info',
    note: 'Readability scan in progress',
  },
  {
    id: 3,
    file: 'taylor_adams_resume.pdf',
    status: 'Rejected',
    statusClass: 'danger',
    note: 'Corrupted upload detected',
  },
]
</script>

<template>
  <TechnicalShell>
    <section class="page-header">
      <div>
        <p class="eyebrow">IT Wireframes</p>
        <h1>Resume Validation Center</h1>
        <p class="subtitle">
          Verify resume uploads before they are sent to AI processing.
        </p>
      </div>

      <div class="header-actions">
        <button class="btn btn-secondary" type="button">Reset Rules</button>
        <button class="btn btn-primary" type="button">Run Full Check</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Validation Overview</h2>
        <span class="tag success">Accepted format: PDF only</span>
      </div>

      <div class="metric-grid">
        <article v-for="metric in queueMetrics" :key="metric.label" class="metric-card">
          <span class="metric-label">{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </article>
      </div>

      <div class="details-grid">
        <article class="detail-card">
          <h3>Latest Check</h3>
          <ul class="detail-list">
            <li><strong>File:</strong> {{ latestCheck.file }}</li>
            <li><strong>File type:</strong> {{ latestCheck.fileType }}</li>
            <li><strong>Readability:</strong> {{ latestCheck.readability }}</li>
            <li><strong>Duplicate check:</strong> {{ latestCheck.duplicate }}</li>
          </ul>
        </article>

        <article class="detail-card">
          <h3>Error Rules</h3>
          <ul class="detail-list">
            <li v-for="rule in errorRules" :key="rule">
              {{ rule }}
            </li>
          </ul>
        </article>
      </div>

      <div class="action-row">
        <button class="btn btn-primary" type="button">Run Check</button>
        <button class="btn btn-secondary" type="button">Send to AI</button>
        <button class="btn btn-danger" type="button">Cancel</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Recent Upload Activity</h2>
        <span class="tag neutral">Validation Queue</span>
      </div>

      <div class="upload-list">
        <article v-for="upload in recentUploads" :key="upload.id" class="upload-item">
          <div>
            <p class="upload-file">{{ upload.file }}</p>
            <p class="upload-note">{{ upload.note }}</p>
          </div>

          <span class="status-pill" :class="upload.statusClass">
            {{ upload.status }}
          </span>
        </article>
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
.action-row {
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

.panel-header h2,
.detail-card h3 {
  margin: 0;
}

.tag {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.tag.success {
  background: #dcfce7;
  color: #166534;
}

.tag.neutral {
  background: #e5e7eb;
  color: #374151;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 18px;
}

.metric-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
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

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 18px;
}

.detail-card {
  background: #fafafa;
  border: 1px solid #ececec;
  border-radius: 16px;
  padding: 18px;
}

.detail-list {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #374151;
}

.detail-list li {
  margin-bottom: 8px;
}

.upload-list {
  display: grid;
  gap: 12px;
}

.upload-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
}

.upload-file {
  margin: 0;
  font-weight: 700;
  color: #1f2937;
}

.upload-note {
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

.btn-danger {
  background: #ef4444;
  color: white;
}

@media (max-width: 1000px) {
  .page-header {
    flex-direction: column;
  }

  .metric-grid,
  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 1.6rem;
  }

  .upload-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>