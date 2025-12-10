'use client'

import { useRouter } from 'next/navigation'
import { JobPostingForm } from './JobPostingForm'
import type { Job } from '@/features/jobs/types'

interface JobFormRouterWrapperProps {
  companies: { id: string; label: string }[]
  initialData?: Job
  successRoute: string
  cancelRoute: string
}

export function JobFormRouterWrapper({
  companies,
  initialData,
  successRoute,
  cancelRoute,
}: JobFormRouterWrapperProps) {
  const router = useRouter()

  const handleSuccess = () => {
    router.push(successRoute)
    router.refresh()
  }

  const handleCancel = () => {
    router.push(cancelRoute)
  }

  return (
    <JobPostingForm
      companies={companies}
      initialData={initialData}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
