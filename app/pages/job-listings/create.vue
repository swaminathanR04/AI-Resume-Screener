<template>
  <ResumeScreenerShell
    title="Create New Job Listing"
    active-section="job-listings"
    active-sub-item="Create New"
  >
    <UCard>
      <div class="space-y-7 p-4 text-[1.02rem] text-[var(--ui-text)] sm:p-6">
        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Job Information</h2>
          <div class="text-[var(--ui-text-muted)]">Job Title: Software Engineer Intern</div>
          <div class="text-[var(--ui-text-muted)]">Location: Onsite, Dallas, Texas</div>
          <div class="text-[var(--ui-text-muted)]">Employment Type: Internship</div>
        </div>

        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Job Description:</h2>
          <div class="text-[var(--ui-text-muted)]">
            Assist in building web applications using modern framework.
          </div>
          <div class="text-[var(--ui-text-muted)]">Work with backend APIs and databases</div>
          <div class="text-[var(--ui-text-muted)]">Collaborate with a team on feature development</div>
        </div>

        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Required Skills:</h2>
          <ul class="list-disc pl-6 text-[var(--ui-text-muted)]">
            <li>Python</li>
            <li>JavaScript</li>
            <li>SQL</li>
          </ul>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 border-t border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-4 sm:px-6">
        <UButton type="button" color="primary" variant="solid" label="Save Listing" />
        <UButton type="button" color="neutral" variant="soft" label="Cancel" />
      </div>
    </UCard>
  </ResumeScreenerShell>
</template>
