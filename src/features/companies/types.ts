export interface Company {
  id: string
  name: string
  website: string | null
  locations: string[]
  size: number | null
  description?: string | null
  industry?: string | null
  createdBy?: string | null
  jobCount?: number
  applicationCount?: number
}

export interface CompanyFilters {
  search?: string
  minSize?: number
  limit?: number
  offset?: number
}
