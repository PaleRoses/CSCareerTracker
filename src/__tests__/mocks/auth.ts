/**
 * Auth Mock
 *
 * Mock implementations for NextAuth and auth utilities.
 */
import { vi } from 'vitest'

export type MockUser = {
  id: string
  email: string
  name: string
  role: 'applicant' | 'recruiter' | 'admin' | 'techno_warlord'
}

export type MockSession = {
  user: MockUser
  expires: string
}

/**
 * Default mock user
 */
export const mockUser: MockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'applicant',
}

/**
 * Default mock session
 */
export const mockSession: MockSession = {
  user: mockUser,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

/**
 * Create a mock session with custom user data
 */
export function createMockSession(overrides?: Partial<MockUser>): MockSession {
  return {
    user: { ...mockUser, ...overrides },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

/**
 * Mock auth() function
 */
export const mockAuth = vi.fn(() => Promise.resolve(mockSession))

/**
 * Set up auth mock to return authenticated session
 */
export function mockAuthenticatedUser(user?: Partial<MockUser>) {
  const session = createMockSession(user)
  mockAuth.mockResolvedValue(session)
  return session
}

/**
 * Set up auth mock to return unauthenticated (null session)
 */
export function mockUnauthenticated() {
  mockAuth.mockResolvedValue(null)
}

/**
 * Reset auth mock to default state
 */
export function resetAuthMock() {
  mockAuth.mockResolvedValue(mockSession)
}

export default {
  mockUser,
  mockSession,
  mockAuth,
  createMockSession,
  mockAuthenticatedUser,
  mockUnauthenticated,
  resetAuthMock,
}
