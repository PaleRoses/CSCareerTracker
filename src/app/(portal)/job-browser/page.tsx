import { Box } from "@/design-system/components";
import { PageHeader } from "@/features/shared";
import { JobsTable } from "@/features/jobs";
import { getJobs } from "@/features/shared";
import { auth } from "@/features/auth/auth";
import { hasPrivilegedAccess } from "@/features/auth/constants";
import { QueryPreview } from "@/features/shared/dev";

export default async function JobBrowserPage() {
  const [jobs, session] = await Promise.all([
    getJobs(),
    auth(),
  ]);

  const hasJobManagement = hasPrivilegedAccess(session?.user?.role);

  return (
    <Box>
      <PageHeader
        title="Job Browser"
        subtitle="Explore available positions and find your next opportunity"
      />

      <QueryPreview query="jobs-list">
        <JobsTable jobs={jobs} canManageJobs={hasJobManagement} />
      </QueryPreview>
    </Box>
  );
}
