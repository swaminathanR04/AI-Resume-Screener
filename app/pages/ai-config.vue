<template>
  <ResumeScreenerShell title="AI Configuration" active-section="ai-config">
    <UCard>
      <div class="space-y-7 p-4 text-[1.05rem] leading-6 sm:p-6">
        <div>
          <h2
            class="mb-4 text-xs font-bold tracking-[0.12em] text-[var(--ui-text-muted)] uppercase"
          >
            AI Scoring Weights
          </h2>
          <div class="space-y-2 pl-5 text-[1.02rem] font-semibold text-[var(--ui-text)] sm:pl-10">
            <div class="grid max-w-xs grid-cols-[1fr_auto] gap-6">
              <span>Skills:</span>
              <span>40%</span>
            </div>
            <div class="grid max-w-xs grid-cols-[1fr_auto] gap-6">
              <span>Experience:</span>
              <span>30%</span>
            </div>
            <div class="grid max-w-xs grid-cols-[1fr_auto] gap-6">
              <span>Education:</span>
              <span>20%</span>
            </div>
            <div class="grid max-w-xs grid-cols-[1fr_auto] gap-6">
              <span>Portfolio:</span>
              <span>10%</span>
            </div>
          </div>
        </div>

        <div>
          <h2 class="mb-2 text-[1.05rem] font-semibold text-[var(--ui-text)]">Custom:</h2>
          <ul class="list-disc pl-6 text-[1.02rem] text-[var(--ui-text)]">
            <li>Add a point if applicant is a US Veteran</li>
          </ul>
        </div>

        <div class="pt-4 text-[1.08rem] font-semibold text-[var(--ui-text)]">
          Minimum Candidate Score Threshold: 6/10
        </div>

        <div class="flex flex-wrap gap-4 pt-5 sm:justify-between">
          <UButton type="button" color="neutral" variant="soft" label="Reset to Default" />
          <UButton type="button" color="primary" variant="solid" label="Save" />
          <UButton type="button" color="primary" variant="outline" label="Re-score" />
        </div>
      </div>
    </UCard>
  </ResumeScreenerShell>
</template>
