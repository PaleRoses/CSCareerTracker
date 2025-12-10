'use client'

import { Dialog, DialogContent } from '@/design-system/components'
import { CompanyForm } from './CompanyForm'

interface CreateCompanyDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: (companyId: string) => void
}

export function CreateCompanyDialog({
  open,
  onClose,
  onSuccess,
}: CreateCompanyDialogProps) {
  const handleSuccess = (companyId: string) => {
    onSuccess?.(companyId)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent noPadding>
        <CompanyForm onSuccess={handleSuccess} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}

export default CreateCompanyDialog
