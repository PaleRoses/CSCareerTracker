/**
 * Dashboard feature types
 */

export type StageDistribution = {
  stage: string
  count: number
}

export type StaleApplication = {
  id: string
  company: string
  positionTitle: string
  daysSinceUpdate: number
  currentStage: string
}

export type ActivityItem = {
  id: string
  type: 'application_created' | 'stage_updated' | 'offer_received' | 'rejection' | 'withdrawal'
  company: string
  position: string
  date: string
  description: string
}

export type DashboardStats = {
  totalApplications: number
  offersReceived: number
  pendingApplications: number
  rejectedApplications: number
  responseRate: number
  stageDistribution: StageDistribution[]
  staleApplications: StaleApplication[]
  recentActivity: ActivityItem[]
}
