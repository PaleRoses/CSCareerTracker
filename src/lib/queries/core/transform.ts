import { ApplicationSchema, type Application } from '@/features/applications/schemas/application.schema'
import { validateInDev } from '@/lib/validation-utils'

export const APPLICATION_SELECT_QUERY = `
  application_id,
  user_id,
  job_id,
  position_title,
  application_date,
  final_outcome,
  date_updated,
  metadata,
  created_at,
  updated_at,
  jobs (
    job_id,
    job_title,
    job_type,
    url,
    locations,
    companies (
      company_id,
      company_name,
      website
    )
  ),
  application_stages (
    app_stage_id,
    stage_id,
    started_at,
    ended_at,
    status,
    notes,
    stages (
      stage_id,
      stage_name,
      order_index,
      success_flag
    )
  )
` as const

export const APPLICATION_LIST_SELECT_QUERY = `
  application_id,
  position_title,
  application_date,
  final_outcome,
  date_updated,
  jobs (
    companies (
      company_id,
      company_name
    )
  ),
  application_stages (
    app_stage_id,
    status,
    stages (
      stage_name,
      order_index
    )
  )
` as const

export type RawApplicationRow = {
  application_id: string
  user_id: string
  job_id: string
  position_title: string
  application_date: string
  final_outcome: string | null
  date_updated: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  jobs: {
    job_id: string
    job_title: string
    job_type: string
    url: string | null
    locations: string[]
    companies: {
      company_id: string
      company_name: string
      website: string
    }
  } | null
  application_stages: Array<{
    app_stage_id: string
    stage_id: string
    started_at: string
    ended_at: string | null
    status: string
    notes: string | null
    stages: {
      stage_id: string
      stage_name: string
      order_index: number
      success_flag: string
    } | null
  }>
}

export function transformDbToApplication(row: Record<string, unknown>): Application {
  const appStages = (row.application_stages as Array<Record<string, unknown>>) || []
  const job = row.jobs as Record<string, unknown> | null
  const company = job?.companies as Record<string, unknown> | null

  const stages = appStages
    .sort((a, b) => {
      const stageA = a.stages as Record<string, unknown> | null
      const stageB = b.stages as Record<string, unknown> | null
      return ((stageA?.order_index as number) || 0) - ((stageB?.order_index as number) || 0)
    })
    .map((appStage) => {
      const stageInfo = appStage.stages as Record<string, unknown> | null
      return {
        id: appStage.app_stage_id as string,
        name: (stageInfo?.stage_name as string) || 'Unknown',
        status: appStage.status as Application['stages'][0]['status'],
        startedAt: (appStage.started_at as string) || new Date().toISOString(),
        completedAt: appStage.ended_at as string | undefined,
        notes: (appStage.notes as string) || undefined,
      }
    })

  const application: Application = {
    id: row.application_id as string,
    company: (company?.company_name as string) || 'Unknown Company',
    positionTitle: row.position_title as string,
    dateApplied: row.application_date as string,
    outcome: row.final_outcome as Application['outcome'],
    stages,
    metadata: {
      jobUrl: (job?.url as string) || '',
      location: (job?.locations as string[])?.[0] || '',
    },
    notes: [], // Notes now stored per-stage in application_stages
    userId: row.user_id as string,
    jobId: row.job_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }

  validateInDev(ApplicationSchema, application, 'Application')

  return application
}

export function extractCompanyName(row: Record<string, unknown>): string {
  const job = row.jobs as Record<string, unknown> | null
  const company = job?.companies as Record<string, unknown> | null
  return (company?.company_name as string) || 'Unknown Company'
}

export function extractCompanyId(row: Record<string, unknown>): string | null {
  const job = row.jobs as Record<string, unknown> | null
  const company = job?.companies as Record<string, unknown> | null
  return (company?.company_id as string) || null
}

export function extractCurrentStage(row: Record<string, unknown>): string | null {
  const stages = (row.application_stages as Array<Record<string, unknown>>) || []
  const current = stages.find((s) => s.status === 'inProgress')
  if (!current) return null

  const stageInfo = current.stages as Record<string, unknown> | null
  return (stageInfo?.stage_name as string) || null
}

type StageDataInput = {
  stages: Array<{ order_index: number; stage_name: string }> | { order_index: number; stage_name: string } | null
}

export function extractOrderIndex(stageData: StageDataInput): number {
  if (!stageData?.stages) return 0
  return Array.isArray(stageData.stages)
    ? (stageData.stages[0]?.order_index || 0)
    : stageData.stages.order_index
}

export function extractStageName(stageData: StageDataInput): string | null {
  if (!stageData?.stages) return null
  return Array.isArray(stageData.stages)
    ? stageData.stages[0]?.stage_name
    : stageData.stages.stage_name
}
