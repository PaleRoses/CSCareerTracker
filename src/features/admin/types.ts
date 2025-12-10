/**
 * Admin Feature Types
 *
 * Type definitions for administrator functionality including
 * user management and system oversight.
 */

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

export interface AuditLogEntry {
  logId: string
  adminUserId: string
  adminUserName: string
  actionType: AuditActionType
  targetUserId?: string
  targetUserName?: string
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
  createdAt: string
}

export type AuditActionType =
  | 'user_role_change'
  | 'user_status_change'
  | 'user_delete'
  | 'system_config_view'
