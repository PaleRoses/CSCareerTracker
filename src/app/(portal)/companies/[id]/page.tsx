import {
  CompanyDetail,
  getCompanyDetail,
  getApplicationsByCompany,
} from '@/features/companies'
import { getJobs } from '@/lib/queries/jobs'

interface CompanyPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CompanyPageProps) {
  const { id } = await params
  const company = await getCompanyDetail(id)

  return {
    title: company
      ? `${company.name} | Career Tracker`
      : 'Company Not Found | Career Tracker',
    description: company
      ? `View details and open positions at ${company.name}`
      : 'Company not found',
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params

  const [company, jobs, applications] = await Promise.all([
    getCompanyDetail(id),
    getJobs({ companyId: id }),
    getApplicationsByCompany(id),
  ])

  return (
    <CompanyDetail
      company={company}
      jobs={jobs}
      applications={applications}
    />
  )
}
