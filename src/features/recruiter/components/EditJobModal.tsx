'use client'

import { Dialog, DialogContent } from '@/design-system/components'
import { JobPostingForm, type CompanyOption } from './JobPostingForm'
import type { Job } from '@/features/jobs/types'

interface EditJobModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback when the modal should close */
  onClose: () => void
  /** List of companies for the autocomplete */
  companies: CompanyOption[]
  /** The job being edited */
  job: Job
  /** Callback when job is successfully updated */
  onSuccess?: (jobId: string) => void
}

/**
 * Modal dialog for editing an existing job posting.
 * This is a controlled component - parent manages open/close state.
 */
export function EditJobModal({
  open,
  onClose,
  companies,
  job,
  onSuccess,
}: EditJobModalProps) {
  const handleSuccess = (jobId: string) => {
    onSuccess?.(jobId)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent noPadding>
        <JobPostingForm
          companies={companies}
          initialData={job}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditJobModal
