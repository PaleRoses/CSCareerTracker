import type { Job } from '../types';

export interface FilteredJobs {
  active: Job[];
  archived: Job[];
}

export function filterJobsByStatus(jobs: Job[]): FilteredJobs {
  return {
    active: jobs.filter(job => job.isActive),
    archived: jobs.filter(job => !job.isActive),
  };
}
