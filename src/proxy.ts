import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth } from '@/features/auth/auth'
import { ROUTES, AUTH_CALLBACKS } from '@/config/routes'

/**
 * Proxy for route protection and onboarding redirects
 *
 * Flow:
 * 1. Public routes (/, /login, /api/auth) - always allowed
 * 2. Onboarding routes (/select-role) - require auth, no role check
 * 3. Protected routes (/dashboard, /applications, etc.) - require auth AND role
 */

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  '/api/auth',
]

// Routes that require auth but NOT a role (onboarding flow)
const ONBOARDING_ROUTES = [
  '/select-role',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

function isOnboardingRoute(pathname: string): boolean {
  return ONBOARDING_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

export async function proxy(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname

  // 1. Public routes - always allowed
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // 2. Not authenticated - redirect to login
  if (!session?.user) {
    const loginUrl = new URL(AUTH_CALLBACKS.UNAUTHENTICATED, request.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Onboarding routes - allow authenticated users without role
  if (isOnboardingRoute(pathname)) {
    if (session.user.role) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.nextUrl.origin))
    }
    return NextResponse.next()
  }

  // 4. Protected routes - require role
  if (!session.user.role) {
    return NextResponse.redirect(new URL(AUTH_CALLBACKS.NEEDS_ONBOARDING, request.nextUrl.origin))
  }

  // 5. Authenticated with role - allow access
  return NextResponse.next()
}

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
