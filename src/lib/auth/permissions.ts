import { PRIVILEGED_ROLES, hasPrivilegedAccess } from '@/features/auth/constants'
import type { PrivilegedRole } from '@/features/auth/constants'

export const ADMIN_ROLES = PRIVILEGED_ROLES
export type AdminRole = PrivilegedRole

export function canManageJobs(userRole: string | null | undefined): boolean {
  return hasPrivilegedAccess(userRole)
}
