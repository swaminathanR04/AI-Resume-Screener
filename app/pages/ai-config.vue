<template>
  <ResumeScreenerShell title="AI Configuration" active-section="ai-config">
    <section class="resume-card p-4 sm:p-6">
      <div class="space-y-7 text-[1.05rem] leading-6">
        <div>
          <h2 class="resume-section-title mb-4">AI Scoring Weights</h2>
          <div class="space-y-1 pl-5 text-[1.02rem] font-semibold sm:pl-10">
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
          <h2 class="mb-2 text-[1.05rem] font-semibold">Custom:</h2>
          <ul class="list-disc pl-6 text-[1.02rem]">
            <li>Add a point if applicant is a US Veteran</li>
          </ul>
        </div>

        <div class="pt-4 text-[1.08rem] font-semibold">Minimum Candidate Score Threshold: 6/10</div>

        <div class="flex flex-wrap gap-4 pt-5 sm:justify-between">
          <button type="button" class="resume-button px-5 py-2.5">Reset to Default</button>
          <button type="button" class="resume-button px-5 py-2.5">Save</button>
          <button type="button" class="resume-button resume-button--wide px-5 py-2.5">
            Re-score
          </button>
        </div>
      </div>
    </section>
  </ResumeScreenerShell>
</template>
