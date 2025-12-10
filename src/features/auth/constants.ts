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
  description?: string
  iconId: RoleIconId
}> = [
  {
    value: 'applicant',
    label: 'Applicant',
    iconId: 'target',
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    iconId: 'search',
  },
  {
    value: 'admin',
    label: 'Admin',
    iconId: 'settings',
  },
  {
    value: 'techno_warlord',
    label: 'TestPowerUser',
    iconId: 'bolt',
  },
]

export const PRIVILEGED_ROLES = ['recruiter', 'admin', 'techno_warlord'] as const
export type PrivilegedRole = (typeof PRIVILEGED_ROLES)[number]

export function hasPrivilegedAccess(
  role: string | null | undefined
): role is PrivilegedRole {
  return !!role && PRIVILEGED_ROLES.includes(role as PrivilegedRole)
}
