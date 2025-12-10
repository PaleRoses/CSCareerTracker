-- =============================================================================
-- Career Tracker - SQL Query Documentation
-- =============================================================================
-- These are the SQL equivalents of Supabase SDK calls in the codebase.
-- PostgREST generates similar queries from the SDK's fluent API.
-- =============================================================================

-- =============================================================================
-- READ QUERIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- GET APPLICATIONS LIST (with joins)
-- Source: src/lib/queries/applications/list.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.user_id,
  a.job_id,
  a.position_title,
  a.application_date,
  a.final_outcome,
  a.date_updated,
  a.metadata,
  a.created_at,
  a.updated_at,
  j.job_id,
  j.job_title,
  j.job_type,
  j.url,
  j.locations,
  c.company_id,
  c.company_name,
  c.website,
  ast.app_stage_id,
  ast.stage_id,
  ast.started_at,
  ast.ended_at,
  ast.status,
  ast.notes,
  s.stage_id,
  s.stage_name,
  s.order_index,
  s.success_flag
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1
ORDER BY a.application_date DESC;

-- With filters:
-- WHERE a.user_id = $1
--   AND a.application_date >= $2        -- dateFrom filter
--   AND a.application_date <= $3        -- dateTo filter
--   AND a.final_outcome = $4            -- outcome filter
--   AND a.position_title ILIKE '%$5%'   -- positionTitle filter
-- LIMIT $6 OFFSET $7;

-- -----------------------------------------------------------------------------
-- GET SINGLE APPLICATION (detail view)
-- Source: src/lib/queries/applications/detail.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.user_id,
  a.job_id,
  a.position_title,
  a.application_date,
  a.final_outcome,
  a.date_updated,
  a.metadata,
  a.created_at,
  a.updated_at,
  j.job_id,
  j.job_title,
  j.job_type,
  j.url,
  j.locations,
  c.company_id,
  c.company_name,
  c.website,
  ast.app_stage_id,
  ast.stage_id,
  ast.started_at,
  ast.ended_at,
  ast.status,
  ast.notes,
  s.stage_id,
  s.stage_name,
  s.order_index,
  s.success_flag
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.application_id = $1
  AND a.user_id = $2;

-- -----------------------------------------------------------------------------
-- CHECK APPLICATION EXISTS
-- Source: src/lib/queries/applications/detail.ts
-- -----------------------------------------------------------------------------
SELECT COUNT(*)
FROM applications
WHERE application_id = $1
  AND user_id = $2;

-- -----------------------------------------------------------------------------
-- GET APPLICATION TIMELINE
-- Source: src/lib/queries/applications/timeline.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.application_date,
  a.position_title,
  a.user_id,
  c.company_name,
  ast.started_at,
  ast.ended_at,
  ast.status,
  ast.notes,
  s.stage_name,
  s.order_index
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
JOIN application_stages ast ON a.application_id = ast.application_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.application_id = $1
  AND a.user_id = $2;

-- -----------------------------------------------------------------------------
-- GET DASHBOARD STATS
-- Source: src/lib/queries/stats/dashboard.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.position_title,
  a.final_outcome,
  a.date_updated,
  a.created_at,
  j.job_id,
  c.company_name,
  ast.app_stage_id,
  ast.status,
  s.stage_name,
  s.order_index
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1
ORDER BY a.created_at DESC;

-- -----------------------------------------------------------------------------
-- GET STALE APPLICATIONS (no updates in X days)
-- Source: src/lib/queries/stats/stale.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.position_title,
  a.date_updated,
  a.created_at,
  c.company_name,
  ast.status,
  s.stage_name,
  s.order_index
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
JOIN application_stages ast ON a.application_id = ast.application_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1
  AND ast.status = 'inProgress'
  AND (a.date_updated < NOW() - INTERVAL '$2 days'
       OR (a.date_updated IS NULL AND a.created_at < NOW() - INTERVAL '$2 days'));

-- -----------------------------------------------------------------------------
-- GET COMPANIES LIST
-- Source: src/lib/queries/applications/companies.ts
-- -----------------------------------------------------------------------------
SELECT company_id, company_name, website
FROM companies
ORDER BY company_name ASC;

-- -----------------------------------------------------------------------------
-- GET COMPANIES WITH JOB COUNTS
-- Source: src/features/companies/queries/get-companies-with-stats.ts
-- -----------------------------------------------------------------------------
SELECT
  c.company_id,
  c.company_name,
  c.website,
  c.locations,
  c.size,
  COUNT(j.job_id) as job_count
FROM companies c
LEFT JOIN jobs j ON c.company_id = j.company_id
GROUP BY c.company_id
ORDER BY c.company_name ASC;


-- =============================================================================
-- WRITE QUERIES (MUTATIONS)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- CREATE APPLICATION
-- Source: src/features/applications/actions/create-application.action.ts
-- -----------------------------------------------------------------------------

-- Step 1: Upsert user (for OAuth users)
INSERT INTO users (user_id, email, fname, lname, password_hash)
VALUES ($1, $2, $3, $4, 'oauth')
ON CONFLICT (user_id) DO NOTHING;

-- Step 2: Find or create company
SELECT company_id FROM companies
WHERE company_name ILIKE $1
LIMIT 1;

-- If not found:
INSERT INTO companies (company_name, website)
VALUES ($1, '')
RETURNING company_id;

-- Step 3: Create job
INSERT INTO jobs (company_id, job_title, url, locations)
VALUES ($1, $2, $3, $4)
RETURNING job_id;

-- Step 4: Create application
INSERT INTO applications (user_id, job_id, position_title, application_date, metadata)
VALUES ($1, $2, $3, $4, $5)
RETURNING application_id;

-- Note: Initial "Applied" stage is auto-created by trigger (see schema.sql)

-- -----------------------------------------------------------------------------
-- UPDATE STAGE STATUS
-- Source: src/features/applications/actions/update-stage.action.ts
-- -----------------------------------------------------------------------------
UPDATE application_stages
SET status = $1,
    ended_at = $2
WHERE app_stage_id = $3
  AND application_id = $4;

-- If rejected, also update application:
UPDATE applications
SET final_outcome = 'rejected'
WHERE application_id = $1;

-- -----------------------------------------------------------------------------
-- ADVANCE TO NEXT STAGE
-- Source: src/features/applications/actions/update-stage.action.ts
-- -----------------------------------------------------------------------------

-- Get current stage info
SELECT
  ast.app_stage_id,
  ast.stage_id,
  s.stage_id,
  s.stage_name,
  s.order_index,
  s.success_flag
FROM application_stages ast
JOIN stages s ON ast.stage_id = s.stage_id
WHERE ast.app_stage_id = $1
  AND ast.application_id = $2;

-- Mark current stage as successful
UPDATE application_stages
SET status = 'successful', ended_at = NOW()
WHERE app_stage_id = $1;

-- Find next stage
SELECT stage_id, stage_name, order_index, success_flag
FROM stages
WHERE order_index > $1
  AND stage_name NOT IN ('Rejected', 'Withdrawn')
ORDER BY order_index ASC
LIMIT 1;

-- Check if stage already exists for this application
SELECT app_stage_id
FROM application_stages
WHERE application_id = $1
  AND stage_id = $2;

-- Create new stage (if not exists)
INSERT INTO application_stages (application_id, stage_id, status, started_at, notes)
VALUES ($1, $2, 'inProgress', NOW(), '');

-- -----------------------------------------------------------------------------
-- WITHDRAW APPLICATION
-- Source: src/features/applications/actions/update-stage.action.ts
-- -----------------------------------------------------------------------------

-- End current active stage
UPDATE application_stages
SET status = 'successful', ended_at = NOW()
WHERE application_id = $1
  AND status = 'inProgress';

-- Get Withdrawn stage ID
SELECT stage_id FROM stages WHERE stage_name = 'Withdrawn';

-- Insert Withdrawn stage
INSERT INTO application_stages (application_id, stage_id, status, started_at, ended_at, notes)
VALUES ($1, $2, 'successful', NOW(), NOW(), '');

-- Update final outcome
UPDATE applications
SET final_outcome = 'withdrawn'
WHERE application_id = $1;

-- -----------------------------------------------------------------------------
-- ADD NOTE TO STAGE
-- Source: src/features/applications/actions/add-note.action.ts
-- -----------------------------------------------------------------------------

-- Get existing notes
SELECT notes
FROM application_stages
WHERE app_stage_id = $1
  AND application_id = $2;

-- Update notes
UPDATE application_stages
SET notes = $1, updated_at = NOW()
WHERE app_stage_id = $2
  AND application_id = $3;

-- -----------------------------------------------------------------------------
-- DELETE APPLICATION
-- Source: src/features/applications/actions/delete-application.action.ts
-- -----------------------------------------------------------------------------
DELETE FROM applications
WHERE application_id = $1;
-- Note: application_stages deleted via ON DELETE CASCADE

-- -----------------------------------------------------------------------------
-- TOUCH APPLICATION (update timestamp)
-- Source: src/lib/actions/supabase-utils.ts
-- -----------------------------------------------------------------------------
UPDATE applications
SET date_updated = NOW()
WHERE application_id = $1;


-- =============================================================================
-- UTILITY QUERIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- VERIFY APPLICATION OWNERSHIP
-- Source: src/lib/actions/supabase-utils.ts
-- -----------------------------------------------------------------------------
SELECT 1
FROM applications
WHERE application_id = $1
  AND user_id = $2;


-- =============================================================================
-- ANALYTICS QUERIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- GET REAPPLICATION TRACKING
-- Source: src/lib/queries/analytics/reapplication-tracking.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.application_date,
  a.final_outcome,
  j.company_id,
  c.company_id,
  c.company_name
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
WHERE a.user_id = $1
ORDER BY a.application_date ASC;

-- -----------------------------------------------------------------------------
-- GET OVERVIEW STATS
-- Source: src/lib/queries/stats/overview.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.final_outcome,
  ast.status
FROM applications a
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
WHERE a.user_id = $1;

-- -----------------------------------------------------------------------------
-- GET AVERAGE TIME IN STAGE
-- Source: src/lib/queries/stats/time-in-stage.ts
-- -----------------------------------------------------------------------------
SELECT
  ast.started_at,
  ast.ended_at,
  s.stage_name
FROM application_stages ast
JOIN stages s ON ast.stage_id = s.stage_id
JOIN applications a ON ast.application_id = a.application_id
WHERE a.user_id = $1
  AND ast.started_at IS NOT NULL
  AND ast.ended_at IS NOT NULL;

-- -----------------------------------------------------------------------------
-- GET STAGE DISTRIBUTION
-- Source: src/lib/queries/stats/stage-distribution.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.final_outcome,
  ast.status,
  s.stage_name,
  s.order_index
FROM applications a
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1;

-- -----------------------------------------------------------------------------
-- GET CONVERSION RATES
-- Source: src/lib/queries/stats/conversion-rates.ts
-- -----------------------------------------------------------------------------

-- Get all stages
SELECT stage_id, stage_name, order_index
FROM stages
ORDER BY order_index ASC;

-- Get application stages for user
SELECT
  ast.stage_id,
  ast.status,
  a.application_id
FROM application_stages ast
JOIN applications a ON ast.application_id = a.application_id
WHERE a.user_id = $1;


-- =============================================================================
-- JOBS QUERIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- GET JOBS LIST
-- Source: src/lib/queries/jobs/list.ts
-- -----------------------------------------------------------------------------
SELECT
  j.job_id,
  j.job_title,
  j.job_type,
  j.locations,
  j.url,
  j.posted_date,
  j.posted_by,
  j.is_active,
  j.company_id,
  c.company_name,
  c.website,
  c.size
FROM jobs j
JOIN companies c ON j.company_id = c.company_id
WHERE j.is_active = true
ORDER BY j.posted_date DESC;

-- With filters:
-- WHERE j.is_active = $1
--   AND j.company_id = $2
--   AND j.job_type = $3
--   AND j.job_title ILIKE '%$4%'
--   AND j.posted_by = $5
-- LIMIT $6 OFFSET $7;


-- =============================================================================
-- COMPANIES QUERIES (ADDITIONAL)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- GET COMPANY DETAIL
-- Source: src/features/companies/queries/get-company-detail.ts
-- -----------------------------------------------------------------------------
SELECT
  c.company_id,
  c.company_name,
  c.website,
  c.locations,
  c.size,
  c.description,
  c.industry,
  COUNT(j.job_id) as job_count
FROM companies c
LEFT JOIN jobs j ON c.company_id = j.company_id
WHERE c.company_id = $1
GROUP BY c.company_id;

-- -----------------------------------------------------------------------------
-- GET APPLICATIONS BY COMPANY
-- Source: src/features/companies/queries/get-applications-by-company.ts
-- -----------------------------------------------------------------------------

-- Step 1: Get job IDs for company
SELECT job_id FROM jobs WHERE company_id = $1;

-- Step 2: Get applications for those jobs
SELECT
  a.application_id,
  a.user_id,
  a.job_id,
  a.position_title,
  a.application_date,
  a.final_outcome,
  -- (full APPLICATION_SELECT_QUERY join)
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1
  AND a.job_id IN ($2, $3, ...)  -- job IDs from step 1
ORDER BY a.application_date DESC;


-- =============================================================================
-- AUTH QUERIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SYNC USER TO SUPABASE (OAuth)
-- Source: src/features/auth/actions/sync-user.action.ts
-- -----------------------------------------------------------------------------
INSERT INTO users (user_id, email, fname, lname, password_hash, metadata)
VALUES ($1, $2, $3, $4, 'oauth', $5)
ON CONFLICT (user_id)
DO UPDATE SET
  email = EXCLUDED.email,
  fname = EXCLUDED.fname,
  lname = EXCLUDED.lname,
  metadata = EXCLUDED.metadata;

-- -----------------------------------------------------------------------------
-- CHECK USER PROFILE EXISTS
-- Source: src/features/auth/actions/sync-user.action.ts
-- -----------------------------------------------------------------------------
SELECT user_id
FROM users
WHERE user_id = $1;

-- -----------------------------------------------------------------------------
-- GET USER ROLE
-- Source: src/features/auth/actions/set-role.action.ts
-- -----------------------------------------------------------------------------
SELECT role
FROM users
WHERE user_id = $1;

-- -----------------------------------------------------------------------------
-- SET USER ROLE
-- Source: src/features/auth/actions/set-role.action.ts
-- -----------------------------------------------------------------------------

-- Check if user exists first
SELECT role FROM users WHERE user_id = $1;

-- If not exists, insert:
INSERT INTO users (user_id, email, fname, lname, role, password_hash)
VALUES ($1, $2, $3, $4, $5, 'oauth');

-- If exists, update:
UPDATE users
SET role = $1
WHERE user_id = $2;

-- -----------------------------------------------------------------------------
-- RESET USER ROLE
-- Source: src/features/auth/actions/set-role.action.ts
-- -----------------------------------------------------------------------------
UPDATE users
SET role = NULL
WHERE user_id = $1;


-- =============================================================================
-- RECRUITER QUERIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- GET CANDIDATES (for recruiter's jobs)
-- Source: src/lib/queries/recruiter/candidates.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.user_id,
  a.position_title,
  a.application_date,
  a.final_outcome,
  u.user_id,
  u.email,
  u.fname,
  u.lname,
  j.job_id,
  j.posted_by,
  ast.app_stage_id,
  ast.stage_id,
  ast.started_at,
  ast.ended_at,
  ast.status,
  ast.notes,
  ast.updated_by,
  s.stage_name,
  s.order_index
FROM applications a
JOIN users u ON a.user_id = u.user_id
JOIN jobs j ON a.job_id = j.job_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE j.posted_by = $1  -- recruiter's user_id
ORDER BY a.application_date DESC;

-- With filters:
-- AND a.job_id = $2           -- jobId filter
-- AND a.final_outcome = $3    -- outcome filter
-- LIMIT $4 OFFSET $5;

-- -----------------------------------------------------------------------------
-- GET CANDIDATE DETAIL
-- Source: src/lib/queries/recruiter/candidates.ts
-- -----------------------------------------------------------------------------
SELECT
  a.application_id,
  a.user_id,
  a.position_title,
  a.application_date,
  a.final_outcome,
  u.user_id,
  u.email,
  u.fname,
  u.lname,
  j.job_id,
  j.posted_by,
  ast.app_stage_id,
  ast.stage_id,
  ast.started_at,
  ast.ended_at,
  ast.status,
  ast.notes,
  ast.updated_by,
  s.stage_name,
  s.order_index
FROM applications a
JOIN users u ON a.user_id = u.user_id
JOIN jobs j ON a.job_id = j.job_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.application_id = $1
  AND j.posted_by = $2;

-- -----------------------------------------------------------------------------
-- GET CANDIDATE COUNTS BY STAGE
-- Source: src/lib/queries/recruiter/candidates.ts
-- -----------------------------------------------------------------------------
SELECT
  ast.stage_id,
  ast.status,
  s.stage_name
FROM application_stages ast
JOIN applications a ON ast.application_id = a.application_id
JOIN jobs j ON a.job_id = j.job_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE j.posted_by = $1
  AND ast.ended_at IS NULL;

-- -----------------------------------------------------------------------------
-- GET RECRUITER STATS
-- Source: src/lib/queries/recruiter/stats.ts
-- -----------------------------------------------------------------------------

-- Get recruiter's jobs
SELECT job_id, is_active
FROM jobs
WHERE posted_by = $1;

-- Get applications for recruiter's jobs
SELECT
  a.application_id,
  a.final_outcome,
  a.application_date,
  ast.ended_at,
  s.stage_name
FROM applications a
JOIN application_stages ast ON a.application_id = ast.application_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.job_id IN ($1, $2, ...);  -- recruiter's job IDs


-- =============================================================================
-- RECRUITER MUTATIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- UPDATE CANDIDATE STAGE (recruiter action)
-- Source: src/features/recruiter/actions/update-candidate-stage.action.ts
-- -----------------------------------------------------------------------------

-- Verify recruiter owns job
SELECT
  a.application_id,
  j.posted_by
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
WHERE a.application_id = $1;

-- Update stage status
UPDATE application_stages
SET status = $1,
    ended_at = NOW(),
    updated_by = $2,
    notes = $3
WHERE app_stage_id = $4;

-- If rejected, update application outcome
UPDATE applications
SET final_outcome = 'rejected'
WHERE application_id = $1;

-- -----------------------------------------------------------------------------
-- ADVANCE CANDIDATE TO NEXT STAGE (recruiter action)
-- Source: src/features/recruiter/actions/update-candidate-stage.action.ts
-- -----------------------------------------------------------------------------

-- Verify recruiter owns job
SELECT
  a.application_id,
  j.posted_by
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
WHERE a.application_id = $1;

-- Get next stage ID by name
SELECT stage_id
FROM stages
WHERE stage_name = $1;

-- Close current active stage
UPDATE application_stages
SET status = 'successful',
    ended_at = NOW(),
    updated_by = $1
WHERE application_id = $2
  AND ended_at IS NULL;

-- Create new stage entry
INSERT INTO application_stages (application_id, stage_id, started_at, status, notes, updated_by)
VALUES ($1, $2, NOW(), 'inProgress', $3, $4)
RETURNING app_stage_id;

-- If advancing to Offer, update outcome
UPDATE applications
SET final_outcome = 'offer'
WHERE application_id = $1;


-- =============================================================================
-- APPLICATION MUTATIONS (ADDITIONAL)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- UPDATE APPLICATION
-- Source: src/features/applications/actions/update-application.action.ts
-- -----------------------------------------------------------------------------

-- Fetch existing metadata (for merge)
SELECT metadata
FROM applications
WHERE application_id = $1
  AND user_id = $2;

-- Update application fields
UPDATE applications
SET position_title = $1,
    application_date = $2,
    final_outcome = $3,
    metadata = $4,
    updated_at = NOW()
WHERE application_id = $5
  AND user_id = $6;
