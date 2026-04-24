<script setup lang="ts">
  const { archivedResumes } = useResumeStore()

  function updateRanking({ resumeId, ranking }: { resumeId: number; ranking: number }) {
    const item = archivedResumes.value.find((resume) => resume.id === resumeId)

    if (item) {
      item.ranking = ranking
    }
  }
</script>

<template>
  <ResumeScreenerShell title="Archived Resumes" active-section="resumes" active-sub-item="Archived">
    <ResumeListPanel
      :items="archivedResumes"
      comment-key="archiveComment"
      empty-message="No archived resumes yet."
      @update-ranking="updateRanking"
    />
  </ResumeScreenerShell>
</template>
