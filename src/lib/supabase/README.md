# Supabase Database Setup

This directory contains the canonical database schema and setup files for the CS Career Tracker application.

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | Creates all tables, indexes, triggers, and constraints |
| `rls-policies.sql` | Enables Row Level Security and defines access policies |
| `seed.sql` | Populates the database with sample test data |
| `client.ts` | Browser-side Supabase client |
| `server.ts` | Server-side Supabase client (for Server Actions) |
| `middleware.ts` | Middleware client for session refresh |

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Configure:
   - **Name**: `career-tracker`
   - **Database Password**: Generate and save securely
   - **Region**: Choose closest to you
4. Wait ~2 minutes for provisioning

### 2. Get Credentials

1. Go to **Project Settings** > **API**
2. Copy these values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run SQL Scripts

In Supabase Dashboard, go to **SQL Editor** and run these scripts **in order**:

```bash
# 1. Create schema (tables, indexes, triggers)
# Copy-paste: schema.sql

# 2. Enable RLS and create policies
# Copy-paste: rls-policies.sql

# 3. (Optional) Insert sample data for testing
# Copy-paste: seed.sql
```

### 4. Verify Setup

Run these queries to verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';

-- Check stages were created
SELECT * FROM stages ORDER BY order_index;
```

## Schema Overview

```
profiles          ← User accounts (synced from NextAuth)
    │
    ├── applications    ← Job applications (user_id FK)
    │       │
    │       └── application_stages  ← Stage history (application_id FK)
    │               │
    │               └── stages      ← Master stage list (stage_id FK)
    │
companies         ← Company records
    │
    └── jobs            ← Job postings (company_id FK)

aggregated_stats  ← Pre-computed analytics (standalone)
```

## Hybrid Auth: NextAuth + Supabase

This app uses **NextAuth** for OAuth login and **Supabase** for data storage.

### How It Works

1. User logs in via NextAuth (Google OAuth)
2. NextAuth `jwt` callback syncs user to `profiles` table
3. Server Actions use NextAuth `session.user.id` for queries
4. Supabase RLS policies validate `user_id` ownership

### Key Points

- `profiles.id` matches `NextAuth user.id`
- Use **service role** client for server-side sync operations
- RLS policies check `auth.uid()` for client-side access

## Security Considerations

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- All client-side queries go through RLS
- Server Actions should validate ownership before mutations
- UUIDs prevent enumeration attacks

## Updating the Schema

For schema changes:

1. Create a migration file: `migrations/002_add_feature.sql`
2. Test in development first
3. Apply to production via SQL Editor
4. Update TypeScript types to match

## Troubleshooting

### "Permission denied" errors
- Check RLS policies are correctly applied
- Verify user is authenticated
- Check `auth.uid()` matches `user_id`

### "Relation does not exist" errors
- Run `schema.sql` first
- Check table names (case-sensitive)

### Seed data not visible
- Seed data uses hardcoded UUIDs
- Your NextAuth user has a different UUID
- Create applications through the UI instead
