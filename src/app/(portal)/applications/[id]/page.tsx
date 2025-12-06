import { getApplicationWithTag } from "@/lib/queries";
import ApplicationDetail from "@/features/applications/components/ApplicationDetail";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch application from Supabase with cache tag for this specific application
  const application = await getApplicationWithTag(id);

  return <ApplicationDetail application={application ?? undefined} />;
}
