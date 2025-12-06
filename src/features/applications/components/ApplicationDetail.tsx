"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

import {
  Box,
  Heading,
  Button,
  Grid,
  Dialog,
  DialogContent,
} from "@/design-system/components";
import { SectionCard } from "@/components/ui/SectionCard";
import { ArrowBackIcon } from "@/design-system/icons";

import type { Application } from "@/features/applications/types";
import { deleteApplicationAndRedirect } from "../actions/delete-application.action";
import { ApplicationHeader } from "./ApplicationHeader";
import { ApplicationMetadata } from "./ApplicationMetadata";
import StageTimeline from "./StageTimeline";
import AddNoteForm from "./AddNoteForm";
import EditApplicationForm from "./EditApplicationForm";
import { ROUTES } from "@/config/routes";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import type { OutcomeDisplayStatus } from "../constants";

interface ApplicationDetailProps {
  application: Application | undefined;
}

export default function ApplicationDetail({ application }: ApplicationDetailProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState<string[]>(application?.notes || []);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    if (!application) return;
    startTransition(async () => {
      await deleteApplicationAndRedirect(application.id);
    });
  };

  if (!application) {
    return (
      <Box className="text-center py-16">
        <Heading level={2} className="mb-4">
          {UI_STRINGS.pages.applicationDetail.notFound}
        </Heading>
        <NextLink href={ROUTES.APPLICATIONS}>
          <Button variant="ghost" startIcon={<ArrowBackIcon />}>
            {UI_STRINGS.buttons.backToApplications}
          </Button>
        </NextLink>
      </Box>
    );
  }

  return (
    <Box>
      <ApplicationHeader
        positionTitle={application.positionTitle}
        company={application.company}
        outcome={application.outcome as OutcomeDisplayStatus}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={handleDelete}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        isPending={isPending}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ApplicationMetadata
            dateApplied={application.dateApplied}
            location={application.metadata.location}
            jobUrl={application.metadata.jobUrl}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <StageTimeline stages={application.stages} applicationId={application.id} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <SectionCard title="Notes">
            <AddNoteForm
              applicationId={application.id}
              currentNotes={notes}
              onNotesChange={setNotes}
            />
          </SectionCard>
        </Grid>
      </Grid>

      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent noPadding>
          <EditApplicationForm
            application={application}
            onSuccess={() => {
              setIsEditModalOpen(false);
              router.refresh();
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
