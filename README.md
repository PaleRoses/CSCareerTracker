# Career Tracker

A job application tracking system built with Next.js and PostgreSQL (Supabase).

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

## Database Setup

The database is already configured on Supabase. The SQL files in `supabase/` document the schema:

```
supabase/01-schema.sql       # Tables, indexes, triggers
supabase/02-seed.sql         # Sample data
supabase/03-rls-policies.sql # Row-level security policies
supabase/04-queries.sql      # Query documentation
```

## Running the Application

Credentials are included in `.env.local`.

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run linter
```
