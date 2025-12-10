'use client'

import { DataTable, type ColumnDef, Text } from '@/design-system/components'
import type { CompanyStats } from '../types'
import ReportCard from './ReportCard'

interface ResponseTimeTableProps {
  data: CompanyStats[]
}

export function ResponseTimeTable({ data }: ResponseTimeTableProps) {
  const columns: ColumnDef<CompanyStats>[] = [
    {
      id: 'companyName',
      field: 'companyName',
      headerName: 'Company',
      flex: 1,
      minWidth: 150,
    },
    {
      id: 'totalApplications',
      field: 'totalApplications',
      headerName: 'Applications',
      width: 110,
    },
    {
      id: 'avgResponseDays',
      field: 'avgResponseDays',
      headerName: 'Avg Response',
      width: 120,
      renderCell: ({ value }) => {
        const days = value as number | null
        if (days === null) {
          return <Text variant="body2" className="text-foreground/40">No data</Text>
        }
        const colorClass = days <= 7 ? 'text-success' : days <= 14 ? 'text-primary' : days <= 21 ? 'text-warning' : 'text-error'
        return (
          <Text variant="body2" className={`font-medium ${colorClass}`}>
            {days} days
          </Text>
        )
      },
    },
    {
      id: 'offerRate',
      field: 'offerRate',
      headerName: 'Offer Rate',
      width: 100,
      renderCell: ({ value }) => {
        const rate = value as number
        const colorClass = rate >= 50 ? 'text-success' : rate >= 25 ? 'text-warning' : 'text-foreground/60'
        return (
          <Text variant="body2" className={`font-medium ${colorClass}`}>
            {rate}%
          </Text>
        )
      },
    },
  ]

  return (
    <ReportCard
      title="Response Time by Company"
      subtitle="How quickly companies respond to your applications"
      isEmpty={data.length === 0}
      emptyMessage="No response time data available"
    >
      <DataTable
        rows={data as unknown as Array<CompanyStats & { id: string }>}
        columns={columns}
        getRowId={(row) => row.companyId}
        pageSizeOptions={[5, 10]}
        sortModel={[{ field: 'avgResponseDays', sort: 'asc' }]}
      />
    </ReportCard>
  )
}

export default ResponseTimeTable
