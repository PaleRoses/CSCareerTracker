/**
 * Recruiter feature types
 */

import type { Job, JobType } from '@/features/jobs/types'
import type { Stage, Outcome } from '@/features/applications/types'

/**
 * Candidate representation for recruiter view
 */
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

/**
 * Stage info for candidate timeline
 */
export interface CandidateStage {
  id: string
  name: string
  status: Stage['status']
  startedAt: string
  endedAt: string | null
  notes: string
  updatedBy: string | null
}

/**
 * Stats for recruiter dashboard
 */
export interface RecruiterStats {
  totalJobsPosted: number
  activeJobsCount: number
  totalCandidates: number
  candidatesByStage: Record<string, number>
  candidatesByOutcome: Record<string, number>
  recentApplications: number  // Last 7 days
}

/**
 * Job posting input for create/update
 */
export interface JobPostingInput {
  companyId?: string
  companyName?: string
  title: string
  type: JobType
  locations: string[]
  url?: string
}

/**
 * Recruiter's job with additional stats
 */
export interface RecruiterJob extends Job {
  candidateCount: number
  activeApplications: number
}
