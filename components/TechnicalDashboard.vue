<template>
  <div class="page-shell">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="avatar-box"></div>
        <div>
          <p class="user-name">Steve Jobs</p>
          <p class="user-role">IT Admin</p>
        </div>
      </div>

      <nav class="nav-list">
        <button
          v-for="item in navItems"
          :key="item.label"
          class="nav-item"
          :class="{ active: item.active }"
        >
          <span>
            <strong>{{ item.label }}</strong>
            <small>{{ item.subtext }}</small>
          </span>
          <span class="arrow">›</span>
        </button>
      </nav>

      <div class="sidebar-logo">LOGO</div>
    </aside>

    <main class="content">
      <header class="page-header">
        <div>
          <p class="eyebrow">IT Wireframes</p>
          <h1>AI Resume Screener</h1>
          <p class="subtitle">
            Monitor validation, access control, audit activity, and processing health.
          </p>
        </div>

        <div class="header-actions">
          <button class="btn btn-secondary">Export Logs</button>
          <button class="btn btn-primary">Refresh Status</button>
        </div>
      </header>

      <section class="top-grid">
        <article class="panel panel-large">
          <div class="panel-header">
            <h2>IT Audit Log</h2>
            <span class="tag neutral">Live Monitoring</span>
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
                    <span class="status-pill" :class="log.type">
                      {{ log.action }}
                    </span>
                  </td>
                  <td>{{ log.item }}</td>
                  <td>{{ log.details }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <h2>Resume Validation Center</h2>
            <span class="tag success">Accepted format: PDF only</span>
          </div>

          <div class="section-block">
            <h3>Upload Queue</h3>
            <div class="metric-row">
              <div class="mini-card">
                <span class="mini-label">Pending</span>
                <strong>7</strong>
              </div>
              <div class="mini-card">
                <span class="mini-label">In Progress</span>
                <strong>3</strong>
              </div>
              <div class="mini-card">
                <span class="mini-label">Failed</span>
                <strong>2</strong>
              </div>
            </div>
          </div>

          <div class="section-block">
            <h3>Latest Check</h3>
            <ul class="bullet-list">
              <li><strong>File:</strong> {{ latestCheck.file }}</li>
              <li><strong>File type:</strong> {{ latestCheck.fileType }}</li>
              <li><strong>Readability:</strong> {{ latestCheck.readability }}</li>
              <li><strong>Duplicate check:</strong> {{ latestCheck.duplicate }}</li>
            </ul>
          </div>

          <div class="section-block">
            <h3>Error Rules</h3>
            <ul class="bullet-list">
              <li>Corrupted file → reject upload</li>
              <li>Unreadable file → ask for resubmission</li>
              <li>Unsupported format → block and display error</li>
              <li>Duplicate detected → flag for admin review</li>
            </ul>
          </div>

          <div class="button-row">
            <button class="btn btn-primary">Run Check</button>
            <button class="btn btn-secondary">Send to AI</button>
            <button class="btn btn-danger">Cancel</button>
          </div>
        </article>
      </section>

      <section class="bottom-grid">
        <article class="panel">
          <div class="panel-header">
            <h2>Access Control &amp; System Health</h2>
            <span class="tag warning">Protected Area</span>
          </div>

          <div class="section-block">
            <h3>Role-Based Access</h3>
            <ul class="bullet-list">
              <li>Applicant → denied admin dashboard access</li>
              <li>Recruiter/Admin → allowed candidate actions</li>
              <li>IT → allowed logs, health, and monitoring tools</li>
            </ul>
          </div>

          <div class="section-block">
            <h3>System Health</h3>
            <div class="metric-row">
              <div
                v-for="metric in systemMetrics"
                :key="metric.label"
                class="metric-card"
              >
                <span class="mini-label">{{ metric.label }}</span>
                <strong>{{ metric.value }}</strong>
              </div>
            </div>
          </div>

          <div class="button-row">
            <button class="btn btn-secondary">Reset Rules</button>
            <button class="btn btn-primary">Save</button>
            <button class="btn btn-secondary">View Logs</button>
          </div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <h2>Processing Queue</h2>
            <span class="tag neutral">Performance</span>
          </div>

          <div class="queue-list">
            <div v-for="item in queueItems" :key="item.id" class="queue-item">
              <div>
                <p class="queue-title">{{ item.name }}</p>
                <p class="queue-subtitle">{{ item.note }}</p>
              </div>
              <span class="status-pill" :class="item.statusClass">
                {{ item.status }}
              </span>
            </div>
          </div>

          <div class="section-block">
            <h3>Performance Targets</h3>
            <ul class="bullet-list">
              <li>AI analysis should complete within 4–5 seconds</li>
              <li>Unreadable/corrupted files should be blocked early</li>
              <li>Failed analyses should support retry without full resubmission</li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const navItems = [
  { label: 'Resumes', subtext: 'All / Accepted', active: false },
  { label: 'Job Listings', subtext: 'List / Create New', active: false },
  { label: 'Audit Log', subtext: 'Monitoring', active: true },
  { label: 'AI Config', subtext: 'Rules / Scoring', active: false },
]

const auditLogs = [
  {
    id: 1,
    date: '03/12/26 12:20 PM',
    user: 'IT',
    action: 'Access Denied',
    item: 'Dashboard',
    details: 'Applicant blocked from admin page',
    type: 'danger',
  },
  {
    id: 2,
    date: '03/12/26 12:10 PM',
    user: 'System',
    action: 'File Rejected',
    item: 'Resume',
    details: 'Unreadable PDF flagged',
    type: 'warning',
  },
  {
    id: 3,
    date: '03/11/26 09:00 PM',
    user: 'System',
    action: 'Duplicate Found',
    item: 'Application',
    details: 'Possible duplicate submission',
    type: 'warning',
  },
  {
    id: 4,
    date: '03/10/26 01:00 PM',
    user: 'IT',
    action: 'Config Update',
    item: 'AI Weights',
    details: 'Threshold changed to 6/10',
    type: 'info',
  },
  {
    id: 5,
    date: '03/10/26 04:15 AM',
    user: 'Admin',
    action: 'Export Logged',
    item: 'Candidate',
    details: 'Candidate export recorded',
    type: 'success',
  },
]

const latestCheck = {
  file: 'alex-carter-resume.pdf',
  fileType: 'Valid PDF',
  readability: 'Passed',
  duplicate: 'No duplicate found',
}

const systemMetrics = [
  { label: 'Unreadable Files', value: 12 },
  { label: 'Rejected Uploads', value: 8 },
  { label: 'Access Violations', value: 4 },
]

const queueItems = [
  {
    id: 1,
    name: 'jamie_lee_resume.pdf',
    note: 'Waiting for validation',
    status: 'Pending',
    statusClass: 'info',
  },
  {
    id: 2,
    name: 'michael_chen_resume.pdf',
    note: 'AI analysis started',
    status: 'In Progress',
    statusClass: 'neutral',
  },
  {
    id: 3,
    name: 'taylor_adams_resume.pdf',
    note: 'Corrupted upload detected',
    status: 'Failed',
    statusClass: 'danger',
  },
]
</script>

<style scoped>
.page-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: #eef1f5;
  color: #1f2937;
}

.sidebar {
  background: #5d82e8;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 18px;
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
  width: 100%;
  border: none;
  background: #e8f0ea;
  color: #1f2937;
  border-left: 4px solid transparent;
  border-radius: 10px;
  padding: 14px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor: pointer;
}

.nav-item strong {
  display: block;
  font-size: 1rem;
}

.nav-item small {
  display: block;
  color: #6b7280;
  margin-top: 2px;
}

.nav-item.active {
  background: #cfe8c8;
  border-left-color: #2d7d46;
}

.arrow {
  font-size: 1.4rem;
  color: #4b5563;
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

.content {
  padding: 28px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #e66973;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
}

.subtitle {
  margin: 8px 0 0;
  color: #6b7280;
}

.header-actions,
.button-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.top-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
}

.panel {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.panel-large {
  min-height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.panel-header h2,
.section-block h3 {
  margin: 0;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.tag.success {
  background: #dcfce7;
  color: #166534;
}

.tag.warning {
  background: #fef3c7;
  color: #92400e;
}

.tag.neutral {
  background: #e5e7eb;
  color: #374151;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

th,
td {
  padding: 12px 10px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}

th {
  background: #f3f4f6;
  font-weight: 700;
}

.section-block {
  margin-bottom: 18px;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-card,
.mini-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
}

.mini-label {
  display: block;
  color: #6b7280;
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.metric-card strong,
.mini-card strong {
  font-size: 1.4rem;
}

.bullet-list {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #374151;
}

.bullet-list li {
  margin-bottom: 8px;
}

.queue-list {
  display: grid;
  gap: 12px;
  margin-bottom: 18px;
}

.queue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
}

.queue-title {
  margin: 0;
  font-weight: 700;
}

.queue-subtitle {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.status-pill {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill.success {
  background: #dcfce7;
  color: #166534;
}

.status-pill.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-pill.danger {
  background: #fee2e2;
  color: #991b1b;
}

.status-pill.info {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-pill.neutral {
  background: #e5e7eb;
  color: #374151;
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

@media (max-width: 1100px) {
  .page-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    min-height: auto;
  }

  .top-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .content {
    padding: 18px;
  }

  .page-header {
    flex-direction: column;
  }

  .metric-row {
    grid-template-columns: 1fr;
  }
}
</style>