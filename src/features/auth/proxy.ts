import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth } from '@/features/auth/auth'
import { ROUTES, AUTH_CALLBACKS } from '@/config/routes'

const PUBLIC_ROUTES = [
  ROUTES.home,
  ROUTES.login,
  '/api/auth',
]

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

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (!session?.user) {
    const loginUrl = new URL(AUTH_CALLBACKS.UNAUTHENTICATED, request.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isOnboardingRoute(pathname)) {
    if (session.user.role) {
      return NextResponse.redirect(new URL(ROUTES.dashboard, request.nextUrl.origin))
    }
    return NextResponse.next()
  }

  if (!session.user.role) {
    return NextResponse.redirect(new URL(AUTH_CALLBACKS.NEEDS_ONBOARDING, request.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
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
