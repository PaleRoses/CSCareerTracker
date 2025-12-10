'use client'

import { useState } from 'react'
import { Button, Dialog, DialogContent } from '@/design-system/components'
import { AddIcon } from '@/design-system/icons'
import { CreateApplicationForm, type JobOption } from './CreateApplicationForm'

interface AddApplicationButtonProps {
  jobs: JobOption[]
}

export default function AddApplicationButton({ jobs }: AddApplicationButtonProps) {
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
            jobs={jobs}
            onSuccess={() => handleClose()}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
