/**
 * Company types for the Companies feature
 */

export interface Company {
  id: string
  name: string
  website: string | null
  locations: string[]
  size: number | null
  jobCount?: number
  applicationCount?: number
}

export interface CompanyFilters {
  search?: string
  minSize?: number
  limit?: number
  offset?: number
}
