'use client'

import { useRouter } from 'next/navigation'
import { DataTable, Chip, Text } from '@/design-system/components'
import type { ColumnDef, CellRenderParams } from '@/design-system/components'
import { STATUS_VARIANTS, ROLE_VARIANTS } from '../constants'
import type { AdminUser } from '../types'
import { ROUTES } from '@/config/routes'

interface UsersListProps {
  users: AdminUser[]
}

type UserRow = AdminUser & { id: string }

export function UsersList({ users }: UsersListProps) {
  const router = useRouter()

  const columns: ColumnDef<UserRow>[] = [
    {
      id: 'name',
      field: 'fname',
      headerName: 'User',
      flex: 1,
      minWidth: 200,
      renderCell: (params: CellRenderParams<UserRow>) => (
        <div className="py-2">
          <Text variant="body2" className="font-medium">
            {params.row.fname} {params.row.lname}
          </Text>
          <Text variant="caption" className="text-foreground/60">
            {params.row.email}
          </Text>
        </div>
      ),
    },
    {
      id: 'role',
      field: 'role',
      headerName: 'Role',
      width: 140,
      renderCell: (params: CellRenderParams<UserRow>) => (
        <Chip
          label={params.row.role || 'Unassigned'}
          size="small"
          variant={ROLE_VARIANTS[params.row.role || 'unassigned'] || 'default'}
        />
      ),
    },
    {
      id: 'status',
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: CellRenderParams<UserRow>) => (
        <Chip
          label={params.row.status}
          size="small"
          variant={STATUS_VARIANTS[params.row.status] || 'default'}
        />
      ),
    },
    {
      id: 'createdAt',
      field: 'createdAt',
      headerName: 'Joined',
      width: 130,
      valueFormatter: (value: unknown) => {
        if (!value) return '-'
        return new Date(value as string).toLocaleDateString()
      },
    },
  ]

  const rows: UserRow[] = users.map((u) => ({
    id: u.userId,
    ...u,
  }))

  return (
    <DataTable
      rows={rows}
      columns={columns}
      sortModel={[{ field: 'createdAt', sort: 'desc' }]}
      pageSizeOptions={[10, 25, 50]}
      onRowClick={(params) => {
        router.push(ROUTES.admin.userDetail(params.row.userId))
      }}
    />
  )
}
