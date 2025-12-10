'use client'

import {
  DataTable,
  Chip,
  Text,
  type ColumnDef,
  type CellRenderParams,
  type ChipVariant,
} from '@/design-system/components'
import { formatDate } from '@/lib/utils'
import type { Candidate } from '../types'
import { ROUTES } from '@/config/routes'

interface CandidatesListProps {
  candidates: Candidate[]
  jobId?: string
}

const STAGE_VARIANTS: Record<string, ChipVariant> = {
  'Applied': 'default',
  'OA': 'secondary',
  'Phone Screen': 'primary',
  'Onsite/Virtual': 'warning',
  'Offer': 'success',
  'Rejected': 'error',
  'Withdrawn': 'default',
}

const STATUS_VARIANTS: Record<string, ChipVariant> = {
  'inProgress': 'primary',
  'successful': 'success',
  'rejected': 'error',
}

const OUTCOME_VARIANTS: Record<string, ChipVariant> = {
  'pending': 'default',
  'offer': 'success',
  'rejected': 'error',
  'withdrawn': 'warning',
}

export function CandidatesList({ candidates, jobId: _jobId }: CandidatesListProps) {
  const columns: ColumnDef<Candidate>[] = [
    {
      id: 'userName',
      field: 'userName',
      headerName: 'Candidate',
      flex: 1,
      minWidth: 150,
      renderCell: (params: CellRenderParams<Candidate>) => (
        <div>
          <Text variant="body2" className="font-medium">
            {params.row.userName}
          </Text>
          <Text variant="caption" className="text-foreground/60">
            {params.row.userEmail}
          </Text>
        </div>
      ),
    },
    {
      id: 'positionTitle',
      field: 'positionTitle',
      headerName: 'Position',
      width: 180,
    },
    {
      id: 'applicationDate',
      field: 'applicationDate',
      headerName: 'Applied',
      width: 120,
      valueFormatter: (value: unknown) => formatDate(value as string),
    },
    {
      id: 'currentStage',
      field: 'currentStage',
      headerName: 'Current Stage',
      width: 150,
      renderCell: (params: CellRenderParams<Candidate>) => (
        <Chip
          label={params.row.currentStage}
          size="small"
          variant={STAGE_VARIANTS[params.row.currentStage] || 'default'}
        />
      ),
    },
    {
      id: 'currentStageStatus',
      field: 'currentStageStatus',
      headerName: 'Status',
      width: 120,
      renderCell: (params: CellRenderParams<Candidate>) => (
        <Chip
          label={params.row.currentStageStatus}
          size="small"
          variant={STATUS_VARIANTS[params.row.currentStageStatus] || 'default'}
        />
      ),
    },
    {
      id: 'outcome',
      field: 'outcome',
      headerName: 'Outcome',
      width: 120,
      renderCell: (params: CellRenderParams<Candidate>) => (
        <Chip
          label={params.row.outcome}
          size="small"
          variant={OUTCOME_VARIANTS[params.row.outcome] || 'default'}
        />
      ),
    },
  ]

  // Transform candidates to include `id` for DataTable compatibility
  const rows = candidates.map(c => ({ ...c, id: c.applicationId }))

  return (
    <DataTable
      rows={rows}
      columns={columns}
      sortModel={[{ field: 'applicationDate', sort: 'desc' }]}
      pageSizeOptions={[10, 25, 50]}
      getRowId={(row) => row.id}
      onRowClick={(params) => {
        // Navigate to candidate detail
        window.location.href = ROUTES.recruiter.candidateDetail(params.row.applicationId)
      }}
    />
  )
}

export default CandidatesList
