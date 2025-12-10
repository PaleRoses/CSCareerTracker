-- =============================================================================
-- Row Level Security Policies
-- Matches Development Dynasty Proposal Document
-- Run this AFTER schema.sql
--
-- NOTE: Uses get_user_id() instead of get_user_id() for NextAuth compatibility.
-- get_user_id() reads the x-user-id header passed by the application.
-- =============================================================================

-- =============================================================================
-- CLEANUP: Drop existing policies for clean re-runs
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
DROP POLICY IF EXISTS "Admins can insert companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can insert companies" ON companies;
DROP POLICY IF EXISTS "Admins can update companies" ON companies;
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Admins can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can update jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can delete jobs" ON jobs;
DROP POLICY IF EXISTS "Stages are viewable by everyone" ON stages;
DROP POLICY IF EXISTS "Admins can insert stages" ON stages;
DROP POLICY IF EXISTS "Admins can update stages" ON stages;
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can create own applications" ON applications;
DROP POLICY IF EXISTS "Users can update own applications" ON applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON applications;
DROP POLICY IF EXISTS "Users can view own application stages" ON application_stages;
DROP POLICY IF EXISTS "Users can create own application stages" ON application_stages;
DROP POLICY IF EXISTS "Users can update own application stages" ON application_stages;
DROP POLICY IF EXISTS "Users can delete own application stages" ON application_stages;
DROP POLICY IF EXISTS "Users can view own or global stats" ON aggregated_stats;
-- Recruiter policies
DROP POLICY IF EXISTS "Recruiters can view applications for their jobs" ON applications;
DROP POLICY IF EXISTS "Recruiters can view stages for their jobs" ON application_stages;
DROP POLICY IF EXISTS "Recruiters can update stages for their jobs" ON application_stages;
DROP POLICY IF EXISTS "Recruiters can create stages for their jobs" ON application_stages;

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregated_stats ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USERS POLICIES
-- =============================================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (get_user_id() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (get_user_id() = user_id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can create own profile"
  ON users FOR INSERT
  WITH CHECK (get_user_id() = user_id);

-- Admins and techno_warlords can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.user_id = get_user_id()
      AND u.role IN ('admin', 'techno_warlord')
    )
  );

-- Admins and techno_warlords can update any user
CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.user_id = get_user_id()
      AND u.role IN ('admin', 'techno_warlord')
    )
  );

-- Admins and techno_warlords can delete users (except themselves)
CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING (
    get_user_id() != user_id
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.user_id = get_user_id()
      AND u.role IN ('admin', 'techno_warlord')
    )
  );

-- =============================================================================
-- COMPANIES POLICIES (Public read access)
-- =============================================================================
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT
  USING (true);

-- Any authenticated user can create companies (for adding new applications)
CREATE POLICY "Authenticated users can insert companies"
  ON companies FOR INSERT
  WITH CHECK (get_user_id() IS NOT NULL);

CREATE POLICY "Admins can update companies"
  ON companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = get_user_id()
      AND users.role = 'admin'
    )
  );

-- =============================================================================
-- JOBS POLICIES (Public read access)
-- =============================================================================
CREATE POLICY "Jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (true);

-- Any authenticated user can create jobs (for adding new applications)
CREATE POLICY "Authenticated users can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (get_user_id() IS NOT NULL);

CREATE POLICY "Admins can update jobs"
  ON jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = get_user_id()
      AND users.role IN ('admin', 'recruiter', 'techno_warlord')
    )
  );

-- Admins/recruiters/techno_warlords can hard-delete jobs
CREATE POLICY "Admins can delete jobs"
  ON jobs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = get_user_id()
      AND users.role IN ('admin', 'recruiter', 'techno_warlord')
    )
  );

-- =============================================================================
-- STAGES POLICIES (Public read access - master list)
-- =============================================================================
CREATE POLICY "Stages are viewable by everyone"
  ON stages FOR SELECT
  USING (true);

-- Only admins can modify stages
CREATE POLICY "Admins can insert stages"
  ON stages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = get_user_id()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update stages"
  ON stages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = get_user_id()
      AND users.role = 'admin'
    )
  );

-- =============================================================================
-- APPLICATIONS POLICIES
-- =============================================================================
-- Users can only see their own applications
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (get_user_id() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can create own applications"
  ON applications FOR INSERT
  WITH CHECK (get_user_id() = user_id);

-- Users can update their own applications
CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  USING (get_user_id() = user_id);

-- Users can delete their own applications
CREATE POLICY "Users can delete own applications"
  ON applications FOR DELETE
  USING (get_user_id() = user_id);

-- =============================================================================
-- APPLICATION_STAGES POLICIES
-- =============================================================================
-- Users can view stages for their own applications
CREATE POLICY "Users can view own application stages"
  ON application_stages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.application_id = application_stages.application_id
      AND applications.user_id = get_user_id()
    )
  );

-- Users can create stages for their own applications
CREATE POLICY "Users can create own application stages"
  ON application_stages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.application_id = application_stages.application_id
      AND applications.user_id = get_user_id()
    )
  );

-- Users can update stages for their own applications
CREATE POLICY "Users can update own application stages"
  ON application_stages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.application_id = application_stages.application_id
      AND applications.user_id = get_user_id()
    )
  );

-- Users can delete stages for their own applications
CREATE POLICY "Users can delete own application stages"
  ON application_stages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.application_id = application_stages.application_id
      AND applications.user_id = get_user_id()
    )
  );

-- =============================================================================
-- AGGREGATED_STATS POLICIES
-- =============================================================================
-- Users can view their own stats or global stats
CREATE POLICY "Users can view own or global stats"
  ON aggregated_stats FOR SELECT
  USING (
    scope_type = 'Global'
    OR (scope_type = 'User' AND scope_id = get_user_id())
  );

-- Only system (service role) can modify aggregated stats
-- No INSERT/UPDATE/DELETE policies for regular users

-- =============================================================================
-- RECRUITER-SPECIFIC POLICIES
-- =============================================================================
-- These policies allow recruiters to view/manage applications for jobs they posted

-- Recruiters can view applications for jobs they posted
CREATE POLICY "Recruiters can view applications for their jobs"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN users u ON u.user_id = get_user_id()
      WHERE j.job_id = applications.job_id
      AND j.posted_by = get_user_id()
      AND u.role IN ('recruiter', 'admin', 'techno_warlord')
    )
  );

-- Recruiters can view application stages for jobs they posted
CREATE POLICY "Recruiters can view stages for their jobs"
  ON application_stages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON j.job_id = a.job_id
      JOIN users u ON u.user_id = get_user_id()
      WHERE a.application_id = application_stages.application_id
      AND j.posted_by = get_user_id()
      AND u.role IN ('recruiter', 'admin', 'techno_warlord')
    )
  );

-- Recruiters can update application stages for jobs they posted
CREATE POLICY "Recruiters can update stages for their jobs"
  ON application_stages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON j.job_id = a.job_id
      JOIN users u ON u.user_id = get_user_id()
      WHERE a.application_id = application_stages.application_id
      AND j.posted_by = get_user_id()
      AND u.role IN ('recruiter', 'admin', 'techno_warlord')
    )
  );

-- Recruiters can create stages for applications to jobs they posted
CREATE POLICY "Recruiters can create stages for their jobs"
  ON application_stages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON j.job_id = a.job_id
      JOIN users u ON u.user_id = get_user_id()
      WHERE a.application_id = application_stages.application_id
      AND j.posted_by = get_user_id()
      AND u.role IN ('recruiter', 'admin', 'techno_warlord')
    )
  );
