export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  selectRole: '/select-role',

  dashboard: '/dashboard',
  applications: '/applications',
  applicationDetail: (id: string) => `/applications/${id}` as const,
  jobBrowser: '/job-browser',
  companies: '/companies',
  companyDetail: (id: string) => `/companies/${id}` as const,
  reports: '/reports',

  recruiter: {
    dashboard: '/recruiter-dashboard',
    jobs: '/jobs',
    newJob: '/jobs/new',
    jobDetail: (id: string) => `/jobs/${id}` as const,
    candidates: (jobId: string) => `/jobs/${jobId}/candidates` as const,
    candidateDetail: (candidateId: string) => `/candidates/${candidateId}` as const,
  },

  admin: {
    dashboard: '/admin-dashboard',
    users: '/users',
    userDetail: (id: string) => `/users/${id}` as const,
  },

  // Legacy - prefer camelCase above
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SELECT_ROLE: '/select-role',
  DASHBOARD: '/dashboard',
  APPLICATIONS: '/applications',
  APPLICATION_DETAIL: (id: string) => `/applications/${id}` as const,
  JOB_BROWSER: '/job-browser',
  COMPANIES: '/companies',
  COMPANY_DETAIL: (id: string) => `/companies/${id}` as const,
  REPORTS: '/reports',
} as const

export const AUTH_CALLBACKS = {
  SIGN_IN_SUCCESS: ROUTES.DASHBOARD,
  SIGN_OUT_SUCCESS: ROUTES.HOME,
  UNAUTHENTICATED: ROUTES.HOME,
  NEEDS_ONBOARDING: ROUTES.SELECT_ROLE,
} as const

export type NavItemKind = 'link' | 'divider'

export interface NavLinkItem {
  kind: 'link'
  segment: string
  label: string
  href: string
  icon: 'DashboardIcon' | 'WorkIcon' | 'SearchIcon' | 'BusinessIcon' | 'AssessmentIcon' | 'PersonIcon' | 'SettingsIcon' | 'PeopleIcon'
}

export interface NavDividerItem {
  kind: 'divider'
}

export type NavItem = NavLinkItem | NavDividerItem

export const NAV_ITEMS: NavItem[] = [
  {
    kind: 'link',
    segment: 'dashboard',
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: 'DashboardIcon',
  },
  {
    kind: 'link',
    segment: 'applications',
    label: 'Applications',
    href: ROUTES.APPLICATIONS,
    icon: 'WorkIcon',
  },
  { kind: 'divider' },
  {
    kind: 'link',
    segment: 'job-browser',
    label: 'Job Browser',
    href: ROUTES.JOB_BROWSER,
    icon: 'SearchIcon',
  },
  {
    kind: 'link',
    segment: 'companies',
    label: 'Companies',
    href: ROUTES.COMPANIES,
    icon: 'BusinessIcon',
  },
  {
    kind: 'link',
    segment: 'reports',
    label: 'Reports',
    href: ROUTES.REPORTS,
    icon: 'AssessmentIcon',
  },
] as const

export const RECRUITER_NAV_ITEMS: NavItem[] = [
  { kind: 'divider' },
  {
    kind: 'link',
    segment: 'recruiter-dashboard',
    label: 'Recruiter Hub',
    href: '/recruiter-dashboard',
    icon: 'DashboardIcon',
  },
  {
    kind: 'link',
    segment: 'my-jobs',
    label: 'My Job Postings',
    href: '/jobs',
    icon: 'WorkIcon',
  },
  {
    kind: 'link',
    segment: 'all-candidates',
    label: 'All Candidates',
    href: '/candidates',
    icon: 'PersonIcon',
  },
] as const

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { kind: 'divider' },
  {
    kind: 'link',
    segment: 'admin-dashboard',
    label: 'Admin Hub',
    href: '/admin-dashboard',
    icon: 'SettingsIcon',
  },
  {
    kind: 'link',
    segment: 'users',
    label: 'User Management',
    href: '/users',
    icon: 'PeopleIcon',
  },
] as const

// Re-export for backward compatibility, prefer @/features/auth/constants
export { PRIVILEGED_ROLES as RECRUITER_ROLES } from '@/features/auth/constants'

// Admin roles for route guards
export const ADMIN_ROLES = ['admin', 'techno_warlord'] as const

export function isRouteActive(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`)
}
