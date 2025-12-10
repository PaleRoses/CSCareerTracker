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
import { FormActionButtons } from '@/features/shared'
import { updateUserRoleAction } from '../actions'
import type { RoleOption } from '@/features/auth/constants'
import { ROLE_OPTIONS } from '@/features/auth/constants'
import type { ActionState } from '@/lib/actions/error-utils'

interface UserRoleEditorProps {
  open: boolean
  onClose: () => void
  userId: string
  currentRole: RoleOption | null
  userName: string
}

export function UserRoleEditor({
  open,
  onClose,
  userId,
  currentRole,
  userName,
}: UserRoleEditorProps) {
  const [state, formAction, isPending] = useActionState<
    ActionState<{ userId: string; newRole: string }>,
    FormData
  >(updateUserRoleAction, { success: false, error: undefined })

  if (state.success) {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form action={formAction}>
        <input type="hidden" name="userId" value={userId} />
        <DialogTitle>Change Role for {userName}</DialogTitle>
        <DialogContent>
          <Text variant="body2" className="mb-4 text-foreground/70">
            Select a new role for this user. This will change their access
            permissions immediately.
          </Text>
          <Box className="flex flex-col gap-2">
            {ROLE_OPTIONS.filter((r) => r.value !== 'techno_warlord').map((role) => (
              <label
                key={role.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  currentRole === role.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="newRole"
                  value={role.value}
                  defaultChecked={currentRole === role.value}
                  className="mt-1"
                />
                <Box>
                  <Text variant="body2" className="font-medium">
                    {role.label}
                  </Text>
                  <Text variant="caption" color="muted">
                    {role.description}
                  </Text>
                </Box>
              </label>
            ))}
          </Box>
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
            submitLabel="Update Role"
            noPadding
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}
