import type { ColumnDef, CellRenderParams } from '@/design-system/components'
import { Chip } from '@/design-system/components'
import { ExternalLinkButton } from '@/features/shared'
import type { Job } from '@/features/jobs/types'

export const jobColumns: ColumnDef<Job>[] = [
  {
    id: 'title',
    field: 'title',
    headerName: 'Position',
    flex: 1,
    minWidth: 200,
  },
  {
    id: 'type',
    field: 'type',
    headerName: 'Type',
    width: 120,
    renderCell: (params: CellRenderParams<Job>) => {
      const type = params.value as string | null
      return (
        <Chip
          variant="secondary"
          size="small"
          label={type ?? 'Unknown'}
        />
      )
    },
  },
  {
    id: 'locations',
    field: 'locations',
    headerName: 'Location',
    flex: 1,
    minWidth: 150,
    valueGetter: (_value: unknown, row: Job) => {
      if (!row.locations || row.locations.length === 0) return 'Remote'
      return row.locations[0]
    },
  },
  {
    id: 'actions',
    field: 'url',
    headerName: '',
    width: 60,
    sortable: false,
    renderCell: (params: CellRenderParams<Job>) => {
      if (!params.row.url) return null
      return (
        <ExternalLinkButton
          url={params.row.url}
          label="View job posting"
        />
      )
    },
  },
]
