<template>
  <ResumeScreenerShell
    title="Create New Job Listing"
    active-section="job-listings"
    active-sub-item="Create New"
  >
    <section class="resume-card overflow-hidden">
      <div class="h-5 bg-[#c9c9c9]"></div>

      <div class="space-y-7 px-4 py-6 text-[1.02rem] sm:px-6">
        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Job Information</h2>
          <div>Job Title: Software Engineer Intern</div>
          <div>Location: Onsite, Dallas, Texas</div>
          <div>Employment Type: Internship</div>
        </div>

        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Job Description:</h2>
          <div>Assist in building web applications using modern framework.</div>
          <div>Work with backend APIs and databases</div>
          <div>Collaborate with a team on feature development</div>
        </div>

        <div>
          <h2 class="mb-1 text-[1.12rem] font-semibold">Required Skills:</h2>
          <ul class="list-disc pl-6">
            <li>Python</li>
            <li>JavaScript</li>
            <li>SQL</li>
          </ul>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 border-t border-white/60 bg-[#dadada] px-4 py-4 sm:px-6">
        <button type="button" class="resume-button px-7 py-2.5">Save Listing</button>
        <button type="button" class="resume-button px-7 py-2.5">Cancel</button>
      </div>
    </section>
  </ResumeScreenerShell>
</template>
