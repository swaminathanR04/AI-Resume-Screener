<script setup lang="ts">
import TechnicalShell from '../../../components/TechnicalShell.vue'

type AuditLog = {
  id: number
  date: string
  user: string
  action: string
  item: string
  details: string
  level: 'danger' | 'warning' | 'info' | 'success'
}

const auditLogs: AuditLog[] = [
  {
    id: 1,
    date: '03/12/26 12:20 PM',
    user: 'IT',
    action: 'Access Denied',
    item: 'Dashboard',
    details: 'Applicant blocked from admin page',
    level: 'danger',
  },
  {
    id: 2,
    date: '03/12/26 12:10 PM',
    user: 'System',
    action: 'File Rejected',
    item: 'Resume',
    details: 'Unreadable PDF flagged',
    level: 'warning',
  },
  {
    id: 3,
    date: '03/11/26 09:00 PM',
    user: 'System',
    action: 'Duplicate Found',
    item: 'Application',
    details: 'Possible duplicate submission',
    level: 'warning',
  },
  {
    id: 4,
    date: '03/10/26 01:00 PM',
    user: 'IT',
    action: 'Config Update',
    item: 'AI Weights',
    details: 'Threshold changed to 6/10',
    level: 'info',
  },
  {
    id: 5,
    date: '03/10/26 04:15 AM',
    user: 'Admin',
    action: 'Export Logged',
    item: 'Candidate',
    details: 'Candidate export recorded',
    level: 'success',
  },
  {
    id: 6,
    date: '03/09/26 08:42 PM',
    user: 'System',
    action: 'Retry Queued',
    item: 'Resume',
    details: 'Failed analysis scheduled for retry',
    level: 'info',
  },
]
</script>

<template>
  <TechnicalShell>
    <section class="page-header">
      <div>
        <p class="eyebrow">IT Wireframes</p>
        <h1>IT Audit Log</h1>
        <p class="subtitle">
          Review system activity, access attempts, rejected uploads, exports, and configuration
          changes.
        </p>
      </div>

      <div class="header-actions">
        <button class="btn btn-secondary" type="button">Filter Logs</button>
        <button class="btn btn-primary" type="button">Export Logs</button>
      </div>
    </section>

    <section class="summary-grid">
      <article class="summary-card">
        <span class="summary-label">Access Violations</span>
        <strong>4</strong>
      </article>

      <article class="summary-card">
        <span class="summary-label">Rejected Uploads</span>
        <strong>8</strong>
      </article>

      <article class="summary-card">
        <span class="summary-label">Duplicate Flags</span>
        <strong>3</strong>
      </article>

      <article class="summary-card">
        <span class="summary-label">Exports Logged</span>
        <strong>6</strong>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Audit Events</h2>
        <span class="tag">Live Monitoring</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Item</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="log in auditLogs" :key="log.id">
              <td>{{ log.date }}</td>
              <td>{{ log.user }}</td>
              <td>
                <span class="status-pill" :class="log.level">
                  {{ log.action }}
                </span>
              </td>
              <td>{{ log.item }}</td>
              <td>{{ log.details }}</td>
            </tr>
          </tbody>
        </table>
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

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.summary-label {
  display: block;
  font-size: 0.86rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.summary-card strong {
  font-size: 1.6rem;
  color: #1f2937;
}

.panel {
  background: white;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
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
  font-size: 1.2rem;
}

.tag {
  padding: 7px 12px;
  border-radius: 999px;
  background: #e5e7eb;
  color: #374151;
  font-size: 0.78rem;
  font-weight: 700;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}

th {
  background: #f3f4f6;
  font-weight: 700;
  color: #1f2937;
}

tbody tr:hover {
  background: #fafafa;
}

.status-pill {
  display: inline-block;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill.danger {
  background: #fee2e2;
  color: #991b1b;
}

.status-pill.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-pill.info {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-pill.success {
  background: #dcfce7;
  color: #166534;
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
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 1.6rem;
  }

  th,
  td {
    padding: 12px 10px;
    font-size: 0.88rem;
  }
}
</style>