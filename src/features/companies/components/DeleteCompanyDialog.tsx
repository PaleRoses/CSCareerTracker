'use client'

import { useActionState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Text,
} from '@/design-system/components'
import { WarningIcon } from '@/design-system/icons'
import { FormActionButtons } from '@/features/shared'
import { deleteCompanyAction } from '../actions'
import type { ActionState } from '@/lib/actions/error-utils'

interface DeleteCompanyDialogProps {
  open: boolean
  onClose: () => void
  companyId: string
  companyName: string
  jobCount?: number
  onDeleted?: () => void
}

export function DeleteCompanyDialog({
  open,
  onClose,
  companyId,
  companyName,
  jobCount = 0,
  onDeleted,
}: DeleteCompanyDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionState<void>, FormData>(
    deleteCompanyAction,
    { success: false, error: undefined }
  )

  useEffect(() => {
    if (state.success) {
      onDeleted?.()
      onClose()
    }
  }, [state.success, onDeleted, onClose])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form action={formAction}>
        <input type="hidden" name="companyId" value={companyId} />
        <input type="hidden" name="confirmation" value="true" />

        <DialogTitle className="flex items-center gap-2 text-error">
          <WarningIcon />
          Delete Company
        </DialogTitle>

        <DialogContent>
          <Box className="bg-error/10 border border-error/30 rounded-lg p-4 mb-4">
            <Text variant="body2" color="error" className="font-medium mb-2">
              This action cannot be undone!
            </Text>
            <Text variant="body2" className="text-foreground/70">
              This will permanently delete the company AND all associated jobs and applications.
            </Text>
          </Box>

          <Box className="bg-background-glass border border-border rounded-lg p-4">
            <Text variant="body2" className="font-medium">
              {companyName}
            </Text>
            <Text variant="caption" color="muted" className="font-mono mt-2">
              ID: {companyId}
            </Text>
            {jobCount > 0 && (
              <Text variant="caption" color="error" className="mt-2 block">
                {jobCount} job{jobCount > 1 ? 's' : ''} will be deleted
              </Text>
            )}
          </Box>

          <Text variant="body2" className="mt-4 text-foreground/70">
            All jobs, applications, and application history will be permanently removed.
          </Text>

          {state.error && (
            <Text variant="body2" color="error" className="mt-4">
              {state.error}
            </Text>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <FormActionButtons
            isPending={isPending}
            submitLabel="Delete Company"
            submitVariant="primary"
            noPadding
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DeleteCompanyDialog
