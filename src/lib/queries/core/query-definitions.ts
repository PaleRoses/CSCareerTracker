export const QUERY_DEFINITIONS = {
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

  'job-detail': `
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
WHERE j.job_id = $1
  AND j.posted_by = $2`,

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

  'create-application': `
INSERT INTO applications (
  user_id,
  job_id,
  position_title,
  application_date,
  metadata
)
VALUES ($1, $2, $3, $4, $5)
RETURNING application_id`,

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
WHERE application_id = $1`,

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

  'admin-stats': `
SELECT
  user_id,
  role,
  status,
  signup_date
FROM users`,

  'users-list': `
SELECT
  user_id,
  email,
  fname,
  lname,
  role,
  status,
  signup_date,
  created_at,
  updated_at
FROM users
WHERE ($1::text IS NULL OR role = $1)
  AND ($2::text IS NULL OR status = $2)
  AND (
    $3::text IS NULL
    OR email ILIKE '%' || $3 || '%'
    OR fname ILIKE '%' || $3 || '%'
    OR lname ILIKE '%' || $3 || '%'
  )
ORDER BY created_at DESC
LIMIT $4 OFFSET $5`,

  'user-detail': `
SELECT
  user_id,
  email,
  fname,
  lname,
  role,
  status,
  signup_date,
  created_at,
  updated_at
FROM users
WHERE user_id = $1`,

  'response-time': `
SELECT
  c.company_id,
  c.company_name,
  COUNT(a.application_id) AS applications,
  AVG(
    CASE
      WHEN ast.started_at IS NOT NULL
      THEN EXTRACT(DAY FROM ast.started_at - a.application_date)
    END
  ) AS avg_response_days,
  SUM(CASE WHEN a.final_outcome = 'offer' THEN 1 ELSE 0 END)::float
    / NULLIF(COUNT(a.application_id), 0) * 100 AS offer_rate
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id AND s.order_index = 2
WHERE a.user_id = $1
GROUP BY c.company_id, c.company_name
HAVING COUNT(a.application_id) >= 2
ORDER BY avg_response_days ASC`,

  'stage-dropoff': `
SELECT
  s.stage_name,
  s.order_index,
  COUNT(DISTINCT ast.application_id) AS reached,
  COUNT(DISTINCT CASE
    WHEN ast.status = 'rejected' OR (
      ast.ended_at IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM application_stages ast2
        JOIN stages s2 ON ast2.stage_id = s2.stage_id
        WHERE ast2.application_id = ast.application_id
        AND s2.order_index > s.order_index
      )
    )
    THEN ast.application_id
  END) AS dropped
FROM stages s
LEFT JOIN application_stages ast ON s.stage_id = ast.stage_id
LEFT JOIN applications a ON ast.application_id = a.application_id AND a.user_id = $1
GROUP BY s.stage_id, s.stage_name, s.order_index
ORDER BY s.order_index`,

  'reapplications': `
SELECT
  c.company_id,
  c.company_name,
  COUNT(a.application_id) AS application_count,
  MIN(a.application_date) AS first_application_date,
  MAX(a.application_date) AS last_application_date,
  EXTRACT(DAY FROM MAX(a.application_date) - MIN(a.application_date)) AS days_between,
  BOOL_OR(a.final_outcome = 'offer') AS successful
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
WHERE a.user_id = $1
GROUP BY c.company_id, c.company_name
HAVING COUNT(a.application_id) >= 2
ORDER BY application_count DESC`,

  'company-consistency': `
SELECT
  c.company_id,
  c.company_name,
  COUNT(a.application_id) AS total_applications,
  AVG(
    CASE
      WHEN ast.started_at IS NOT NULL
      THEN EXTRACT(DAY FROM ast.started_at - a.application_date)
    END
  ) AS avg_response_days,
  STDDEV(
    CASE
      WHEN ast.started_at IS NOT NULL
      THEN EXTRACT(DAY FROM ast.started_at - a.application_date)
    END
  ) AS response_variance,
  100 - COALESCE(
    STDDEV(
      CASE
        WHEN ast.started_at IS NOT NULL
        THEN EXTRACT(DAY FROM ast.started_at - a.application_date)
      END
    ) / NULLIF(AVG(
      CASE
        WHEN ast.started_at IS NOT NULL
        THEN EXTRACT(DAY FROM ast.started_at - a.application_date)
      END
    ), 0) * 100, 0
  ) AS consistency_score
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
LEFT JOIN application_stages ast ON a.application_id = ast.application_id
LEFT JOIN stages s ON ast.stage_id = s.stage_id AND s.order_index = 2
GROUP BY c.company_id, c.company_name
HAVING COUNT(a.application_id) >= 5
ORDER BY consistency_score DESC`,

  'offer-acceptance': `
SELECT
  c.company_id,
  c.company_name,
  COUNT(CASE WHEN a.final_outcome = 'offer' THEN 1 END) AS offers_extended,
  COUNT(CASE WHEN a.final_outcome = 'accepted' THEN 1 END) AS offers_accepted,
  COALESCE(
    COUNT(CASE WHEN a.final_outcome = 'accepted' THEN 1 END)::float
    / NULLIF(COUNT(CASE WHEN a.final_outcome = 'offer' THEN 1 END), 0) * 100,
    0
  ) AS acceptance_rate
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN companies c ON j.company_id = c.company_id
GROUP BY c.company_id, c.company_name
HAVING COUNT(CASE WHEN a.final_outcome = 'offer' THEN 1 END) > 0
ORDER BY offers_extended DESC`,

} as const

export type QueryName = keyof typeof QUERY_DEFINITIONS
