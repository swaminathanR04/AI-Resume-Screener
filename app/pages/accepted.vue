<script setup lang="ts">
  const { acceptedResumes } = useResumeStore()

  function updateRanking({ resumeId, ranking }: { resumeId: number; ranking: number }) {
    const item = acceptedResumes.value.find((resume) => resume.id === resumeId)

    if (item) {
      item.ranking = ranking
    }
  }
</script>

<template>
  <ResumeScreenerShell title="Accepted Resumes" active-section="resumes" active-sub-item="Accepted">
    <ResumeListPanel
      :items="acceptedResumes"
      comment-key="acceptanceComment"
      empty-message="No accepted resumes yet."
      @update-ranking="updateRanking"
    />
  </ResumeScreenerShell>
</template>
