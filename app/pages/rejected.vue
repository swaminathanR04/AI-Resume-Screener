<script setup lang="ts">
  const { rejectedResumes } = useResumeStore()

  function updateRanking({ resumeId, ranking }: { resumeId: number; ranking: number }) {
    const item = rejectedResumes.value.find((resume) => resume.id === resumeId)

    if (item) {
      item.ranking = ranking
    }
  }
</script>

<template>
  <ResumeScreenerShell title="Rejected Resumes" active-section="resumes" active-sub-item="Rejected">
    <ResumeListPanel
      :items="rejectedResumes"
      comment-key="rejectionComment"
      empty-message="No rejected resumes yet."
      @update-ranking="updateRanking"
    />
  </ResumeScreenerShell>
</template>
