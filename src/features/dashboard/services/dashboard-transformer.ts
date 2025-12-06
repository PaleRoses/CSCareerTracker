import type {
  DashboardStats,
  StageDistribution,
  StaleApplication,
} from '@/lib/queries'

export interface TransformedStats {
  totalApplications: number
  offersReceived: number
  pendingCount: number
  responseRate: string
}

export interface TransformedStageItem {
  stage: string
  value: number
}

export interface TransformedStaleApplication {
  id: string
  company: string
  stage: string
  days: number
}

export interface TransformedChartData {
  label: string
  value: number
}

export interface TransformedDashboardData {
  stats: TransformedStats
  stageDistribution: TransformedStageItem[]
  staleApplications: TransformedStaleApplication[]
}

export function transformStats(raw: DashboardStats): TransformedStats {
  return {
    totalApplications: raw.totalApplications,
    offersReceived: raw.offersReceived,
    pendingCount: raw.pendingApplications,
    responseRate: `${raw.responseRate}%`,
  }
}

export function transformStageDistribution(
  distribution: StageDistribution[]
): TransformedStageItem[] {
  return distribution.map((item) => ({
    stage: item.stage,
    value: item.count,
  }))
}

export function transformStaleApplications(
  applications: StaleApplication[]
): TransformedStaleApplication[] {
  return applications.map((app) => ({
    id: app.id,
    company: app.company,
    stage: app.currentStage,
    days: app.daysSinceUpdate,
  }))
}

export function transformToChartData(
  distribution: TransformedStageItem[]
): TransformedChartData[] {
  return distribution.map((item) => ({
    label: item.stage,
    value: item.value,
  }))
}

export function transformDashboardData(
  raw: DashboardStats
): TransformedDashboardData {
  return {
    stats: transformStats(raw),
    stageDistribution: transformStageDistribution(raw.stageDistribution),
    staleApplications: transformStaleApplications(raw.staleApplications),
  }
}
