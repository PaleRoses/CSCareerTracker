export const ADMIN_ROLES = ['admin', 'recruiter', 'techno_warlord'] as const;
export type AdminRole = typeof ADMIN_ROLES[number];

export function canManageJobs(userRole: string | null | undefined): boolean {
  return !!userRole && ADMIN_ROLES.includes(userRole as AdminRole);
}
