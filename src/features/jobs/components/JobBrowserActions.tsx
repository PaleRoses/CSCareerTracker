'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/design-system/components'
import { AddIcon } from '@/design-system/icons'
import { PostJobModal, type CompanyOption } from '@/features/recruiter'

interface JobBrowserActionsProps {
  /** List of companies for the job posting form */
  companies: CompanyOption[]
  /** Whether the user has permission to post jobs */
  canPostJobs: boolean
}

/**
 * Client-side actions for the Job Browser page.
 * Handles the "Post New Job" modal for privileged users.
 */
export function JobBrowserActions({
  companies,
  canPostJobs,
}: JobBrowserActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleOpenModal = useCallback(() => setIsModalOpen(true), [])
  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])

  const handleSuccess = useCallback(() => {
    router.refresh()
  }, [router])

  if (!canPostJobs) {
    return null
  }

  return (
    <>
      <Button
        variant="gradient"
        startIcon={<AddIcon />}
        onClick={handleOpenModal}
        className="animate-glow-gradient"
      >
        Post New Job
      </Button>

      <PostJobModal
        open={isModalOpen}
        onClose={handleCloseModal}
        companies={companies}
        onSuccess={handleSuccess}
      />
    </>
  )
}

export default JobBrowserActions
