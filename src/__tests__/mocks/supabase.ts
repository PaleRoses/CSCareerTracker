/**
 * Supabase Client Mock
 *
 * Provides mock implementations for Supabase client operations.
 * Use vi.mocked() to configure specific responses in tests.
 */
import { vi } from 'vitest'

export type MockSupabaseResponse<T> = {
  data: T | null
  error: { message: string; code: string } | null
}

/**
 * Create a chainable mock query builder
 */
export function createMockQueryBuilder<T>(response: MockSupabaseResponse<T>) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(response),
    maybeSingle: vi.fn().mockResolvedValue(response),
    then: vi.fn((resolve) => resolve(response)),
  }
  return builder
}

/**
 * Create a mock Supabase client
 */
export function createMockSupabaseClient() {
  const defaultResponse: MockSupabaseResponse<null> = { data: null, error: null }

  return {
    from: vi.fn(() => createMockQueryBuilder(defaultResponse)),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
    rpc: vi.fn().mockResolvedValue(defaultResponse),
  }
}

/**
 * Mock for createUserClient
 */
export const mockCreateUserClient = vi.fn(() => createMockSupabaseClient())

/**
 * Mock for createCacheClient
 */
export const mockCreateCacheClient = vi.fn(() => createMockSupabaseClient())

// Default export for easy mocking
export default {
  createMockSupabaseClient,
  createMockQueryBuilder,
  mockCreateUserClient,
  mockCreateCacheClient,
}
