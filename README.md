# Career Tracker

A full-stack job application tracking system built with Next.js 16 and Supabase (PostgreSQL).

## Features

**For Applicants:**
- Track job applications through pipeline stages (Applied → OA → Phone Screen → Onsite → Offer)
- Add notes to each stage
- View dashboard with statistics and analytics
- Export data to CSV or calendar formats
- Browse available job listings

**For Recruiters:**
- Post and manage job listings
- View candidates who applied to your jobs
- Update candidate pipeline stages
- Dashboard with recruiter-specific stats

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **Authentication:** NextAuth.js v5 (Google OAuth)
- **Styling:** Tailwind CSS + MUI
- **Package Manager:** pnpm

## Prerequisites

- Node.js 20 or later
- pnpm (`npm install -g pnpm`)
- Supabase account (free tier available at https://supabase.com)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd frontend/career-tracker-next
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase Database

1. Create a new project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL files in order:
   ```
   supabase/schema.sql    # Creates tables, indexes, triggers
   supabase/seed.sql      # Adds sample data (optional)
   supabase/rls-policies.sql  # Enables row-level security
   ```

   Or use the combined file:
   ```
   sql-code/complete-database.sql
   ```

### 4. Configure Environment Variables

Option A - Use the setup script:
```bash
bash scripts/setup-auth-env.sh
```

Option B - Manual setup:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Get your Supabase keys from: Project Settings → API

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (portal)/          # Applicant routes (dashboard, applications, etc.)
│   ├── (recruiter)/       # Recruiter routes (job management, candidates)
│   └── api/               # API routes (NextAuth)
├── features/              # Feature-based modules
│   ├── applications/      # Application tracking
│   ├── auth/              # Authentication
│   ├── companies/         # Company management
│   ├── dashboard/         # Dashboard components
│   ├── jobs/              # Job listings
│   ├── recruiter/         # Recruiter features
│   └── reports/           # Analytics and reports
├── lib/                   # Shared utilities
│   ├── queries/           # Database query layer
│   └── supabase/          # Supabase client
├── design-system/         # UI component library
└── components/            # Shared components

supabase/                  # SQL files (source)
├── schema.sql            # Database schema
├── seed.sql              # Sample data
├── rls-policies.sql      # Security policies
└── queries.sql           # Query documentation

sql-code/                  # SQL documentation (submission-ready)
├── README.md             # SQL documentation
├── 01-schema.sql
├── 02-seed.sql
├── 03-rls-policies.sql
├── 04-queries.sql
└── complete-database.sql # Combined file
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Auth Flow

- Root `/` renders the login card. Click **Continue with Google** to sign in.
- Successful login redirects to `/select-role` for first-time users.
- Choose role (Applicant or Recruiter) to access the appropriate dashboard.
- User info and Sign Out appear in the sidebar.

## Database Schema

The database consists of 8 tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts (applicants, recruiters, admins) |
| `companies` | Company information |
| `jobs` | Job postings |
| `stages` | Master list of pipeline stages |
| `applications` | User job applications |
| `application_stages` | Pipeline history for each application |
| `aggregated_stats` | Pre-computed statistics |
| `reports` | Saved report configurations |

See `sql-code/README.md` for detailed schema documentation.

## User Roles

| Role | Description |
|------|-------------|
| `applicant` | Can track own job applications |
| `recruiter` | Can post jobs and manage candidates |
| `admin` | Full system access |
| `techno_warlord` | Admin with extra privileges |

## Key Files

- `next.config.ts` — Next.js configuration with React compiler
- `src/features/auth/auth.ts` — NextAuth config with Google provider
- `src/middleware.ts` — Route protection
- `supabase/` — All database SQL files

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project at https://vercel.com
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Build

```bash
pnpm build
pnpm start
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `NEXTAUTH_URL` | Yes | Application URL |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |

## Notes

- Google OAuth callback URL: `http://localhost:3000/api/auth/callback/google`
- Sessions are JWT-based with Supabase for data storage
- Row Level Security (RLS) ensures data isolation between users

## License

MIT
