import { Box } from "@/design-system/components";
import { PageHeader } from "@/features/shared";
import ApplicationsTable from "@/features/applications/components/ApplicationsTable";
import { getApplications } from "@/features/applications/queries";
import { getJobs } from "@/features/jobs/queries";
import AddApplicationButton from "@/features/applications/components/AddApplicationButton";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import { QueryPreview } from "@/features/shared/dev";

export default async function ApplicationsPage() {
  const [applications, jobsData] = await Promise.all([
    getApplications(),
    getJobs(),
  ]);

  // Transform jobs to JobOption format for the picker
  const jobs = jobsData.map((job) => ({
    id: job.id,
    label: `${job.title} @ ${job.companyName}`,
    companyName: job.companyName,
    title: job.title,
  }));

  return (
    <Box>
      <PageHeader
        title={UI_STRINGS.pages.applications.title}
        subtitle={UI_STRINGS.pages.applications.subtitle}
        action={<AddApplicationButton jobs={jobs} />}
      />

      <QueryPreview query="applications-list">
        <ApplicationsTable applications={applications} />
      </QueryPreview>
    </Box>
  );
}
