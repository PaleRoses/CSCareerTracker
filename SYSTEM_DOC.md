# Career Tracker - System Documentation

## Overview

Career Tracker is a full-stack job application tracking system built with Next.js 16, TypeScript, and PostgreSQL via Supabase. It supports four user roles with different permissions enforced through Row-Level Security.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5 |
| Database | PostgreSQL via Supabase |
| Auth | NextAuth.js v5 with Google OAuth |
| UI | Material-UI v7 + Tailwind CSS v4 |
| Validation | Zod schemas |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router (pages & layouts)
│   ├── (portal)/          # Applicant routes (dashboard, applications, companies)
│   ├── (recruiter)/       # Recruiter routes (jobs, candidates)
│   ├── (admin)/           # Admin routes (users management)
│   └── (onboarding)/      # Role selection after first login
├── features/              # Domain modules (self-contained)
│   ├── applications/      # Job application CRUD & stage tracking
│   ├── recruiter/         # Job posting & candidate management
│   ├── admin/             # User management
│   ├── auth/              # Authentication & roles
│   ├── dashboard/         # Stats & overview
│   ├── reports/           # Analytics & exports
│   ├── companies/         # Company directory
│   ├── jobs/              # Job listings
│   └── shared/            # Cross-cutting components
├── lib/                   # Core utilities
│   ├── supabase/          # Database clients (RLS-aware)
│   ├── queries/core/      # Caching & query helpers
│   └── actions/           # Server action utilities
└── design-system/         # UI component library
    ├── components/        # Primitives, inputs, surfaces, feedback
    ├── tokens.ts          # Design tokens (colors, spacing, etc.)
    └── icons/             # MUI icon re-exports
```

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts with role (applicant/recruiter/admin/techno_warlord) |
| `companies` | Company directory |
| `jobs` | Job postings (linked to company, posted by recruiter) |
| `applications` | User's job applications (linked to job) |
| `application_stages` | Pipeline stages (Applied→OA→Phone→Onsite→Offer) |
| `stages` | Master stage definitions |

### Relationships

```
users ──┬── applications ──── jobs ──── companies
        │        │
        │        └── application_stages ──── stages
        │
        └── jobs (posted_by)
```

### Row-Level Security (RLS)

- Users see only their own applications
- Recruiters see candidates for jobs they posted
- Companies and jobs are public read
- Admin bypasses via service role key

---

## Authentication Flow

1. User clicks "Sign in with Google"
2. NextAuth handles OAuth callback
3. `syncUserToSupabase()` creates/updates user record
4. If no role set → redirect to `/select-role`
5. Role stored in JWT, available via `session.user.role`

### User Roles & Access

| Role | Portal | Recruiter | Admin |
|------|--------|-----------|-------|
| applicant | ✓ | ✗ | ✗ |
| recruiter | ✓ | ✓ | ✗ |
| admin | ✓ | ✓ | ✓ |
| techno_warlord | ✓ | ✓ | ✓ + stage actions |

---

## Data Patterns

### Query Pattern (Server-Side Cached)

```typescript
// features/applications/queries/list.ts
export const getApplications = unstable_cache(
  async (userId) => {
    const supabase = createCacheClient()
    return supabase.from('applications').select('*').eq('user_id', userId)
  },
  ['applications'],
  { revalidate: 60, tags: ['APPLICATIONS'] }
)
```

### Server Action Pattern

```typescript
// features/applications/actions/create-application.action.ts
'use server'
export async function createApplicationAction(formData: FormData) {
  // 1. Validate with Zod schema
  const parsed = CreateApplicationSchema.safeParse(Object.fromEntries(formData))

  // 2. Check auth
  const { context, error } = await requireActionAuth()
  if (error) return error

  // 3. Resolve company (find or create)
  const company = await resolveCompany(supabase, { companyName })

  // 4. Insert job + application
  const { data } = await supabase.from('applications').insert(...)

  // 5. Invalidate caches
  invalidateApplicationCaches()

  // 6. Return ActionState<T>
  return { success: true, data: { applicationId } }
}
```

### Form Component Pattern

```typescript
// Client component with server action
'use client'
const { state, formAction, isPending, getFieldError } = useFormAction(serverAction)

<form action={formAction}>
  <TextField {...getFieldError('fieldName')} />
  <FormActionButtons isPending={isPending} />
</form>
```

---

## Design System

### Token Categories

- **Colors**: Primary (cyan), Secondary (purple), Success, Warning, Error
- **Typography**: Inter (sans), Fira Code (mono)
- **Spacing**: 0-12 scale (rem units)
- **Effects**: Glassmorphism (backdrop blur + transparency)

### Component Categories

| Category | Components |
|----------|------------|
| Primitives | Box, Stack, Flex, Text, Heading |
| Inputs | Button, TextField, Autocomplete |
| Surfaces | Card (glass effect), Dialog, Paper |
| Feedback | Chip, Badge, Stepper, Skeleton |
| Data | DataTable (MUI DataGrid), BarChart |
| Layout | Grid, Drawer, AppBar |

### Styling Layers

1. **CSS Variables** (`--color-primary`) - Design tokens
2. **Tailwind Classes** - Layout & utilities
3. **MUI Theme** - Component defaults
4. **sx Prop** - Dynamic/conditional styles

---

## Key Files Reference

### Entry Points
- `src/app/layout.tsx` - Root layout with providers
- `src/app/(portal)/layout.tsx` - Protected layout with AppShell
- `src/features/auth/auth.ts` - NextAuth configuration

### Core Patterns
- `src/lib/supabase/server.ts` - Database client factories
- `src/lib/actions/error-utils.ts` - ActionState type & helpers
- `src/features/shared/hooks/useFormAction.ts` - Form submission hook

### Main Components
- `src/features/shared/components/AppShell.tsx` - Page wrapper
- `src/features/applications/components/ApplicationsTable.tsx` - Main data table
- `src/features/applications/components/StageTimeline.tsx` - Stage visualization

### Database
- `supabase/01-schema.sql` - Table definitions
- `supabase/02-triggers.sql` - Auto-timestamps, stage creation
- `supabase/03-rls-policies.sql` - Row-level security policies
