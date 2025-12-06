# Career Tracker (Next.js)

Next.js 16 App Router front-end with Google Sign-In via Auth.js/NextAuth v5, styled with MUI.

## Prerequisites
- Node 20+ and pnpm (or npm/yarn).
- `openssl` installed (for secret generation).

## Setup & Run
```bash
# from repo root or app directory
cd frontend/career-tracker-next

# create .env.local interactively (prompts for Google client values)
bash scripts/setup-auth-env.sh

# install and start
pnpm install
pnpm dev
# app at http://localhost:3000
```

## Auth Flow
- Root `/` renders the login card. Click **Continue with Google** to sign in.
- Successful login redirects to `/dashboard`, which is protected by middleware and server-side checks.
- User info (name/email) and a Sign out action appear in the top bar; sign-out returns you to `/`.

## Key Files
- `next.config.ts` — serverful build; React compiler enabled via `experimental.reactCompiler`.
- `src/auth.config.ts` — NextAuth config with Google provider, JWT sessions, and token-to-session mapping.
- `src/auth.ts` — exports `handlers`, `auth`, `signIn`, `signOut`.
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler wiring.
- `src/middleware.ts` — protects `/dashboard`.
- `src/app/layout.tsx` + `src/components/providers/AppProviders.tsx` — SessionProvider + theme wrapper.
- `src/components/features/auth/LoginForm.tsx` — login UI with Google button.
- `src/app/(portal)/dashboard/page.tsx` — protected dashboard.

## Notes
- No database adapter yet; sessions are JWT-based. Add a DB adapter later via `authConfig`.
- Ensure Google OAuth client is configured with callback URL `http://localhost:3000/api/auth/callback/google` for local development.
