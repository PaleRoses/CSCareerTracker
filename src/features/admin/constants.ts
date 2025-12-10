import type { ChipVariant } from '@/design-system/components'
import type { UserStatus } from './types'

export const ADMIN_ROLES = ['admin', 'techno_warlord'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

export function isAdminRole(role: string | null | undefined): role is AdminRole {
  return !!role && ADMIN_ROLES.includes(role as AdminRole)
}

export const STATUS_VARIANTS: Record<UserStatus, ChipVariant> = {
  active: 'success',
  suspended: 'warning',
  disabled: 'error',
}

export const ROLE_VARIANTS: Record<string, ChipVariant> = {
  applicant: 'default',
  recruiter: 'primary',
  admin: 'secondary',
  techno_warlord: 'warning',
  unassigned: 'default',
}

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  disabled: 'Disabled',
}
