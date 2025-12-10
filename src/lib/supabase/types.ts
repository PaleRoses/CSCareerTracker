export type DatabaseUser = {
  user_id: string
  email: string
  fname: string
  mname: string | null
  lname: string
  role: 'applicant' | 'recruiter' | 'admin' | 'techno_warlord'
  status: 'active' | 'suspended' | 'disabled'
  password_hash: string
  metadata: Record<string, unknown>
  signup_date: string
  created_at: string
  updated_at: string
}

export type DatabaseCompany = {
  company_id: string
  company_name: string
  website: string
  locations: string[]
  size: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type DatabaseJob = {
  job_id: string
  company_id: string
  job_title: string
  job_type: 'full-time' | 'part-time' | 'internship' | 'contract' | 'other'
  locations: string[]
  url: string
  posted_date: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type DatabaseStage = {
  stage_id: string
  stage_name: string
  order_index: number
  success_flag: 'true' | 'false'
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export type DatabaseApplication = {
  application_id: string
  user_id: string
  job_id: string
  application_date: string
  final_outcome: 'offer' | 'rejected'
  position_title: string
  date_updated: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type DatabaseApplicationStage = {
  app_stage_id: string
  application_id: string
  stage_id: string
  started_at: string
  ended_at: string | null
  status: 'inProgress' | 'rejected' | 'successful'
  notes: string
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export type DatabaseAggregatedStats = {
  agg_id: string
  scope_type: 'User' | 'Company' | 'Job' | 'Global'
  scope_id: string | null
  avg_time_to_offer: number
  total_offers: number
  total_applications: number
  avg_response_days: number
  avg_time_in_stage_days: number
  created_at: string
  updated_at: string
}

export type DatabaseReport = {
  report_id: string
  user_id: string
  report_name: string
  report_type: 'csv' | 'calendar' | 'analytics' | 'custom'
  parameters: Record<string, unknown>
  generated_at: string
  file_url: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type DatabaseJobWithCompany = DatabaseJob & {
  companies: DatabaseCompany | null
}

export type DatabaseApplicationWithRelations = DatabaseApplication & {
  jobs: DatabaseJobWithCompany | null
  application_stages: Array<
    DatabaseApplicationStage & {
      stages: DatabaseStage | null
    }
  >
}

export type DatabaseApplicationStageWithInfo = DatabaseApplicationStage & {
  stages: DatabaseStage | null
}

export type InsertUser = Omit<
  DatabaseUser,
  'user_id' | 'created_at' | 'updated_at' | 'signup_date'
> & {
  user_id?: string
}

export type UpdateUser = Partial<
  Omit<DatabaseUser, 'user_id' | 'email' | 'created_at'>
>

export type InsertCompany = Omit<
  DatabaseCompany,
  'company_id' | 'created_at' | 'updated_at'
>

export type InsertJob = Omit<
  DatabaseJob,
  'job_id' | 'created_at' | 'updated_at'
>

export type InsertApplication = Omit<
  DatabaseApplication,
  'application_id' | 'created_at' | 'updated_at' | 'date_updated'
>

export type UpdateApplication = Partial<
  Omit<DatabaseApplication, 'application_id' | 'user_id' | 'job_id' | 'created_at'>
>

export type InsertApplicationStage = Omit<
  DatabaseApplicationStage,
  'app_stage_id' | 'created_at' | 'updated_at'
>

export type UpdateApplicationStage = Partial<
  Omit<DatabaseApplicationStage, 'app_stage_id' | 'application_id' | 'stage_id' | 'created_at'>
>

export type FinalOutcome = DatabaseApplication['final_outcome']
export type StageStatus = DatabaseApplicationStage['status']
export type JobType = DatabaseJob['job_type']
export type UserRole = DatabaseUser['role']
export type UserStatus = DatabaseUser['status']
export type ScopeType = DatabaseAggregatedStats['scope_type']
export type SuccessFlag = DatabaseStage['success_flag']
export type ReportType = DatabaseReport['report_type']

export type InsertReport = Omit<
  DatabaseReport,
  'report_id' | 'created_at' | 'updated_at' | 'generated_at'
>
