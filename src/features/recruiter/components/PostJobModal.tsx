'use client'

import { Dialog, DialogContent } from '@/design-system/components'
import { JobPostingForm, type CompanyOption } from './JobPostingForm'

interface PostJobModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback when the modal should close */
  onClose: () => void
  /** List of companies for the autocomplete */
  companies: CompanyOption[]
  /** Callback when job is successfully created */
  onSuccess?: (jobId: string) => void
}

/**
 * Modal dialog for creating a new job posting.
 * This is a controlled component - parent manages open/close state.
 */
export function PostJobModal({
  open,
  onClose,
  companies,
  onSuccess,
}: PostJobModalProps) {
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
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default PostJobModal
