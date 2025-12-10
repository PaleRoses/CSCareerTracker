/**
 * Test Data Fixtures
 *
 * Reusable test data for unit and integration tests.
 */

export const testCompany = {
  id: 'company-1',
  name: 'Acme Corp',
  website: 'https://acme.example.com',
  locations: ['San Francisco, CA', 'New York, NY'],
}

export const testJob = {
  id: 'job-1',
  companyId: testCompany.id,
  companyName: testCompany.name,
  title: 'Senior Software Engineer',
  type: 'full_time' as const,
  locations: ['San Francisco, CA'],
  url: 'https://acme.example.com/careers/senior-swe',
}

export const testStage = {
  id: 'stage-1',
  name: 'Applied' as const,
  status: 'successful' as const,
  date: '2024-01-15',
  notes: [],
  orderIndex: 0,
}

export const testApplication = {
  id: 'app-1',
  userId: 'test-user-id',
  jobId: testJob.id,
  company: testCompany.name,
  companyId: testCompany.id,
  positionTitle: testJob.title,
  dateApplied: '2024-01-15',
  outcome: 'pending' as const,
  stages: [testStage],
  notes: [],
  metadata: {
    location: 'San Francisco, CA',
    jobUrl: testJob.url,
  },
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
}

export const testCandidate = {
  applicationId: testApplication.id,
  userId: 'test-user-id',
  userName: 'Test Candidate',
  userEmail: 'candidate@example.com',
  positionTitle: testJob.title,
  applicationDate: '2024-01-15',
  currentStage: 'Applied',
  currentStageStatus: 'successful' as const,
  outcome: 'pending' as const,
  stages: [testStage],
}

/**
 * Create test application with custom overrides
 */
export function createTestApplication(overrides?: Partial<typeof testApplication>) {
  return { ...testApplication, ...overrides }
}

/**
 * Create test job with custom overrides
 */
export function createTestJob(overrides?: Partial<typeof testJob>) {
  return { ...testJob, ...overrides }
}

/**
 * Create test company with custom overrides
 */
export function createTestCompany(overrides?: Partial<typeof testCompany>) {
  return { ...testCompany, ...overrides }
}

export default {
  testCompany,
  testJob,
  testStage,
  testApplication,
  testCandidate,
  createTestApplication,
  createTestJob,
  createTestCompany,
}
