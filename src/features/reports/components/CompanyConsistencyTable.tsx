'use client'

import { DataTable, type ColumnDef, Text } from '@/design-system/components'
import type { CompanyConsistency } from '../types'
import ReportCard from './ReportCard'

interface CompanyConsistencyTableProps {
  data: CompanyConsistency[]
}

export function CompanyConsistencyTable({ data }: CompanyConsistencyTableProps) {
  const columns: ColumnDef<CompanyConsistency>[] = [
    {
      id: 'companyName',
      field: 'companyName',
      headerName: 'Company',
      flex: 1,
      minWidth: 150,
    },
    {
      id: 'totalApplicationsAllUsers',
      field: 'totalApplicationsAllUsers',
      headerName: 'Total Apps',
      width: 100,
    },
    {
      id: 'avgResponseDays',
      field: 'avgResponseDays',
      headerName: 'Avg Response',
      width: 120,
      renderCell: ({ value }) => (
        <Text variant="body2">
          {value as number} days
        </Text>
      ),
    },
    {
      id: 'responseVariance',
      field: 'responseVariance',
      headerName: 'Variance',
      width: 100,
      renderCell: ({ value }) => {
        const variance = value as number
        const colorClass = variance <= 10 ? 'text-success' : variance <= 25 ? 'text-primary' : variance <= 50 ? 'text-warning' : 'text-error'
        return (
          <Text variant="body2" className={colorClass}>
            {variance}
          </Text>
        )
      },
    },
    {
      id: 'consistencyScore',
      field: 'consistencyScore',
      headerName: 'Consistency',
      width: 110,
      renderCell: ({ value }) => {
        const score = value as number
        const colorClass = score >= 75 ? 'text-success' : score >= 50 ? 'text-primary' : score >= 25 ? 'text-warning' : 'text-error'
        return (
          <Text variant="body2" className={`font-medium ${colorClass}`}>
            {score}%
          </Text>
        )
      },
    },
  ]

  return (
    <ReportCard
      title="Company Response Consistency"
      subtitle="How reliably companies respond across all users"
      isEmpty={data.length === 0}
      emptyMessage="No consistency data available"
    >
      <DataTable
        rows={data as unknown as Array<CompanyConsistency & { id: string }>}
        columns={columns}
        getRowId={(row) => row.companyId}
        pageSizeOptions={[5, 10]}
        sortModel={[{ field: 'consistencyScore', sort: 'desc' }]}
      />
    </ReportCard>
  )
}

export default CompanyConsistencyTable
