'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, Button, Box, Text } from '@/design-system/components'
import { EditIcon, DeleteIcon, PersonIcon } from '@/design-system/icons'
import {
  UserRoleEditor,
  UserStatusEditor,
  DeleteUserDialog,
  type AdminUser,
} from '@/features/admin'

interface UserActionsCardProps {
  user: AdminUser
}

export function UserActionsCard({ user }: UserActionsCardProps) {
  const router = useRouter()
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const isTechnoWarlord = user.role === 'techno_warlord'

  return (
    <>
      <Card className="bg-background-glass border border-border">
        <CardHeader title="Actions" />
        <CardContent>
          <Box className="space-y-3">
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PersonIcon />}
              onClick={() => setRoleDialogOpen(true)}
              disabled={isTechnoWarlord}
            >
              Change Role
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<EditIcon />}
              onClick={() => setStatusDialogOpen(true)}
              disabled={isTechnoWarlord}
            >
              Change Status
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isTechnoWarlord}
              className="border-error text-error hover:bg-error/10"
            >
              Delete User
            </Button>
            {isTechnoWarlord && (
              <Text variant="caption" color="muted" className="text-center block mt-2">
                Techno Warlord accounts cannot be modified
              </Text>
            )}
          </Box>
        </CardContent>
      </Card>

      <UserRoleEditor
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        userId={user.userId}
        currentRole={user.role}
        userName={`${user.fname} ${user.lname}`}
      />

      <UserStatusEditor
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        userId={user.userId}
        currentStatus={user.status}
        userName={`${user.fname} ${user.lname}`}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        userId={user.userId}
        userName={`${user.fname} ${user.lname}`}
        userEmail={user.email}
        onDeleted={() => router.push('/users')}
      />
    </>
  )
}
