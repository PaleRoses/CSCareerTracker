'use client'

import { useActionState } from 'react'
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
import { FormActionButtons } from '@/components/ui/FormActionButtons'
import { deleteUserAction } from '../actions'
import type { ActionState } from '@/lib/actions/error-utils'

interface DeleteUserDialogProps {
  open: boolean
  onClose: () => void
  userId: string
  userName: string
  userEmail: string
  onDeleted?: () => void
}

export function DeleteUserDialog({
  open,
  onClose,
  userId,
  userName,
  userEmail,
  onDeleted,
}: DeleteUserDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionState<void>, FormData>(
    deleteUserAction,
    { success: false, error: undefined }
  )

  if (state.success) {
    onDeleted?.()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form action={formAction}>
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="confirmation" value="true" />
        <DialogTitle className="flex items-center gap-2 text-error">
          <WarningIcon />
          Delete User Account
        </DialogTitle>
        <DialogContent>
          <Box className="bg-error/10 border border-error/30 rounded-lg p-4 mb-4">
            <Text variant="body2" color="error" className="font-medium mb-2">
              This action cannot be undone!
            </Text>
            <Text variant="body2" className="text-foreground/70">
              You are about to permanently delete the following user account:
            </Text>
          </Box>
          <Box className="bg-background-glass border border-border rounded-lg p-4">
            <Text variant="body2" className="font-medium">
              {userName}
            </Text>
            <Text variant="caption" color="muted">
              {userEmail}
            </Text>
            <Text variant="caption" color="muted" className="font-mono mt-2">
              ID: {userId}
            </Text>
          </Box>
          <Text variant="body2" className="mt-4 text-foreground/70">
            All associated data including applications, job postings, and activity
            history will be permanently removed.
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
            submitLabel="Delete User"
            submitVariant="primary"
            noPadding
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}
