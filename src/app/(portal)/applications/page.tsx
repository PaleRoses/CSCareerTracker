import { Box } from "@/design-system/components";
import PageHeader from "@/components/ui/PageHeader";
import ApplicationsTable from "@/features/applications/components/ApplicationsTable";
import { getApplications, getCompanies } from "@/lib/queries";
import AddApplicationButton from "@/features/applications/components/AddApplicationButton";
import { transformCompaniesToOptions } from "@/features/applications/utils/company-utils";
import { UI_STRINGS } from "@/lib/constants/ui-strings";

export default async function ApplicationsPage() {
  // Fetch applications and companies server-side in parallel
  const [applications, companiesData] = await Promise.all([
    getApplications(),
    getCompanies(),
  ]);

  // Transform companies for the form dropdown
  const companies = transformCompaniesToOptions(companiesData);

  return (
    <Box>
      <PageHeader
        title={UI_STRINGS.pages.applications.title}
        subtitle={UI_STRINGS.pages.applications.subtitle}
        action={<AddApplicationButton companies={companies} />}
      />

      <ApplicationsTable applications={applications} />
    </Box>
  );
}
