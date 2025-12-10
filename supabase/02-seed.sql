-- =============================================================================
-- Seed Data for CS Career Tracker
-- Matches Development Dynasty Proposal Document
-- =============================================================================

-- =============================================================================
-- CLEANUP: Delete existing seed data for clean re-runs
-- Order matters: delete children before parents (FK constraints)
-- =============================================================================
DELETE FROM aggregated_stats WHERE agg_id IN (
  'a6600000-0000-0000-0000-000000000000',
  'a6611111-1111-1111-1111-111111111111',
  'a6622222-2222-2222-2222-222222222222',
  'a66aaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'a66bbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
);
DELETE FROM application_stages WHERE application_id IN (
  'a9911111-1111-1111-1111-111111111111',
  'a9922222-2222-2222-2222-222222222222',
  'a9933333-3333-3333-3333-333333333333',
  'a9944444-4444-4444-4444-444444444444',
  'a9955555-5555-5555-5555-555555555555'
);
DELETE FROM applications WHERE application_id IN (
  'a9911111-1111-1111-1111-111111111111',
  'a9922222-2222-2222-2222-222222222222',
  'a9933333-3333-3333-3333-333333333333',
  'a9944444-4444-4444-4444-444444444444',
  'a9955555-5555-5555-5555-555555555555'
);
DELETE FROM jobs WHERE job_id IN (
  '10b11111-1111-1111-1111-111111111111',
  '10b22222-2222-2222-2222-222222222222',
  '10b33333-3333-3333-3333-333333333333',
  '10b44444-4444-4444-4444-444444444444',
  '10b55555-5555-5555-5555-555555555555',
  '10b66666-6666-6666-6666-666666666666'
);
DELETE FROM companies WHERE company_id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'dddddddd-dddd-dddd-dddd-dddddddddddd'
);
DELETE FROM users WHERE user_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);

-- =============================================================================
-- SAMPLE USERS
-- =============================================================================
-- Note: Replace UUIDs with actual auth.uid() values when using real authentication
INSERT INTO users (user_id, email, fname, lname, password_hash, role, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'Alice', 'Johnson', 'hash_placeholder_1', 'applicant', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'Bob', 'Smith', 'hash_placeholder_2', 'applicant', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', 'Admin', 'User', 'hash_placeholder_3', 'admin', 'active');

-- =============================================================================
-- SAMPLE COMPANIES
-- =============================================================================
INSERT INTO companies (company_id, company_name, website, locations, size) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Aurora Robotics', 'https://aurorarobotics.ai', ARRAY['San Francisco, CA', 'Remote'], 250),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nimbus Security', 'https://nimbussecurity.com', ARRAY['Seattle, WA', 'Austin, TX'], 500),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Pulse Analytics', 'https://pulseanalytics.io', ARRAY['New York, NY'], 120),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'TechCorp Industries', 'https://techcorp.com', ARRAY['Boston, MA', 'Denver, CO', 'Remote'], 1500);

-- =============================================================================
-- SAMPLE JOBS
-- =============================================================================
INSERT INTO jobs (job_id, company_id, job_title, job_type, locations, url, posted_date) VALUES
  -- Aurora Robotics jobs
  ('10b11111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Frontend Engineer', 'full-time', ARRAY['Remote'], 'https://aurorarobotics.ai/jobs/frontend', '2024-02-15'),
  ('10b22222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backend Engineer', 'full-time', ARRAY['San Francisco, CA'], 'https://aurorarobotics.ai/jobs/backend', '2024-02-10'),

  -- Nimbus Security jobs
  ('10b33333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Full-Stack Engineer', 'full-time', ARRAY['Seattle, WA'], 'https://nimbussecurity.com/jobs/fullstack', '2024-01-05'),
  ('10b44444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Security Intern', 'internship', ARRAY['Austin, TX'], 'https://nimbussecurity.com/jobs/intern', '2024-02-01'),

  -- Pulse Analytics jobs
  ('10b55555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Data Visualization Engineer', 'full-time', ARRAY['New York, NY'], 'https://pulseanalytics.io/jobs/dataviz', '2023-11-20'),

  -- TechCorp jobs
  ('10b66666-6666-6666-6666-666666666666', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Software Engineer', 'full-time', ARRAY['Remote', 'Boston, MA'], 'https://techcorp.com/jobs/swe', '2024-02-20');

-- =============================================================================
-- SAMPLE APPLICATIONS (Alice's applications)
-- =============================================================================
INSERT INTO applications (application_id, user_id, job_id, application_date, final_outcome, position_title) VALUES
  -- Alice applied to Aurora Robotics - still in progress
  ('a9911111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '10b11111-1111-1111-1111-111111111111', '2024-02-18', 'rejected', 'Frontend Engineer'),

  -- Alice applied to Nimbus Security - got offer
  ('a9922222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '10b33333-3333-3333-3333-333333333333', '2024-01-09', 'offer', 'Full-Stack Engineer'),

  -- Alice applied to Pulse Analytics - rejected
  ('a9933333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '10b55555-5555-5555-5555-555555555555', '2023-11-28', 'rejected', 'Data Visualization Engineer');

-- =============================================================================
-- SAMPLE APPLICATIONS (Bob's applications)
-- =============================================================================
INSERT INTO applications (application_id, user_id, job_id, application_date, final_outcome, position_title) VALUES
  -- Bob applied to TechCorp
  ('a9944444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '10b66666-6666-6666-6666-666666666666', '2024-02-22', 'rejected', 'Software Engineer'),

  -- Bob applied to Nimbus internship
  ('a9955555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '10b44444-4444-4444-4444-444444444444', '2024-02-05', 'offer', 'Security Intern');

-- =============================================================================
-- SAMPLE APPLICATION STAGES
-- Get stage IDs first (these match the default inserts in schema.sql)
-- =============================================================================

-- Helper: Get stage IDs
-- Applied = order_index 1
-- OA = order_index 2
-- Phone Screen = order_index 3
-- Onsite/Virtual = order_index 4
-- Offer = order_index 5
-- Rejected = order_index 6

-- Alice's Aurora application stages (in progress at Phone Screen)
-- Note: Applied stage is auto-created by trigger, so we UPDATE it instead of INSERT
UPDATE application_stages
SET
  started_at = '2024-02-18 10:00:00+00'::timestamptz,
  ended_at = '2024-02-18 10:00:00+00'::timestamptz,
  status = 'successful',
  notes = 'Submitted application'
WHERE application_id = 'a9911111-1111-1111-1111-111111111111'::uuid
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes)
SELECT
  '5e911112-1111-1111-1111-111111111111'::uuid,
  'a9911111-1111-1111-1111-111111111111'::uuid,
  stage_id,
  '2024-02-21 14:00:00+00'::timestamptz,
  '2024-02-22 16:00:00+00'::timestamptz,
  'successful',
  'Completed online assessment - 85%'
FROM stages WHERE stage_name = 'OA';

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes)
SELECT
  '5e911113-1111-1111-1111-111111111111'::uuid,
  'a9911111-1111-1111-1111-111111111111'::uuid,
  stage_id,
  '2024-03-01 09:00:00+00'::timestamptz,
  NULL,
  'inProgress',
  'Scheduled for March 5th'
FROM stages WHERE stage_name = 'Phone Screen';

-- Alice's Nimbus application stages (complete - got offer)
-- Note: Applied stage is auto-created by trigger, so we UPDATE it instead of INSERT
UPDATE application_stages
SET
  started_at = '2024-01-09 10:00:00+00'::timestamptz,
  ended_at = '2024-01-09 10:00:00+00'::timestamptz,
  status = 'successful',
  notes = 'Application submitted'
WHERE application_id = 'a9922222-2222-2222-2222-222222222222'::uuid
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes)
SELECT
  '5e922222-2222-2222-2222-222222222222'::uuid,
  'a9922222-2222-2222-2222-222222222222'::uuid,
  stage_id,
  '2024-01-12 10:00:00+00'::timestamptz,
  '2024-01-19 15:00:00+00'::timestamptz,
  'successful',
  'Take-home project completed'
FROM stages WHERE stage_name = 'OA';

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes)
SELECT
  '5e922223-2222-2222-2222-222222222222'::uuid,
  'a9922222-2222-2222-2222-222222222222'::uuid,
  stage_id,
  '2024-01-22 14:00:00+00'::timestamptz,
  '2024-01-22 15:00:00+00'::timestamptz,
  'successful',
  'Great conversation with hiring manager'
FROM stages WHERE stage_name = 'Phone Screen';

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes)
SELECT
  '5e922224-2222-2222-2222-222222222222'::uuid,
  'a9922222-2222-2222-2222-222222222222'::uuid,
  stage_id,
  '2024-01-26 09:00:00+00'::timestamptz,
  '2024-02-02 17:00:00+00'::timestamptz,
  'successful',
  'Onsite panel went well'
FROM stages WHERE stage_name = 'Onsite/Virtual';

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes)
SELECT
  '5e922225-2222-2222-2222-222222222222'::uuid,
  'a9922222-2222-2222-2222-222222222222'::uuid,
  stage_id,
  '2024-02-05 10:00:00+00'::timestamptz,
  '2024-02-05 10:00:00+00'::timestamptz,
  'successful',
  'Offer received! $150k base'
FROM stages WHERE stage_name = 'Offer';

-- Alice's Pulse application stages (rejected at Phone Screen)
-- Note: Applied stage is auto-created by trigger, so we UPDATE it instead of INSERT
UPDATE application_stages
SET
  started_at = '2023-11-28 10:00:00+00'::timestamptz,
  ended_at = '2023-11-28 10:00:00+00'::timestamptz,
  status = 'successful',
  notes = 'Applied online'
WHERE application_id = 'a9933333-3333-3333-3333-333333333333'::uuid
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes)
SELECT
  '5e933332-3333-3333-3333-333333333333'::uuid,
  'a9933333-3333-3333-3333-333333333333'::uuid,
  stage_id,
  '2023-12-01 14:00:00+00'::timestamptz,
  '2023-12-05 16:00:00+00'::timestamptz,
  'rejected',
  'Decided to move forward with other candidates'
FROM stages WHERE stage_name = 'Phone Screen';

-- =============================================================================
-- SAMPLE AGGREGATED STATS
-- =============================================================================
INSERT INTO aggregated_stats (agg_id, scope_type, scope_id, avg_time_to_offer, total_offers, total_applications, avg_response_days, avg_time_in_stage_days) VALUES
  -- Global stats
  ('a6600000-0000-0000-0000-000000000000', 'Global', NULL, 27.5, 2, 5, 4.2, 5.8),

  -- Alice's stats
  ('a6611111-1111-1111-1111-111111111111', 'User', '11111111-1111-1111-1111-111111111111', 27.0, 1, 3, 3.5, 6.2),

  -- Bob's stats
  ('a6622222-2222-2222-2222-222222222222', 'User', '22222222-2222-2222-2222-222222222222', 28.0, 1, 2, 5.0, 5.4),

  -- Company stats
  ('a66aaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Company', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 0.0, 0, 1, 3.0, 7.0),
  ('a66bbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Company', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 27.0, 2, 2, 2.5, 5.5);
