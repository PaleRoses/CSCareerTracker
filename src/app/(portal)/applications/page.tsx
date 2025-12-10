import { Box } from "@/design-system/components";
import PageHeader from "@/components/ui/PageHeader";
import ApplicationsTable from "@/features/applications/components/ApplicationsTable";
import { getApplications, getCompanies } from "@/features/applications/queries";
import AddApplicationButton from "@/features/applications/components/AddApplicationButton";
import { transformCompaniesToOptions } from "@/features/applications/utils/company-utils";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import { QueryPreview } from "@/components/dev";

export default async function ApplicationsPage() {
  const [applications, companiesData] = await Promise.all([
    getApplications(),
    getCompanies(),
  ]);

  const companies = transformCompaniesToOptions(companiesData);

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
