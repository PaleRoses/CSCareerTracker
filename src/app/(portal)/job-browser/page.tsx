import { Box } from "@/design-system/components";
import PageHeader from "@/components/ui/PageHeader";
import { JobsTable } from "@/features/jobs";
import { getJobs } from "@/features/shared";
import { auth } from "@/features/auth/auth";
import { canManageJobs } from "@/lib/auth";
import { QueryPreview } from "@/components/dev";

export default async function JobBrowserPage() {
  const [jobs, session] = await Promise.all([
    getJobs(),
    auth(),
  ]);

  const hasJobManagement = canManageJobs(session?.user?.role);

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
