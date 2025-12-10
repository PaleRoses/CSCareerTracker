import type { Job, JobType } from '@/features/jobs/types'
import type { Stage, Outcome } from '@/features/applications/types'

export interface Candidate {
  applicationId: string
  userId: string
  userName: string
  userEmail: string
  positionTitle: string
  applicationDate: string
  currentStage: string
  currentStageStatus: Stage['status']
  outcome: Outcome | 'pending'
  stages: CandidateStage[]
}

export interface CandidateStage {
  id: string
  name: string
  status: Stage['status']
  startedAt: string
  endedAt: string | null
  notes: string
  updatedBy: string | null
}

export interface RecruiterStats {
  totalJobsPosted: number
  activeJobsCount: number
  totalCandidates: number
  candidatesByStage: Record<string, number>
  candidatesByOutcome: Record<string, number>
  recentApplications: number
}

export interface JobPostingInput {
  companyId?: string
  companyName?: string
  title: string
  type: JobType
  locations: string[]
  url?: string
}

export interface RecruiterJob extends Job {
  candidateCount: number
  activeApplications: number
}
