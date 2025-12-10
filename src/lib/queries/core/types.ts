export type DateRange = {
  from: string
  to: string
}

export type QueryResult<T> = {
  data: T[]
  total: number
  hasMore: boolean
}
