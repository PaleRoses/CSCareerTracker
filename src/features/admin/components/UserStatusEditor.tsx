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
  TextField,
} from '@/design-system/components'
import { FormActionButtons } from '@/features/shared'
import { updateUserStatusAction } from '../actions'
import { STATUS_LABELS, STATUS_VARIANTS } from '../constants'
import type { UserStatus } from '../types'
import type { ActionState } from '@/lib/actions/error-utils'

interface UserStatusEditorProps {
  open: boolean
  onClose: () => void
  userId: string
  currentStatus: UserStatus
  userName: string
}

const STATUS_OPTIONS: { value: UserStatus; description: string }[] = [
  { value: 'active', description: 'User has full access to the system' },
  { value: 'suspended', description: 'Temporarily restricted - can be reactivated' },
  { value: 'disabled', description: 'Permanently restricted - requires manual review' },
]

export function UserStatusEditor({
  open,
  onClose,
  userId,
  currentStatus,
  userName,
}: UserStatusEditorProps) {
  const [state, formAction, isPending] = useActionState<
    ActionState<{ userId: string; newStatus: string }>,
    FormData
  >(updateUserStatusAction, { success: false, error: undefined })

  useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state.success, onClose])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form action={formAction}>
        <input type="hidden" name="userId" value={userId} />
        <DialogTitle>Change Status for {userName}</DialogTitle>
        <DialogContent>
          <Text variant="body2" className="mb-4 text-foreground/70">
            Changing user status will affect their ability to access the system.
          </Text>
          <Box className="flex flex-col gap-2 mb-4">
            {STATUS_OPTIONS.map((status) => (
              <label
                key={status.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  currentStatus === status.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="newStatus"
                  value={status.value}
                  defaultChecked={currentStatus === status.value}
                  className="mt-1"
                />
                <Box>
                  <Text
                    variant="body2"
                    className="font-medium"
                    color={
                      STATUS_VARIANTS[status.value] === 'success'
                        ? 'success'
                        : STATUS_VARIANTS[status.value] === 'error'
                          ? 'error'
                          : STATUS_VARIANTS[status.value] === 'warning'
                            ? 'warning'
                            : 'primary'
                    }
                  >
                    {STATUS_LABELS[status.value]}
                  </Text>
                  <Text variant="caption" color="muted">
                    {status.description}
                  </Text>
                </Box>
              </label>
            ))}
          </Box>
          <TextField
            name="reason"
            label="Reason (optional)"
            placeholder="Enter a reason for this status change"
            multiline
            rows={2}
            fullWidth
          />
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
            submitLabel="Update Status"
            noPadding
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}
