"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Chip,
  DataTable,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Text,
  type ChipVariant,
  type ColumnDef,
  type CellRenderParams,
} from "@/design-system/components";
import { OpenInNewIcon, DeleteIcon } from "@/design-system/icons";
import { formatDate, capitalize } from "@/lib/utils";
import type { Job } from "../types";
import { JOB_TYPE_LABELS } from "../types";
import { removeJobAction } from "../actions";

interface JobsTableProps {
  jobs: Job[];
  canManageJobs?: boolean;
}

const JOB_TYPE_VARIANTS: Record<string, ChipVariant> = {
  'full-time': 'primary',
  'part-time': 'secondary',
  'internship': 'success',
  'contract': 'warning',
  'other': 'default',
};

export default function JobsTable({ jobs, canManageJobs = false }: JobsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [jobToRemove, setJobToRemove] = useState<Job | null>(null);
  const [_lastAction, setLastAction] = useState<'archived' | 'deleted' | null>(null);

  const handleRemoveJob = () => {
    if (!jobToRemove) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('jobId', jobToRemove.id);

      const result = await removeJobAction(undefined, formData);
      if (result.success && result.data) {
        setLastAction(result.data.action);
        router.refresh();
      } else {
        console.error('Failed to remove job:', result.error);
      }
      setJobToRemove(null);
    });
  };

  const columns: ColumnDef<Job>[] = [
    {
      id: "companyName",
      field: "companyName",
      headerName: "Company",
      flex: 1,
      minWidth: 150,
    },
    {
      id: "title",
      field: "title",
      headerName: "Position",
      flex: 1,
      minWidth: 200,
    },
    {
      id: "type",
      field: "type",
      headerName: "Type",
      width: 120,
      renderCell: (params: CellRenderParams<Job>) => {
        const jobType = params.value as string;
        return (
          <Chip
            label={JOB_TYPE_LABELS[jobType as keyof typeof JOB_TYPE_LABELS] || capitalize(jobType)}
            size="small"
            variant={JOB_TYPE_VARIANTS[jobType] || 'default'}
          />
        );
      },
    },
    {
      id: "locations",
      field: "locations",
      headerName: "Location",
      width: 180,
      valueGetter: (_value: unknown, row: Job) => {
        return row.locations.length > 0 ? row.locations[0] : "N/A";
      },
    },
    {
      id: "postedDate",
      field: "postedDate",
      headerName: "Posted",
      width: 120,
      valueFormatter: (value: unknown) => formatDate(value as string),
    },
    {
      id: "actions",
      field: "actions",
      headerName: "",
      width: canManageJobs ? 100 : 60,
      sortable: false,
      renderCell: (params: CellRenderParams<Job>) => {
        return (
          <div className="flex items-center gap-1">
            {params.row.url && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(params.row.url!, '_blank', 'noopener,noreferrer');
                }}
                aria-label="Open job posting"
                className="text-foreground/50 hover:text-primary hover:bg-primary/10"
              >
                <OpenInNewIcon />
              </IconButton>
            )}
            {canManageJobs && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setJobToRemove(params.row);
                }}
                aria-label="Remove job"
                className="text-foreground/50 hover:text-error hover:bg-error/10"
                disabled={isPending}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        rows={jobs}
        columns={columns}
        sortModel={[{ field: "postedDate", sort: "desc" }]}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
      />

      <Dialog
        open={!!jobToRemove}
        onClose={() => !isPending && setJobToRemove(null)}
      >
        <DialogTitle>Remove Job</DialogTitle>
        <DialogContent>
          <Text>
            Are you sure you want to remove{" "}
            <strong>{jobToRemove?.title}</strong> at{" "}
            <strong>{jobToRemove?.companyName}</strong>?
          </Text>
          <Text variant="body2" className="mt-2 text-foreground/60">
            If applications exist for this job, it will be archived (hidden but preserved).
            Otherwise, it will be permanently deleted.
          </Text>
        </DialogContent>
        <DialogActions>
          <Button
            variant="ghost"
            onClick={() => setJobToRemove(null)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRemoveJob}
            disabled={isPending}
            className="bg-error hover:bg-error/90"
          >
            {isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
