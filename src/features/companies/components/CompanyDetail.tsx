'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  List,
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
import { SectionCard, DetailItem } from '@/features/shared'
import { DataTable } from '@/design-system/components'
import type { CompanyDetailData } from '../queries'
import type { Job } from '@/features/jobs/types'
import type { Application } from '@/features/applications/types'
import { ROUTES } from '@/config/routes'
import { formatSize } from '../utils/format-utils'
import { jobColumns, applicationColumns } from './columns'

interface CompanyDetailProps {
  company: CompanyDetailData | null
  jobs: Job[]
  applications: Application[]
}

export function CompanyDetail({ company, jobs, applications }: CompanyDetailProps) {
  const router = useRouter()

  if (!company) {
    return (
      <Box className="text-center py-16">
        <Heading level={2} className="mb-4">
          Company not found
        </Heading>
        <NextLink href={ROUTES.companies}>
          <Button variant="ghost" startIcon={<ArrowBackIcon />}>
            Back to Companies
          </Button>
        </NextLink>
      </Box>
    )
  }

  return (
    <Box>
      <Box className="mb-6">
        <NextLink href={ROUTES.companies}>
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
                  router.push(`${ROUTES.applications}/${row.id}`)
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
