import {
  CompanyDetail,
  getCompanyDetail,
  getApplicationsByCompany,
} from '@/features/companies'
import { getJobs } from '@/features/jobs'
import { QueryPreview } from '@/features/shared/dev'
import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'

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

  const [company, jobs, applications, session] = await Promise.all([
    getCompanyDetail(id),
    getJobs({ companyId: id }),
    getApplicationsByCompany(id),
    auth(),
  ])

  const canManageCompanies = hasPrivilegedAccess(session?.user?.role)

  return (
    <QueryPreview query="company-detail">
      <CompanyDetail
        company={company}
        jobs={jobs}
        applications={applications}
        canManage={canManageCompanies}
      />
    </QueryPreview>
  )
}
