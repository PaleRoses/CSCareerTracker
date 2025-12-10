export interface Job {
  id: string
  companyId: string
  companyName: string
  title: string
  type: JobType
  locations: string[]
  url: string | null
  postedDate: string
  postedBy: string | null
  companyWebsite: string | null
  companySize: number | null
  isActive: boolean
}

export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'other'

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  'internship': 'Internship',
  'contract': 'Contract',
  'other': 'Other',
}

export interface JobFilters {
  companyId?: string
  type?: JobType
  search?: string
  limit?: number
  offset?: number
  includeArchived?: boolean
  postedBy?: string
}
