'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/design-system/components'
import { AddIcon } from '@/design-system/icons'
import { PostJobModal } from './PostJobModal'
import type { CompanyOption } from './JobPostingForm'

interface RecruiterJobsActionsProps {
  /** List of companies for the job posting form */
  companies: CompanyOption[]
}

/**
 * Client-side actions for the Recruiter Jobs page.
 * Handles the "Post New Job" modal.
 */
export function RecruiterJobsActions({
  companies,
}: RecruiterJobsActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleOpenModal = useCallback(() => setIsModalOpen(true), [])
  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])

  const handleSuccess = useCallback(() => {
    router.refresh()
  }, [router])

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

export default RecruiterJobsActions
