# Career Tracker Database - SQL Documentation

## Overview

This directory contains all SQL code for the Career Tracker application database. The database is designed to track job applications through their lifecycle stages, supporting both applicants and recruiters.

**Database System:** PostgreSQL 15+ (via Supabase)


## File Descriptions

| File | Purpose | Execution Order |
|------|---------|-----------------|
| `01-schema.sql` | CREATE statements for all tables, indexes, triggers, and functions | 1st |
| `02-seed.sql` | Sample data for testing and demonstration | 2nd |
| `03-rls-policies.sql` | Row Level Security policies (PostgreSQL/Supabase specific) | 3rd |
| `04-queries.sql` | Reference documentation of all SQL queries used by the application | Reference only |
| `complete-database.sql` | Combined single file containing schema + seed data | Alternative to 1+2 |

## Tables

### 1. USERS
Stores user accounts for applicants, recruiters, and administrators.

| Column | Type | Description |
|--------|------|-------------|
| user_id | TEXT | Primary key (supports OAuth IDs) |
| email | TEXT | Unique email address |
| fname, mname, lname | TEXT | Name fields |
| role | TEXT | 'applicant', 'recruiter', 'admin', 'techno_warlord' |
| status | TEXT | 'active', 'suspended', 'disabled' |
| password_hash | TEXT | Password or 'oauth' marker |
| metadata | JSONB | Extensible data storage |

### 2. COMPANIES
Company information for job listings.

| Column | Type | Description |
|--------|------|-------------|
| company_id | UUID | Primary key |
| company_name | TEXT | Company name |
| website | TEXT | Company URL |
| locations | TEXT[] | Array of office locations |
| size | INTEGER | Employee count |

### 3. JOBS
Job postings that users apply to.

| Column | Type | Description |
|--------|------|-------------|
| job_id | UUID | Primary key |
| company_id | UUID | FK to companies |
| job_title | TEXT | Position title |
| job_type | TEXT | 'full-time', 'part-time', 'internship', 'contract' |
| locations | TEXT[] | Job locations |
| posted_by | TEXT | FK to users (recruiter) |
| is_active | BOOLEAN | Soft delete flag |

### 4. STAGES
Master list of pipeline stages.

| Column | Type | Description |
|--------|------|-------------|
| stage_id | UUID | Primary key |
| stage_name | TEXT | 'Applied', 'OA', 'Phone Screen', 'Onsite/Virtual', 'Offer', 'Rejected', 'Withdrawn' |
| order_index | INTEGER | Stage ordering |
| success_flag | TEXT | 'true' for successful outcomes |

### 5. APPLICATIONS
User job applications linking users to jobs.

| Column | Type | Description |
|--------|------|-------------|
| application_id | UUID | Primary key |
| user_id | TEXT | FK to users |
| job_id | UUID | FK to jobs |
| position_title | TEXT | Applied position |
| application_date | DATE | When applied |
| final_outcome | TEXT | 'pending', 'offer', 'rejected', 'withdrawn' |
| offer_status | TEXT | NULL, 'pending', 'accepted', 'declined' |

### 6. APPLICATION_STAGES
Pipeline event history tracking stage progression.

| Column | Type | Description |
|--------|------|-------------|
| app_stage_id | UUID | Primary key |
| application_id | UUID | FK to applications |
| stage_id | UUID | FK to stages |
| started_at | TIMESTAMPTZ | Stage entry time |
| ended_at | TIMESTAMPTZ | Stage exit time (NULL if active) |
| status | TEXT | 'inProgress', 'successful', 'rejected' |
| notes | TEXT | User notes for this stage |
| updated_by | TEXT | FK to users (for recruiter updates) |

### 7. AGGREGATED_STATS
Pre-computed statistics for performance.

### 8. REPORTS
Saved report configurations.

## Key Business Rules

1. **Unique Application**: A user can only apply to each job once (enforced by UNIQUE constraint)
2. **One Active Stage**: Each application can have only one active stage at a time (partial unique index)
3. **Auto-Applied Stage**: Creating an application automatically creates an "Applied" stage (trigger)
4. **Terminal State Protection**: Cannot add new stages after rejection, withdrawal, or accepted offer (trigger)
5. **Offer Status Constraint**: offer_status is only valid when final_outcome = 'offer'

## How to Execute

### Option 1: Run Individual Files (Recommended for Understanding)

```bash
psql -h <host> -U <user> -d <database> -f 01-schema.sql
psql -h <host> -U <user> -d <database> -f 02-seed.sql
psql -h <host> -U <user> -d <database> -f 03-rls-policies.sql
```

### Option 2: Run Combined File

```bash
psql -h <host> -U <user> -d <database> -f complete-database.sql
```

### Option 3: Using Supabase Dashboard

1. Navigate to SQL Editor in Supabase Dashboard
2. Copy and paste file contents
3. Execute in order: schema → seed → rls-policies

## Sample Queries

### Get All Applications for a User
```sql
SELECT
  a.application_id,
  a.position_title,
  c.company_name,
  a.final_outcome
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
WHERE a.user_id = 'user-id-here'
ORDER BY a.application_date DESC;
```

### Get Pipeline Distribution
```sql
SELECT
  s.stage_name,
  COUNT(ast.app_stage_id) as count
FROM application_stages ast
JOIN stages s ON ast.stage_id = s.stage_id
JOIN applications a ON ast.application_id = a.application_id
WHERE a.user_id = 'user-id-here'
  AND ast.ended_at IS NULL
GROUP BY s.stage_name, s.order_index
ORDER BY s.order_index;
```

### Get Recruiter's Candidates
```sql
SELECT
  u.fname || ' ' || u.lname as candidate_name,
  a.position_title,
  s.stage_name as current_stage
FROM applications a
JOIN users u ON a.user_id = u.user_id
JOIN jobs j ON a.job_id = j.job_id
JOIN application_stages ast ON a.application_id = ast.application_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE j.posted_by = 'recruiter-user-id'
  AND ast.ended_at IS NULL;
```

## Triggers and Functions

### update_updated_at_column()
Automatically sets `updated_at` timestamp on row updates.

### get_user_id()
Returns the authenticated user ID from request headers (for RLS integration with NextAuth).

### create_initial_application_stage()
Automatically creates an "Applied" stage when a new application is inserted.

### check_terminal_state()
Prevents new stage entries when application is in a terminal state (rejected, withdrawn, or accepted offer).

## Notes

- All UUIDs are auto-generated using `uuid-ossp` extension
- Timestamps use `TIMESTAMPTZ` for timezone awareness
- The `metadata` JSONB columns allow extensible data storage
- Row Level Security (RLS) policies ensure data isolation between users
- Recruiters have special policies to view/manage applications for their posted jobs
