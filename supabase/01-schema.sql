-- =============================================================================
-- CS Career Tracker Database Schema
-- Matches Development Dynasty Proposal Document EXACTLY
-- =============================================================================

-- =============================================================================
-- SCHEMA CREATION (Idempotent - safe to re-run)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,  -- TEXT to support OAuth provider IDs (not UUID)
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
-- 2. COMPANIES TABLE
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
-- 3. JOBS TABLE
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
  posted_by TEXT REFERENCES users(user_id),  -- Recruiter who posted this job
  is_active BOOLEAN NOT NULL DEFAULT true,  -- Soft delete flag
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add columns if table already exists without them (idempotent migration)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posted_by TEXT REFERENCES users(user_id);

-- =============================================================================
-- 4. STAGES TABLE (Master Stage List)
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

-- Insert default stages per proposal document (idempotent)
-- Note: Withdrawn has order_index 0 because it can occur at any point in the pipeline
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
-- 5. APPLICATIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS applications (
  application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  final_outcome TEXT NOT NULL DEFAULT 'pending'
    CHECK (final_outcome IN ('pending', 'offer', 'rejected', 'withdrawn')),
  offer_status TEXT DEFAULT NULL,
  -- Composite constraint: offer_status only valid when final_outcome = 'offer'
  CONSTRAINT chk_offer_status_requires_offer CHECK (
    offer_status IS NULL
    OR (final_outcome = 'offer' AND offer_status IN ('pending', 'accepted', 'declined'))
  ),
  position_title TEXT NOT NULL,
  date_updated TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Business rule: user cannot apply to same job twice
  UNIQUE(user_id, job_id)
);

-- =============================================================================
-- 6. APPLICATION_STAGES TABLE (Pipeline Event History)
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
  updated_by TEXT REFERENCES users(user_id),  -- Who last modified this stage
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Each application can only be in each stage once
  UNIQUE(application_id, stage_id)
);

-- Add updated_by column if table already exists without it (idempotent migration)
ALTER TABLE application_stages ADD COLUMN IF NOT EXISTS updated_by TEXT REFERENCES users(user_id);

-- Partial unique index: only one active stage per application
CREATE UNIQUE INDEX IF NOT EXISTS ux_app_stage_one_active_per_application
  ON application_stages (application_id)
  WHERE ended_at IS NULL;

-- =============================================================================
-- 7. AGGREGATED_STATS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS aggregated_stats (
  agg_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scope_type TEXT NOT NULL CHECK (scope_type IN ('User', 'Company', 'Job', 'Global')),
  scope_id TEXT,  -- TEXT to support both UUID (Company/Job) and OAuth IDs (User)
  avg_time_to_offer FLOAT NOT NULL DEFAULT 0.0,
  total_offers INTEGER NOT NULL DEFAULT 0,
  total_applications INTEGER NOT NULL DEFAULT 0,
  avg_response_days FLOAT NOT NULL DEFAULT 0.0,
  avg_time_in_stage_days FLOAT NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. REPORTS TABLE
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
CREATE INDEX IF NOT EXISTS idx_application_stages_updated_by ON application_stages(updated_by);
CREATE INDEX IF NOT EXISTS idx_aggregated_stats_scope ON aggregated_stats(scope_type, scope_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_generated ON reports(generated_at DESC);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- GET_USER_ID FUNCTION (For NextAuth + RLS Integration)
-- =============================================================================
-- This function reads the user ID from a custom HTTP header (x-user-id)
-- passed by the application when using NextAuth instead of Supabase Auth.
-- RLS policies use this instead of auth.uid() which only works with Supabase Auth.
CREATE OR REPLACE FUNCTION get_user_id() RETURNS TEXT AS $$
BEGIN
  -- Read x-user-id header from PostgREST request
  -- Returns NULL if header not present or empty
  RETURN NULLIF(
    current_setting('request.headers', true)::json->>'x-user-id',
    ''
  );
EXCEPTION
  WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Apply triggers to all tables (idempotent: drop if exists, then create)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stages_updated_at ON stages;
CREATE TRIGGER update_stages_updated_at
  BEFORE UPDATE ON stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_application_stages_updated_at ON application_stages;
CREATE TRIGGER update_application_stages_updated_at
  BEFORE UPDATE ON application_stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_aggregated_stats_updated_at ON aggregated_stats;
CREATE TRIGGER update_aggregated_stats_updated_at
  BEFORE UPDATE ON aggregated_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- CONSTRAINT TRIGGER: AUTO-CREATE INITIAL "APPLIED" STAGE
-- =============================================================================
-- Guarantees every application has at least one stage record
CREATE OR REPLACE FUNCTION create_initial_application_stage()
RETURNS TRIGGER AS $$
DECLARE
  applied_stage_id UUID;
BEGIN
  -- Get the "Applied" stage ID
  SELECT stage_id INTO applied_stage_id
  FROM stages
  WHERE stage_name = 'Applied';

  -- Insert the initial stage record (idempotent - won't fail if stage already exists)
  INSERT INTO application_stages (
    application_id,
    stage_id,
    started_at,
    status,
    notes
  ) VALUES (
    NEW.application_id,
    applied_stage_id,
    NOW(),
    'inProgress',
    ''
  )
  ON CONFLICT (application_id, stage_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_create_initial_stage ON applications;
CREATE TRIGGER trg_create_initial_stage
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_application_stage();

-- =============================================================================
-- CONSTRAINT TRIGGER: TERMINAL STAGE PROTECTION
-- =============================================================================
-- Prevents new stage entries when application is in terminal state
-- (Offer successful, any rejection, or Withdrawn)
CREATE OR REPLACE FUNCTION check_terminal_state()
RETURNS TRIGGER AS $$
DECLARE
  is_terminal BOOLEAN;
  terminal_stage_name TEXT;
BEGIN
  -- Skip check for upserts: if row already exists, this is an update via ON CONFLICT
  -- (BEFORE INSERT fires even for ON CONFLICT DO UPDATE, before PG knows it will update)
  IF EXISTS (
    SELECT 1 FROM application_stages
    WHERE application_id = NEW.application_id
    AND stage_id = NEW.stage_id
  ) THEN
    RETURN NEW;
  END IF;

  -- Check for terminal conditions (only for genuinely new inserts):
  -- 1. Any stage with status = 'rejected'
  -- 2. Withdrawn stage exists
  -- 3. Offer stage with status = 'successful'
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
    -- Get the terminal stage name for error message
    SELECT s.stage_name INTO terminal_stage_name
    FROM application_stages ast
    JOIN stages s ON ast.stage_id = s.stage_id
    WHERE ast.application_id = NEW.application_id
    AND (
      ast.status = 'rejected'
      OR s.stage_name = 'Withdrawn'
      OR (s.stage_name = 'Offer' AND ast.status = 'successful')
    )
    LIMIT 1;

    RAISE EXCEPTION 'Application is in terminal state (%). No further stages allowed.', terminal_stage_name;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_terminal_state ON application_stages;
CREATE TRIGGER trg_check_terminal_state
  BEFORE INSERT ON application_stages
  FOR EACH ROW
  EXECUTE FUNCTION check_terminal_state();
