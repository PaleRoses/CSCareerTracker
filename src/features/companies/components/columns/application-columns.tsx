import type { ColumnDef, CellRenderParams } from '@/design-system/components'
import { OutcomeChip } from '@/features/shared'
import type { Application } from '@/features/applications/types'

export const applicationColumns: ColumnDef<Application>[] = [
  {
    id: 'positionTitle',
    field: 'positionTitle',
    headerName: 'Position',
    flex: 1,
    minWidth: 200,
  },
  {
    id: 'dateApplied',
    field: 'dateApplied',
    headerName: 'Applied',
    width: 120,
    valueFormatter: (value: unknown) => {
      if (!value) return 'N/A'
      return new Date(value as string).toLocaleDateString()
    },
  },
  {
    id: 'outcome',
    field: 'outcome',
    headerName: 'Status',
    width: 120,
    renderCell: (params: CellRenderParams<Application>) => (
      <OutcomeChip outcome={params.value as Application['outcome']} />
    ),
  },
]
