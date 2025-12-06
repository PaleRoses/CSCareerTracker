/**
 * Auth Constants
 *
 * Types and configuration for role management.
 * Separated from server actions to avoid "use server" export restrictions.
 */

import {
  TargetIcon,
  SearchIcon,
  SettingsIcon,
  BoltIcon,
} from '@/design-system/icons'

export type RoleOption = 'applicant' | 'recruiter' | 'admin' | 'techno_warlord'

export type SetRoleResult =
  | { success: true; role: RoleOption }
  | { success: false; error: string }

export type RoleIconId = 'target' | 'search' | 'settings' | 'bolt'

export const ROLE_ICONS: Record<RoleIconId, React.ComponentType<{ className?: string }>> = {
  target: TargetIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  bolt: BoltIcon,
}

export const ROLE_OPTIONS: Array<{
  value: RoleOption
  label: string
  description: string
  iconId: RoleIconId
}> = [
  {
    value: 'applicant',
    label: 'Applicant',
    description: 'Job seeker tracking applications and hunting for opportunities',
    iconId: 'target',
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    description: 'Talent scout posting jobs and reviewing candidates',
    iconId: 'search',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'System administrator with full access',
    iconId: 'settings',
  },
  {
    value: 'techno_warlord',
    label: 'Techno Warlord',
    description: 'Personal power user. Solo tracking. Maximum efficiency.',
    iconId: 'bolt',
  },
]
