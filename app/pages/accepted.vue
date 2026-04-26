<script setup lang="ts">
  const { acceptedResumes } = await useAdminResumes()
</script>

<template>
  <ResumeScreenerShell title="Accepted Resumes" active-section="resumes" active-sub-item="Accepted">
    <section class="space-y-4">
      <UCard v-for="resume in acceptedResumes" :key="resume.userId">
        <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="text-lg font-semibold text-[var(--ui-text)]">
                {{ resume.applicantName }}
              </h3>
              <UBadge color="primary" variant="soft">{{ resume.appliedRole }}</UBadge>
            </div>
            <p class="text-sm text-[var(--ui-text-muted)]">{{ resume.email }}</p>
            <p class="text-sm text-[var(--ui-text-muted)]">
              Submitted {{ new Date(resume.submittedAt).toLocaleString() }}
            </p>
          </div>

          <div class="flex flex-col items-start gap-3 sm:items-end">
            <div
              class="flex items-center gap-3 self-start rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-2"
            >
              <span
                class="text-xs font-medium tracking-[0.12em] text-[var(--ui-text-muted)] uppercase"
                >Ranking</span
              >
              <span class="text-base font-semibold text-[var(--ui-primary)]"
                >{{ resume.score.toFixed(1) }}/10</span
              >
            </div>
            <UButton
              :to="`/api/admin/resumes/${resume.userId}`"
              target="_blank"
              color="primary"
              variant="soft"
              label="Open Resume"
            />
          </div>
        </div>
      </UCard>

      <UCard v-if="acceptedResumes.length === 0">
        <div class="p-8 text-center text-[var(--ui-text-muted)]">No accepted resumes yet.</div>
      </UCard>
    </section>
  </ResumeScreenerShell>
</template>
