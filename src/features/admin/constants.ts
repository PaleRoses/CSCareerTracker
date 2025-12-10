/**
 * Admin Feature Constants
 *
 * Configuration and mappings for administrator functionality.
 */

import type { ChipVariant } from '@/design-system/components'
import type { UserStatus } from './types'

/**
 * Roles that have admin access
 */
export const ADMIN_ROLES = ['admin', 'techno_warlord'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

/**
 * Type guard to check if a role has admin access
 */
export function isAdminRole(role: string | null | undefined): role is AdminRole {
  return !!role && ADMIN_ROLES.includes(role as AdminRole)
}

/**
 * Chip variants for user status display
 */
export const STATUS_VARIANTS: Record<UserStatus, ChipVariant> = {
  active: 'success',
  suspended: 'warning',
  disabled: 'error',
}

/**
 * Chip variants for user role display
 */
export const ROLE_VARIANTS: Record<string, ChipVariant> = {
  applicant: 'default',
  recruiter: 'primary',
  admin: 'secondary',
  techno_warlord: 'warning',
  unassigned: 'default',
}

/**
 * Human-readable labels for audit action types
 */
export const ACTION_TYPE_LABELS: Record<string, string> = {
  user_role_change: 'Role Changed',
  user_status_change: 'Status Changed',
  user_delete: 'User Deleted',
  system_config_view: 'System Config Viewed',
}

/**
 * Human-readable status labels
 */
export const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  disabled: 'Disabled',
}
