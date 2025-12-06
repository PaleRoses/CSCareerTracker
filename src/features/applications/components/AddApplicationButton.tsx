'use client'

import { useState } from 'react'
import { Button, Dialog, DialogContent } from '@/design-system/components'
import { AddIcon } from '@/design-system/icons'
import { CreateApplicationForm, type CompanyOption } from './CreateApplicationForm'

interface AddApplicationButtonProps {
  companies: CompanyOption[]
}

export default function AddApplicationButton({ companies }: AddApplicationButtonProps) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button
        variant="gradient"
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Add Application
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent noPadding>
          <CreateApplicationForm
            companies={companies}
            onSuccess={() => handleClose()}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
