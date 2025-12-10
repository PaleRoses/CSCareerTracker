import { getApplicationWithTag } from "@/features/applications/queries";
import ApplicationDetail from "@/features/applications/components/ApplicationDetail";
import { QueryPreview } from "@/features/shared/dev";
import { auth } from "@/features/auth/auth";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [application, session] = await Promise.all([
    getApplicationWithTag(id),
    auth(),
  ]);

  return (
    <QueryPreview query="application-detail">
      <ApplicationDetail
        application={application ?? undefined}
        userRole={session?.user?.role}
      />
    </QueryPreview>
  );
}
