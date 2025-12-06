import type { CompanyOption } from '../components/CreateApplicationForm'

export interface RawCompany {
  id: string
  name: string
  website: string
}

export function transformCompaniesToOptions(companies: RawCompany[]): CompanyOption[] {
  return companies.map((company) => ({
    id: company.id,
    name: company.name,
    label: company.name,
    website: company.website,
  }))
}

export function findCompanyById(
  companies: CompanyOption[],
  id: string
): CompanyOption | undefined {
  return companies.find((c) => c.id === id)
}

export function findCompanyByName(
  companies: CompanyOption[],
  name: string
): CompanyOption | undefined {
  const normalizedName = name.toLowerCase().trim()
  return companies.find((c) => c.name.toLowerCase().trim() === normalizedName)
}
