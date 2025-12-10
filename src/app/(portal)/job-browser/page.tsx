import { Box } from "@/design-system/components";
import { PageHeader } from "@/features/shared";
import { JobsTable, JobBrowserActions, getJobs } from "@/features/jobs";
import { getCompanies } from "@/features/applications/queries";
import { auth } from "@/features/auth/auth";
import { hasPrivilegedAccess } from "@/features/auth/constants";
import { QueryPreview } from "@/features/shared/dev";

export default async function JobBrowserPage() {
  const [jobs, companies, session] = await Promise.all([
    getJobs(),
    getCompanies(),
    auth(),
  ]);

  const hasJobManagement = hasPrivilegedAccess(session?.user?.role);

  const companyOptions = companies.map((c) => ({
    id: c.id,
    label: c.name,
  }));

  return (
    <Box>
      <PageHeader
        title="Job Browser"
        subtitle="Explore available positions and find your next opportunity"
        action={
          <JobBrowserActions
            companies={companyOptions}
            canPostJobs={hasJobManagement}
          />
        }
      />

      <QueryPreview query="jobs-list">
        <JobsTable jobs={jobs} canManageJobs={hasJobManagement} currentUserId={session?.user?.id} />
      </QueryPreview>
    </Box>
  );
}
