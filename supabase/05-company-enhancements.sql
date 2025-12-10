-- =============================================================================
-- Company Enhancement Migration
-- Adds description, industry, and created_by columns to companies table
-- =============================================================================

-- Add missing columns to companies table (idempotent)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_by TEXT REFERENCES users(user_id);

-- Index for querying companies by creator
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);

-- Index for searching by industry
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
