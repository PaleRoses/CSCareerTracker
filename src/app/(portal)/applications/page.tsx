import { Box } from "@/design-system/components";
import { PageHeader } from "@/features/shared";
import ApplicationsTable from "@/features/applications/components/ApplicationsTable";
import { getApplications, getCompanies } from "@/features/applications/queries";
import AddApplicationButton from "@/features/applications/components/AddApplicationButton";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import { QueryPreview } from "@/features/shared/dev";

export default async function ApplicationsPage() {
  const [applications, companiesData] = await Promise.all([
    getApplications(),
    getCompanies(),
  ]);

  const companies = companiesData.map((company) => ({
    id: company.id,
    name: company.name,
    label: company.name,
    website: company.website,
  }));

  return (
    <Box>
      <PageHeader
        title={UI_STRINGS.pages.applications.title}
        subtitle={UI_STRINGS.pages.applications.subtitle}
        action={<AddApplicationButton companies={companies} />}
      />

      <QueryPreview query="applications-list">
        <ApplicationsTable applications={applications} />
      </QueryPreview>
    </Box>
  );
}
