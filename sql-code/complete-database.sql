-- =============================================================================
-- Career Tracker Complete Database Setup
-- Combined: Schema + Seed Data
-- =============================================================================
-- This file creates the complete database structure and populates it with
-- sample data for demonstration and testing purposes.
--
-- Execution: psql -h <host> -U <user> -d <database> -f complete-database.sql
-- =============================================================================

-- =============================================================================
-- PART 1: SCHEMA (Tables, Indexes, Triggers, Functions)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLE: users
-- Stores user accounts (applicants, recruiters, administrators)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  fname TEXT NOT NULL,
  mname TEXT,
  lname TEXT NOT NULL,
  role TEXT CHECK (role IS NULL OR role IN ('applicant', 'recruiter', 'admin', 'techno_warlord')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'disabled')),
  password_hash TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  signup_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: companies
-- Company information for job listings
-- =============================================================================
CREATE TABLE IF NOT EXISTS companies (
  company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  website TEXT DEFAULT '',
  locations TEXT[] NOT NULL DEFAULT '{}',
  size INTEGER CHECK (size IS NULL OR size > 0),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: jobs
-- Job postings that users can apply to
-- =============================================================================
CREATE TABLE IF NOT EXISTS jobs (
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'full-time'
    CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract', 'other')),
  locations TEXT[] NOT NULL DEFAULT '{}',
  url TEXT,
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  posted_by TEXT REFERENCES users(user_id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: stages
-- Master list of pipeline stages
-- =============================================================================
CREATE TABLE IF NOT EXISTS stages (
  stage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_name TEXT NOT NULL UNIQUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  success_flag TEXT NOT NULL DEFAULT 'false' CHECK (success_flag IN ('true', 'false')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default stages (idempotent)
INSERT INTO stages (stage_name, order_index, success_flag) VALUES
  ('Withdrawn', 0, 'false'),
  ('Applied', 1, 'false'),
  ('OA', 2, 'false'),
  ('Phone Screen', 3, 'false'),
  ('Onsite/Virtual', 4, 'false'),
  ('Offer', 5, 'true'),
  ('Rejected', 6, 'false')
ON CONFLICT (stage_name) DO NOTHING;

-- =============================================================================
-- TABLE: applications
-- User job applications linking users to jobs
-- =============================================================================
CREATE TABLE IF NOT EXISTS applications (
  application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  final_outcome TEXT NOT NULL DEFAULT 'pending'
    CHECK (final_outcome IN ('pending', 'offer', 'rejected', 'withdrawn')),
  offer_status TEXT DEFAULT NULL,
  CONSTRAINT chk_offer_status_requires_offer CHECK (
    offer_status IS NULL
    OR (final_outcome = 'offer' AND offer_status IN ('pending', 'accepted', 'declined'))
  ),
  position_title TEXT NOT NULL,
  date_updated TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- =============================================================================
-- TABLE: application_stages
-- Pipeline event history tracking stage progression
-- =============================================================================
CREATE TABLE IF NOT EXISTS application_stages (
  app_stage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES stages(stage_id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'inProgress'
    CHECK (status IN ('inProgress', 'rejected', 'successful')),
  notes TEXT NOT NULL DEFAULT '',
  updated_by TEXT REFERENCES users(user_id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(application_id, stage_id)
);

-- Partial unique index: only one active stage per application
CREATE UNIQUE INDEX IF NOT EXISTS ux_app_stage_one_active_per_application
  ON application_stages (application_id)
  WHERE ended_at IS NULL;

-- =============================================================================
-- TABLE: aggregated_stats
-- Pre-computed statistics for performance
-- =============================================================================
CREATE TABLE IF NOT EXISTS aggregated_stats (
  agg_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scope_type TEXT NOT NULL CHECK (scope_type IN ('User', 'Company', 'Job', 'Global')),
  scope_id TEXT,
  avg_time_to_offer FLOAT NOT NULL DEFAULT 0.0,
  total_offers INTEGER NOT NULL DEFAULT 0,
  total_applications INTEGER NOT NULL DEFAULT 0,
  avg_response_days FLOAT NOT NULL DEFAULT 0.0,
  avg_time_in_stage_days FLOAT NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: reports
-- Saved report configurations
-- =============================================================================
CREATE TABLE IF NOT EXISTS reports (
  report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('csv', 'calendar', 'analytics', 'custom')),
  parameters JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(application_date DESC);
CREATE INDEX IF NOT EXISTS idx_applications_outcome ON applications(final_outcome);
CREATE INDEX IF NOT EXISTS idx_application_stages_application_id ON application_stages(application_id);
CREATE INDEX IF NOT EXISTS idx_application_stages_stage_id ON application_stages(stage_id);
CREATE INDEX IF NOT EXISTS idx_application_stages_status ON application_stages(status);

-- =============================================================================
-- FUNCTION: update_updated_at_column()
-- Automatically updates the updated_at timestamp on row changes
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stages_updated_at ON stages;
CREATE TRIGGER update_stages_updated_at
  BEFORE UPDATE ON stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_application_stages_updated_at ON application_stages;
CREATE TRIGGER update_application_stages_updated_at
  BEFORE UPDATE ON application_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FUNCTION: create_initial_application_stage()
-- Automatically creates "Applied" stage when application is created
-- =============================================================================
CREATE OR REPLACE FUNCTION create_initial_application_stage()
RETURNS TRIGGER AS $$
DECLARE
  applied_stage_id UUID;
BEGIN
  SELECT stage_id INTO applied_stage_id FROM stages WHERE stage_name = 'Applied';
  INSERT INTO application_stages (application_id, stage_id, started_at, status, notes)
  VALUES (NEW.application_id, applied_stage_id, NOW(), 'inProgress', '')
  ON CONFLICT (application_id, stage_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_create_initial_stage ON applications;
CREATE TRIGGER trg_create_initial_stage
  AFTER INSERT ON applications FOR EACH ROW EXECUTE FUNCTION create_initial_application_stage();

-- =============================================================================
-- FUNCTION: check_terminal_state()
-- Prevents new stages after terminal state (rejected, withdrawn, accepted offer)
-- =============================================================================
CREATE OR REPLACE FUNCTION check_terminal_state()
RETURNS TRIGGER AS $$
DECLARE
  is_terminal BOOLEAN;
  terminal_stage_name TEXT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM application_stages ast
    JOIN stages s ON ast.stage_id = s.stage_id
    WHERE ast.application_id = NEW.application_id
    AND (
      ast.status = 'rejected'
      OR s.stage_name = 'Withdrawn'
      OR (s.stage_name = 'Offer' AND ast.status = 'successful')
    )
  ) INTO is_terminal;

  IF is_terminal THEN
    SELECT s.stage_name INTO terminal_stage_name
    FROM application_stages ast
    JOIN stages s ON ast.stage_id = s.stage_id
    WHERE ast.application_id = NEW.application_id
    AND (ast.status = 'rejected' OR s.stage_name = 'Withdrawn' OR (s.stage_name = 'Offer' AND ast.status = 'successful'))
    LIMIT 1;
    RAISE EXCEPTION 'Application is in terminal state (%). No further stages allowed.', terminal_stage_name;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_terminal_state ON application_stages;
CREATE TRIGGER trg_check_terminal_state
  BEFORE INSERT ON application_stages FOR EACH ROW EXECUTE FUNCTION check_terminal_state();


-- =============================================================================
-- PART 2: SEED DATA (Sample Data for Testing)
-- =============================================================================

-- Cleanup existing seed data first (for re-runs)
DELETE FROM aggregated_stats WHERE scope_type IN ('Global', 'User', 'Company');
DELETE FROM application_stages WHERE application_id IN (
  SELECT application_id FROM applications WHERE user_id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222'
  )
);
DELETE FROM applications WHERE user_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
);
DELETE FROM jobs WHERE company_id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
  'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid
);
DELETE FROM companies WHERE company_id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
  'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid
);
DELETE FROM users WHERE user_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);

-- Sample Users
INSERT INTO users (user_id, email, fname, lname, password_hash, role, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'Alice', 'Johnson', 'hash_placeholder_1', 'applicant', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'Bob', 'Smith', 'hash_placeholder_2', 'applicant', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', 'Admin', 'User', 'hash_placeholder_3', 'admin', 'active');

-- Sample Companies
INSERT INTO companies (company_id, company_name, website, locations, size) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Aurora Robotics', 'https://aurorarobotics.ai', ARRAY['San Francisco, CA', 'Remote'], 250),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nimbus Security', 'https://nimbussecurity.com', ARRAY['Seattle, WA', 'Austin, TX'], 500),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Pulse Analytics', 'https://pulseanalytics.io', ARRAY['New York, NY'], 120),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'TechCorp Industries', 'https://techcorp.com', ARRAY['Boston, MA', 'Denver, CO', 'Remote'], 1500);

-- Sample Jobs
INSERT INTO jobs (job_id, company_id, job_title, job_type, locations, url, posted_date) VALUES
  ('10b11111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Frontend Engineer', 'full-time', ARRAY['Remote'], 'https://aurorarobotics.ai/jobs/frontend', '2024-02-15'),
  ('10b22222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backend Engineer', 'full-time', ARRAY['San Francisco, CA'], 'https://aurorarobotics.ai/jobs/backend', '2024-02-10'),
  ('10b33333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Full-Stack Engineer', 'full-time', ARRAY['Seattle, WA'], 'https://nimbussecurity.com/jobs/fullstack', '2024-01-05'),
  ('10b44444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Security Intern', 'internship', ARRAY['Austin, TX'], 'https://nimbussecurity.com/jobs/intern', '2024-02-01'),
  ('10b55555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Data Visualization Engineer', 'full-time', ARRAY['New York, NY'], 'https://pulseanalytics.io/jobs/dataviz', '2023-11-20'),
  ('10b66666-6666-6666-6666-666666666666', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Software Engineer', 'full-time', ARRAY['Remote', 'Boston, MA'], 'https://techcorp.com/jobs/swe', '2024-02-20');

-- Sample Applications (with various outcomes)
INSERT INTO applications (application_id, user_id, job_id, application_date, final_outcome, position_title) VALUES
  ('a9911111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '10b11111-1111-1111-1111-111111111111', '2024-02-18', 'pending', 'Frontend Engineer'),
  ('a9922222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '10b33333-3333-3333-3333-333333333333', '2024-01-09', 'offer', 'Full-Stack Engineer'),
  ('a9933333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '10b55555-5555-5555-5555-555555555555', '2023-11-28', 'rejected', 'Data Visualization Engineer'),
  ('a9944444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '10b66666-6666-6666-6666-666666666666', '2024-02-22', 'pending', 'Software Engineer'),
  ('a9955555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '10b44444-4444-4444-4444-444444444444', '2024-02-05', 'offer', 'Security Intern');

-- Update auto-created Applied stages with proper timestamps
UPDATE application_stages SET
  started_at = '2024-02-18 10:00:00+00'::timestamptz,
  ended_at = '2024-02-20 10:00:00+00'::timestamptz,
  status = 'successful'
WHERE application_id = 'a9911111-1111-1111-1111-111111111111'::uuid
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

-- Add additional stages for Alice's applications
INSERT INTO application_stages (application_id, stage_id, started_at, ended_at, status, notes)
SELECT 'a9911111-1111-1111-1111-111111111111'::uuid, stage_id,
  '2024-02-21 14:00:00+00'::timestamptz, NULL, 'inProgress', 'Scheduled phone screen'
FROM stages WHERE stage_name = 'Phone Screen';

-- Sample Aggregated Stats
INSERT INTO aggregated_stats (scope_type, scope_id, avg_time_to_offer, total_offers, total_applications, avg_response_days) VALUES
  ('Global', NULL, 27.5, 2, 5, 4.2),
  ('User', '11111111-1111-1111-1111-111111111111', 27.0, 1, 3, 3.5),
  ('User', '22222222-2222-2222-2222-222222222222', 28.0, 1, 2, 5.0);

-- =============================================================================
-- DATABASE SETUP COMPLETE
-- =============================================================================
-- Tables created: users, companies, jobs, stages, applications, application_stages,
--                 aggregated_stats, reports
-- Sample data: 3 users, 4 companies, 6 jobs, 5 applications
-- =============================================================================
