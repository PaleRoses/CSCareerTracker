'use client'

import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  List,
  Chip,
  IconButton,
  Card,
  CardContent,
} from '@/design-system/components'
import {
  ArrowBackIcon,
  BusinessIcon,
  LocationOnIcon,
  OpenInNewIcon,
  PeopleIcon,
  WorkIcon,
} from '@/design-system/icons'
import { SectionCard, DetailItem } from '@/components/ui'
import { DataTable, type ColumnDef, type CellRenderParams } from '@/design-system/components'
import type { CompanyDetailData } from '../queries'
import type { Job } from '@/features/jobs/types'
import type { Application } from '@/features/applications/types'
import { ROUTES } from '@/config/routes'

interface CompanyDetailProps {
  company: CompanyDetailData | null
  jobs: Job[]
  applications: Application[]
}

function formatSize(size: number | null): string {
  if (!size) return 'Unknown'
  if (size >= 10000) return `${Math.floor(size / 1000)}k+ employees`
  if (size >= 1000) return `${(size / 1000).toFixed(1)}k employees`
  return `${size} employees`
}

export function CompanyDetail({ company, jobs, applications }: CompanyDetailProps) {
  if (!company) {
    return (
      <Box className="text-center py-16">
        <Heading level={2} className="mb-4">
          Company not found
        </Heading>
        <NextLink href={ROUTES.COMPANIES}>
          <Button variant="ghost" startIcon={<ArrowBackIcon />}>
            Back to Companies
          </Button>
        </NextLink>
      </Box>
    )
  }

  const jobColumns: ColumnDef<Job>[] = [
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
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              window.open(params.row.url!, '_blank', 'noopener,noreferrer')
            }}
            aria-label="View job posting"
            className="text-foreground/50 hover:text-primary hover:bg-primary/10"
          >
            <OpenInNewIcon />
          </IconButton>
        )
      },
    },
  ]

  const applicationColumns: ColumnDef<Application>[] = [
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
      renderCell: (params: CellRenderParams<Application>) => {
        const outcome = params.value as string
        const variant =
          outcome === 'offer'
            ? 'offer'
            : outcome === 'rejected'
              ? 'rejected'
              : outcome === 'withdrawn'
                ? 'withdrawn'
                : 'pending'
        return (
          <Chip
            variant={variant}
            size="small"
            label={outcome || 'Pending'}
          />
        )
      },
    },
  ]

  return (
    <Box>
      <Box className="mb-6">
        <NextLink href={ROUTES.COMPANIES}>
          <Button variant="ghost" startIcon={<ArrowBackIcon />} size="small">
            Back to Companies
          </Button>
        </NextLink>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard title={company.name}>
            <List>
              {company.website && (
                <DetailItem
                  icon={<BusinessIcon />}
                  label="Website"
                  value={
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {new URL(company.website).hostname}
                      <OpenInNewIcon className="w-3 h-3" />
                    </a>
                  }
                />
              )}
              <DetailItem
                icon={<PeopleIcon />}
                label="Size"
                value={formatSize(company.size)}
              />
              {company.locations.length > 0 && (
                <DetailItem
                  icon={<LocationOnIcon />}
                  label="Locations"
                  value={company.locations.join(', ')}
                />
              )}
              {company.industry && (
                <DetailItem
                  icon={<WorkIcon />}
                  label="Industry"
                  value={company.industry}
                />
              )}
            </List>

            {company.description && (
              <Box className="mt-4 pt-4 border-t border-outline/20">
                <Text variant="body2" className="text-foreground/70">
                  {company.description}
                </Text>
              </Box>
            )}
          </SectionCard>

          <Card className="mt-4">
            <CardContent className="text-center">
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Heading level={4} className="text-primary">
                    {jobs.length}
                  </Heading>
                  <Text variant="body2" className="text-foreground/60">
                    Open Jobs
                  </Text>
                </Grid>
                <Grid size={6}>
                  <Heading level={4} className="text-secondary">
                    {applications.length}
                  </Heading>
                  <Text variant="body2" className="text-foreground/60">
                    Your Applications
                  </Text>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {jobs.length > 0 && (
            <SectionCard
              title="Open Positions"
              subtitle={`${jobs.length} job${jobs.length === 1 ? '' : 's'} available`}
              className="mb-4"
            >
              <DataTable
                rows={jobs}
                columns={jobColumns}
                pageSizeOptions={[5, 10]}
                getRowId={(row) => row.id}
              />
            </SectionCard>
          )}

          {applications.length > 0 ? (
            <SectionCard
              title="Your Applications"
              subtitle={`${applications.length} application${applications.length === 1 ? '' : 's'} to this company`}
            >
              <DataTable
                rows={applications}
                columns={applicationColumns}
                pageSizeOptions={[5, 10]}
                getRowId={(row) => row.id}
                onRowClick={(row) => {
                  window.location.href = `${ROUTES.APPLICATIONS}/${row.id}`
                }}
              />
            </SectionCard>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Text className="text-foreground/60 mb-4">
                  You haven&apos;t applied to any positions at {company.name} yet.
                </Text>
                {jobs.length > 0 && (
                  <Text variant="body2" className="text-foreground/50">
                    Browse the open positions above to get started!
                  </Text>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default CompanyDetail
