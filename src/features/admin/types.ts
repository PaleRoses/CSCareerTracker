import type { RoleOption } from '@/features/auth/constants'

export type UserStatus = 'active' | 'suspended' | 'disabled'

export interface AdminUser {
  userId: string
  email: string
  fname: string
  lname: string
  role: RoleOption | null
  status: UserStatus
  signupDate: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  totalUsers: number
  usersByRole: Record<string, number>
  usersByStatus: Record<string, number>
  recentSignups: number
  activeUsersCount: number
}

export interface UserFilters {
  search?: string
  role?: RoleOption | 'all'
  status?: UserStatus | 'all'
  limit?: number
  offset?: number
}
