'use client'

import { DataTable, type ColumnDef, Text } from '@/design-system/components'
import type { CompanyStats } from '../types'
import ReportCard from './ReportCard'

interface OfferRateTableProps {
  data: CompanyStats[]
}

export function OfferRateTable({ data }: OfferRateTableProps) {
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
      id: 'offers',
      field: 'offers',
      headerName: 'Offers',
      width: 80,
      renderCell: ({ value }) => (
        <Text variant="body2" className={(value as number) > 0 ? 'text-success font-medium' : ''}>
          {value as number}
        </Text>
      ),
    },
    {
      id: 'rejections',
      field: 'rejections',
      headerName: 'Rejected',
      width: 90,
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
      title="Offer Rates by Company"
      subtitle="Your success rate at each company"
      isEmpty={data.length === 0}
      emptyMessage="No company data available"
    >
      <DataTable
        rows={data as unknown as Array<CompanyStats & { id: string }>}
        columns={columns}
        getRowId={(row) => row.companyId}
        pageSizeOptions={[5, 10]}
        sortModel={[{ field: 'totalApplications', sort: 'desc' }]}
      />
    </ReportCard>
  )
}

export default OfferRateTable
