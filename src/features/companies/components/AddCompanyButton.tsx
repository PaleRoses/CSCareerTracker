'use client'

import { useState } from 'react'
import { Button } from '@/design-system/components'
import { AddIcon } from '@/design-system/icons'
import { CreateCompanyDialog } from './CreateCompanyDialog'

interface AddCompanyButtonProps {
  onSuccess?: (companyId: string) => void
}

export function AddCompanyButton({ onSuccess }: AddCompanyButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="gradient"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Add Company
      </Button>

      <CreateCompanyDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(companyId) => {
          setOpen(false)
          onSuccess?.(companyId)
        }}
      />
    </>
  )
}

export default AddCompanyButton
