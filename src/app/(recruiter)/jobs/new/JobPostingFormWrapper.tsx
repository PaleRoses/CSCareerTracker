'use client'

import { useRouter } from 'next/navigation'
import { JobPostingForm } from '@/features/recruiter'
import { ROUTES } from '@/config/routes'

interface JobPostingFormWrapperProps {
  companies: { id: string; label: string }[]
}

export default function JobPostingFormWrapper({ companies }: JobPostingFormWrapperProps) {
  const router = useRouter()

  const handleSuccess = (_jobId: string) => {
    router.push(ROUTES.jobBrowser)
    router.refresh()
  }

  const handleCancel = () => {
    router.push(ROUTES.recruiter.jobs)
  }

  return (
    <JobPostingForm
      companies={companies}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
