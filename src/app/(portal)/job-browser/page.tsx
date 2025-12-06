import { Box } from "@/design-system/components";
import PageHeader from "@/components/ui/PageHeader";
import { JobsTable } from "@/features/jobs";
import { getJobs } from "@/lib/queries/jobs";
import { auth } from "@/features/auth/auth";
import { canManageJobs } from "@/lib/auth";

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

      <JobsTable jobs={jobs} canManageJobs={hasJobManagement} />
    </Box>
  );
}
