import { getApplicationWithTag } from "@/features/applications/queries";
import ApplicationDetail from "@/features/applications/components/ApplicationDetail";
import { QueryPreview } from "@/features/shared/dev";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await getApplicationWithTag(id);

  return (
    <QueryPreview query="application-detail">
      <ApplicationDetail application={application ?? undefined} />
    </QueryPreview>
  );
}
