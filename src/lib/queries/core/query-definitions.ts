/**
 * SQL Query Definitions
 *
 * These are the SQL equivalents of Supabase SDK calls used in the app.
 * Used by the QueryPreview component to show queries in dev mode.
 */

export const QUERY_DEFINITIONS = {
  // ============================================================================
  // APPLICATIONS
  // ============================================================================

  'applications-list': `
SELECT
  a.application_id,
  a.position_title,
  a.application_date,
  a.final_outcome,
  a.date_updated,
  a.metadata,
  j.job_id,
  j.job_title,
  j.url,
  j.locations,
  c.company_id,
  c.company_name,
  c.website,
  ast.app_stage_id,
  ast.status,
  ast.started_at,
  ast.ended_at,
  s.stage_name,
  s.order_index
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1
ORDER BY a.application_date DESC`,

  'application-detail': `
SELECT
  a.*,
  j.*,
  c.*,
  ast.*,
  s.*
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.application_id = $1
  AND a.user_id = $2`,

  'application-timeline': `
SELECT
  a.application_id,
  a.application_date,
  a.position_title,
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
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.application_id = $1
  AND a.user_id = $2`,

  'application-exists': `
SELECT COUNT(*)
FROM applications
WHERE application_id = $1
  AND user_id = $2`,

  'applications-by-company': `
SELECT
  a.*,
  j.*,
  c.*,
  ast.*,
  s.*
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1
  AND a.job_id IN (
    SELECT job_id
    FROM jobs
    WHERE company_id = $2
  )
ORDER BY a.application_date DESC`,

  // ============================================================================
  // STATS & ANALYTICS
  // ============================================================================

  'dashboard-stats': `
SELECT
  a.application_id,
  a.position_title,
  a.final_outcome,
  a.date_updated,
  a.created_at,
  c.company_name,
  ast.status,
  s.stage_name,
  s.order_index
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1
ORDER BY a.created_at DESC`,

  'stale-applications': `
SELECT
  a.application_id,
  a.position_title,
  a.date_updated,
  c.company_name,
  ast.status,
  s.stage_name
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
JOIN application_stages ast ON a.application_id = ast.application_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1
  AND ast.status = 'inProgress'
  AND a.date_updated < NOW() - INTERVAL '$2 days'`,

  'overview-stats': `
SELECT
  a.application_id,
  a.final_outcome,
  ast.status
FROM applications a
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
WHERE a.user_id = $1`,

  'stage-distribution': `
SELECT
  a.application_id,
  a.final_outcome,
  ast.status,
  s.stage_name,
  s.order_index
FROM applications a
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.user_id = $1`,

  'time-in-stage': `
SELECT
  ast.started_at,
  ast.ended_at,
  s.stage_name
FROM application_stages ast
JOIN stages s ON ast.stage_id = s.stage_id
JOIN applications a ON ast.application_id = a.application_id
WHERE a.user_id = $1
  AND ast.started_at IS NOT NULL
  AND ast.ended_at IS NOT NULL`,

  'conversion-rates': `
SELECT
  ast.stage_id,
  ast.status,
  a.application_id
FROM application_stages ast
JOIN applications a ON ast.application_id = a.application_id
WHERE a.user_id = $1`,

  'reapplication-tracking': `
SELECT
  a.application_id,
  a.application_date,
  a.final_outcome,
  j.company_id,
  c.company_name
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
WHERE a.user_id = $1
ORDER BY a.application_date ASC`,

  'monthly-trends': `
SELECT
  application_date,
  final_outcome
FROM applications
WHERE user_id = $1
ORDER BY application_date ASC`,

  'offer-rate-by-company': `
SELECT
  a.final_outcome,
  j.company_id,
  c.company_id,
  c.company_name
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
WHERE a.user_id = $1`,

  'success-rate-by-role': `
SELECT
  position_title,
  final_outcome
FROM applications
WHERE user_id = $1`,

  'hidden-gems': `
SELECT
  a.application_id,
  a.application_date,
  a.final_outcome,
  j.company_id,
  c.company_id,
  c.company_name,
  ast.started_at,
  s.order_index
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id`,

  // ============================================================================
  // COMPANIES
  // ============================================================================

  'companies-list': `
SELECT
  company_id,
  company_name,
  website
FROM companies
ORDER BY company_name ASC`,

  'companies-with-stats': `
SELECT
  c.company_id,
  c.company_name,
  c.website,
  c.locations,
  c.size,
  COUNT(j.job_id) AS job_count
FROM companies c
LEFT JOIN jobs j ON c.company_id = j.company_id
GROUP BY c.company_id
ORDER BY c.company_name ASC`,

  'company-detail': `
SELECT
  c.company_id,
  c.company_name,
  c.website,
  c.locations,
  c.size,
  c.description,
  c.industry,
  COUNT(j.job_id) AS job_count
FROM companies c
LEFT JOIN jobs j ON c.company_id = j.company_id
WHERE c.company_id = $1
GROUP BY c.company_id`,

  // ============================================================================
  // JOBS
  // ============================================================================

  'jobs-list': `
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
ORDER BY j.posted_date DESC`,

  // ============================================================================
  // RECRUITER
  // ============================================================================

  'recruiter-candidates': `
SELECT
  a.application_id,
  a.position_title,
  a.application_date,
  a.final_outcome,
  u.email,
  u.fname,
  u.lname,
  j.job_id,
  j.posted_by,
  ast.app_stage_id,
  ast.status,
  ast.started_at,
  ast.ended_at,
  ast.notes,
  s.stage_name,
  s.order_index
FROM applications a
JOIN users u ON a.user_id = u.user_id
JOIN jobs j ON a.job_id = j.job_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id
WHERE j.posted_by = $1
ORDER BY a.application_date DESC`,

  'candidate-counts-by-stage': `
SELECT
  ast.stage_id,
  ast.status,
  s.stage_name,
  COUNT(*) AS count
FROM application_stages ast
JOIN applications a ON ast.application_id = a.application_id
JOIN jobs j ON a.job_id = j.job_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE j.posted_by = $1
  AND ast.ended_at IS NULL
GROUP BY ast.stage_id, ast.status, s.stage_name`,

  'recruiter-stats': `
SELECT
  j.job_id,
  j.is_active
FROM jobs
WHERE posted_by = $1;

-- Then:
SELECT
  a.application_id,
  a.final_outcome,
  a.application_date,
  ast.ended_at,
  s.stage_name
FROM applications a
JOIN application_stages ast ON a.application_id = ast.application_id
JOIN stages s ON ast.stage_id = s.stage_id
WHERE a.job_id IN (recruiter's job IDs)`,

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  'create-application': `
INSERT INTO applications (
  user_id,
  job_id,
  position_title,
  application_date,
  metadata
)
VALUES ($1, $2, $3, $4, $5)
RETURNING application_id
-- Note: Initial "Applied" stage auto-created by trigger`,

  'update-application': `
UPDATE applications
SET
  position_title = $1,
  application_date = $2,
  final_outcome = $3,
  metadata = $4,
  updated_at = NOW()
WHERE application_id = $5
  AND user_id = $6`,

  'delete-application': `
DELETE FROM applications
WHERE application_id = $1
-- Note: Stages deleted via ON DELETE CASCADE`,

  'update-stage': `
UPDATE application_stages
SET
  status = $1,
  ended_at = $2
WHERE app_stage_id = $3
  AND application_id = $4`,

  'advance-stage': `
UPDATE application_stages
SET
  status = 'successful',
  ended_at = NOW()
WHERE app_stage_id = $1;

-- Then:
INSERT INTO application_stages (
  application_id,
  stage_id,
  status,
  started_at
)
VALUES ($1, $2, 'inProgress', NOW())`,

  'withdraw-application': `
UPDATE application_stages
SET
  status = 'successful',
  ended_at = NOW()
WHERE application_id = $1
  AND status = 'inProgress';

-- Then:
INSERT INTO application_stages (
  application_id,
  stage_id,
  status,
  started_at,
  ended_at
)
VALUES (
  $1,
  (SELECT stage_id FROM stages WHERE stage_name = 'Withdrawn'),
  'successful',
  NOW(),
  NOW()
);

-- Then:
UPDATE applications
SET final_outcome = 'withdrawn'
WHERE application_id = $1`,

  'add-note': `
UPDATE application_stages
SET
  notes = $1,
  updated_at = NOW()
WHERE app_stage_id = $2
  AND application_id = $3`,

  // ============================================================================
  // AUTH
  // ============================================================================

  'sync-user': `
INSERT INTO users (
  user_id,
  email,
  fname,
  lname,
  password_hash,
  metadata
)
VALUES ($1, $2, $3, $4, 'oauth', $5)
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  fname = EXCLUDED.fname,
  lname = EXCLUDED.lname,
  metadata = EXCLUDED.metadata`,

  'get-user-role': `
SELECT role
FROM users
WHERE user_id = $1`,

  'set-user-role': `
UPDATE users
SET role = $1
WHERE user_id = $2`,

} as const

export type QueryName = keyof typeof QUERY_DEFINITIONS
