'use client'

import { useRouter } from 'next/navigation'
import { JobPostingForm } from '@/features/recruiter'
import { ROUTES } from '@/config/routes'
import type { Job } from '@/features/jobs/types'

interface JobEditFormWrapperProps {
  companies: { id: string; label: string }[]
  initialJob: Job
}

export default function JobEditFormWrapper({
  companies,
  initialJob,
}: JobEditFormWrapperProps) {
  const router = useRouter()

  const handleSuccess = (_jobId: string) => {
    router.push(ROUTES.recruiter.jobs)
    router.refresh()
  }

  const handleCancel = () => {
    router.push(ROUTES.recruiter.jobs)
  }

  return (
    <JobPostingForm
      companies={companies}
      initialData={initialJob}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
