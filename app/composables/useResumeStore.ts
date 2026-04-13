export type ResumeDecision = 'accept' | 'reject' | 'archive'

export type ResumeItem = {
  id: number
  ranking: number
  applicantName: string
  positionAppliedFor: string
  dateSubmitted: string
  acceptanceComment?: string
  rejectionComment?: string
  archiveComment?: string
}

const initialAllResumes: ResumeItem[] = [
  { id: 1, ranking: 9.2, applicantName: 'John Smith', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '2 days ago' },
  { id: 2, ranking: 8.7, applicantName: 'Emily Davis', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '1 week ago' },
  { id: 3, ranking: 8.5, applicantName: 'Michael Brown', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '3 days ago' },
  { id: 4, ranking: 7.9, applicantName: 'Sarah Wilson', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '5 days ago' },
  { id: 5, ranking: 7.6, applicantName: 'David Johnson', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '1 day ago' },
  { id: 6, ranking: 7.2, applicantName: 'Jessica Taylor', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '4 days ago' },
]

const initialAcceptedResumes: ResumeItem[] = [
  { id: 101, ranking: 9.6, applicantName: 'Maya Patel', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '2 hours ago', acceptanceComment: 'Accepted because the resume shows strong ownership of large frontend projects, clear leadership experience, and measurable product impact across multiple shipped releases.' },
  { id: 102, ranking: 9.3, applicantName: 'Daniel Kim', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: 'Yesterday', acceptanceComment: 'Accepted due to excellent systems thinking, strong collaboration history, and a consistent track record of delivering reliable production features at scale.' },
  { id: 103, ranking: 9.1, applicantName: 'Sofia Ramirez', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '3 days ago', acceptanceComment: 'Accepted because the candidate demonstrates a strong blend of technical depth, mentoring ability, and practical experience working across cross-functional teams.' },
  { id: 104, ranking: 8.9, applicantName: 'Ethan Brooks', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '4 days ago', acceptanceComment: 'Accepted after review of the resume showed relevant architecture experience, solid problem-solving evidence, and clear alignment with the role requirements.' },
  { id: 105, ranking: 8.8, applicantName: 'Chloe Nguyen', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '1 week ago', acceptanceComment: 'Accepted because of strong end-to-end feature delivery experience, polished communication, and a resume that reflects both technical execution and team impact.' },
  { id: 106, ranking: 8.7, applicantName: 'Noah Carter', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '1 week ago', acceptanceComment: 'Accepted based on relevant full-stack experience, evidence of sustained performance, and a background that suggests a good fit for collaborative engineering work.' },
]

const initialRejectedResumes: ResumeItem[] = [
  { id: 201, ranking: 4.2, applicantName: 'Alex Thompson', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '2 days ago', rejectionComment: 'Rejected because the resume did not show enough direct experience with the core frontend stack and lacked evidence of recent hands-on product delivery.' },
  { id: 202, ranking: 3.7, applicantName: 'Patricia Martinez', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '1 week ago', rejectionComment: 'Rejected after review showed limited alignment with the technical depth required for the role and minimal examples of large-scale engineering ownership.' },
  { id: 203, ranking: 3.5, applicantName: 'James Anderson', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '3 days ago', rejectionComment: 'Rejected because the resume highlighted general experience, but did not provide strong signals around the specific tools and collaboration patterns needed here.' },
  { id: 204, ranking: 2.9, applicantName: 'Lisa Thomas', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '5 days ago', rejectionComment: 'Rejected due to a weak match with the role requirements, especially around system design exposure and recent engineering impact.' },
  { id: 205, ranking: 2.6, applicantName: 'Robert Jackson', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '1 day ago', rejectionComment: 'Rejected because the background appears better suited to a different type of position and did not demonstrate the experience level expected for this opening.' },
  { id: 206, ranking: 2.2, applicantName: 'Angela White', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '4 days ago', rejectionComment: 'Rejected after comparing the resume against the target role criteria, with gaps found in both technical relevance and demonstrated leadership scope.' },
]

const initialArchivedResumes: ResumeItem[] = [
  { id: 301, ranking: 8.4, applicantName: 'Olivia Bennett', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '2 weeks ago', archiveComment: 'Archived after final review because the role was filled before moving this candidate forward, though the profile remains strong for future openings.' },
  { id: 302, ranking: 8.1, applicantName: 'Marcus Reed', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '3 weeks ago', archiveComment: 'Archived to keep the pipeline organized after the hiring timeline changed. The resume remains worth revisiting if a similar position opens again.' },
  { id: 303, ranking: 7.9, applicantName: 'Priya Shah', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '1 month ago', archiveComment: 'Archived because the current team needs shifted, not because of a weak application. The candidate showed several strengths that may fit a later role.' },
  { id: 304, ranking: 7.7, applicantName: 'Ryan Cooper', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '1 month ago', archiveComment: 'Archived after the application aged out of the active pipeline. The background is still relevant enough to retain for future review.' },
  { id: 305, ranking: 7.5, applicantName: 'Emma Flores', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '5 weeks ago', archiveComment: 'Archived as part of a hiring cycle cleanup after priorities changed, with the candidate kept on file for possible follow-up later.' },
  { id: 306, ranking: 7.3, applicantName: 'Jason Miller', positionAppliedFor: 'Senior Software Engineer', dateSubmitted: '6 weeks ago', archiveComment: 'Archived because the opening moved in a different direction, but the resume still showed enough value to preserve in the archive rather than reject.' },
]

export const useResumeStore = () => {
  const allResumes = useState<ResumeItem[]>('resume-all', () => structuredClone(initialAllResumes))
  const acceptedResumes = useState<ResumeItem[]>('resume-accepted', () => structuredClone(initialAcceptedResumes))
  const rejectedResumes = useState<ResumeItem[]>('resume-rejected', () => structuredClone(initialRejectedResumes))
  const archivedResumes = useState<ResumeItem[]>('resume-archived', () => structuredClone(initialArchivedResumes))

  const moveResumeToBucket = (resumeId: number, decision: ResumeDecision, comment: string) => {
    const resume = allResumes.value.find((item) => item.id === resumeId)

    if (!resume) {
      return false
    }

    const updatedResume: ResumeItem = {
      ...resume,
      acceptanceComment: undefined,
      rejectionComment: undefined,
      archiveComment: undefined,
    }

    if (decision === 'accept') {
      updatedResume.acceptanceComment = comment
      acceptedResumes.value = [updatedResume, ...acceptedResumes.value]
    }

    if (decision === 'reject') {
      updatedResume.rejectionComment = comment
      rejectedResumes.value = [updatedResume, ...rejectedResumes.value]
    }

    if (decision === 'archive') {
      updatedResume.archiveComment = comment
      archivedResumes.value = [updatedResume, ...archivedResumes.value]
    }

    allResumes.value = allResumes.value.filter((item) => item.id !== resumeId)
    return true
  }

  return {
    allResumes,
    acceptedResumes,
    rejectedResumes,
    archivedResumes,
    moveResumeToBucket,
  }
}
