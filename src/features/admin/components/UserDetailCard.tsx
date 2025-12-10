'use client'

import { Card, CardContent, CardHeader, Box, Text, Chip, Grid } from '@/design-system/components'
import { PersonIcon, EmailIcon, CalendarTodayIcon } from '@/design-system/icons'
import { STATUS_VARIANTS, ROLE_VARIANTS, STATUS_LABELS } from '../constants'
import type { AdminUser } from '../types'

interface UserDetailCardProps {
  user: AdminUser
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="bg-background-glass border border-border">
      <CardHeader
        title={
          <Box className="flex items-center gap-3">
            <Box className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <PersonIcon className="text-primary" />
            </Box>
            <Box>
              <Text variant="body1" className="font-semibold">
                {user.fname} {user.lname}
              </Text>
              <Text variant="body2" color="muted">
                {user.email}
              </Text>
            </Box>
          </Box>
        }
        action={
          <Box className="flex gap-2">
            <Chip
              label={user.role || 'Unassigned'}
              variant={ROLE_VARIANTS[user.role || 'unassigned'] || 'default'}
            />
            <Chip
              label={STATUS_LABELS[user.status]}
              variant={STATUS_VARIANTS[user.status]}
            />
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box className="flex items-center gap-2 text-foreground/60 mb-1">
              <EmailIcon className="w-4 h-4" />
              <Text variant="caption">Email</Text>
            </Box>
            <Text variant="body2">{user.email}</Text>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box className="flex items-center gap-2 text-foreground/60 mb-1">
              <CalendarTodayIcon className="w-4 h-4" />
              <Text variant="caption">Joined</Text>
            </Box>
            <Text variant="body2">{formatDate(user.createdAt)}</Text>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box className="flex items-center gap-2 text-foreground/60 mb-1">
              <CalendarTodayIcon className="w-4 h-4" />
              <Text variant="caption">Last Updated</Text>
            </Box>
            <Text variant="body2">{formatDate(user.updatedAt)}</Text>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box className="flex items-center gap-2 text-foreground/60 mb-1">
              <PersonIcon className="w-4 h-4" />
              <Text variant="caption">User ID</Text>
            </Box>
            <Text variant="caption" className="font-mono text-foreground/50">
              {user.userId}
            </Text>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
