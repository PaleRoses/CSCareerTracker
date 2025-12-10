'use client'

import { DataTable, type ColumnDef, Text } from '@/design-system/components'
import type { OfferAcceptance } from '../types'
import ReportCard from './ReportCard'

interface OfferAcceptanceTableProps {
  data: OfferAcceptance[]
}

export function OfferAcceptanceTable({ data }: OfferAcceptanceTableProps) {
  const columns: ColumnDef<OfferAcceptance>[] = [
    {
      id: 'companyName',
      field: 'companyName',
      headerName: 'Company',
      flex: 1,
      minWidth: 150,
    },
    {
      id: 'offersExtended',
      field: 'offersExtended',
      headerName: 'Offers Extended',
      width: 130,
    },
    {
      id: 'offersAccepted',
      field: 'offersAccepted',
      headerName: 'Accepted',
      width: 100,
      renderCell: ({ value }) => (
        <Text variant="body2" className={(value as number) > 0 ? 'text-success font-medium' : ''}>
          {value as number}
        </Text>
      ),
    },
    {
      id: 'acceptanceRate',
      field: 'acceptanceRate',
      headerName: 'Acceptance Rate',
      width: 130,
      renderCell: ({ value }) => {
        const rate = value as number
        const colorClass = rate >= 75 ? 'text-success' : rate >= 50 ? 'text-primary' : rate >= 25 ? 'text-warning' : 'text-error'
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
      title="Offer Acceptance Rates"
      subtitle="How often offers are accepted by company"
      isEmpty={data.length === 0}
      emptyMessage="No offer acceptance data available"
    >
      <DataTable
        rows={data as unknown as Array<OfferAcceptance & { id: string }>}
        columns={columns}
        getRowId={(row) => row.companyId}
        pageSizeOptions={[5, 10]}
        sortModel={[{ field: 'offersExtended', sort: 'desc' }]}
      />
    </ReportCard>
  )
}

export default OfferAcceptanceTable
