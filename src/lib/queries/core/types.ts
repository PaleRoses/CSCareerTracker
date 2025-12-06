export type ApplicationFilters = {
  companyId?: string
  companyName?: string
  positionTitle?: string
  dateFrom?: string
  dateTo?: string
  outcome?: 'pending' | 'offer' | 'rejected' | 'withdrawn'
  currentStage?: string
  limit?: number
  offset?: number
}

export type DateRange = {
  from: string
  to: string
}

export type QueryResult<T> = {
  data: T[]
  total: number
  hasMore: boolean
}

export type CompanyStats = {
  companyId: string
  companyName: string
  totalApplications: number
  offers: number
  rejections: number
  pending: number
  offerRate: number
  avgResponseDays: number | null
}

export type StageConversion = {
  fromStage: string
  toStage: string
  totalAttempts: number
  successes: number
  conversionRate: number
}

export type TimeInStage = {
  stageName: string
  avgDays: number
  minDays: number
  maxDays: number
  sampleSize: number
}

export type RoleStats = {
  rolePattern: string
  totalApplications: number
  offers: number
  rejections: number
  successRate: number
}

export type OverviewStats = {
  totalApplications: number
  offersReceived: number
  pendingApplications: number
  rejectedApplications: number
  withdrawnApplications: number
  responseRate: number
}

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

export type CalendarEvent = {
  id: string
  title: string
  description: string
  startDate: string
  endDate?: string
  location?: string
  type: 'interview' | 'follow_up' | 'deadline'
}

export type ReapplicationStats = {
  companyId: string
  companyName: string
  applicationCount: number
  firstApplicationDate: string
  lastApplicationDate: string
  successfulReapplication: boolean
  daysBetweenApplications: number
}

export type MonthlyStats = {
  month: string
  applications: number
  offers: number
  rejections: number
  withdrawn: number
  successRate: number
}

export type StageDropoff = {
  stageName: string
  reachedCount: number
  droppedCount: number
  dropoffRate: number
}

export type CompanyConsistency = {
  companyId: string
  companyName: string
  totalApplicationsAllUsers: number
  avgResponseDays: number
  responseVariance: number
  consistencyScore: number
}

export type HiddenGem = {
  companyId: string
  companyName: string
  totalApplications: number
  offerRate: number
  avgResponseDays: number
}

export type OfferAcceptance = {
  companyId: string
  companyName: string
  offersExtended: number
  offersAccepted: number
  acceptanceRate: number
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
