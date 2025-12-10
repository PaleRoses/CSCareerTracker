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
  type ColumnDef,
  type CellRenderParams,
} from "@/design-system/components";
import { OpenInNewIcon, DeleteIcon, EditIcon } from "@/design-system/icons";
import { formatDate, capitalize } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import type { Job } from "../types";
import { JOB_TYPE_LABELS } from "../types";
import { removeJobAction } from "../actions";
import { JOB_TYPE_VARIANTS } from "../constants";
import { EditJobModal, type CompanyOption } from "@/features/recruiter";

interface JobsTableProps {
  jobs: Job[];
  canManageJobs?: boolean;
  currentUserId?: string;
  /** Companies for the edit modal - required if canManageJobs is true */
  companies?: CompanyOption[];
}

export default function JobsTable({ jobs, canManageJobs = false, currentUserId, companies = [] }: JobsTableProps) {
  const canEditJob = (job: Job) => canManageJobs && job.postedBy === currentUserId;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [jobToRemove, setJobToRemove] = useState<Job | null>(null);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

  const handleRemoveJob = () => {
    if (!jobToRemove) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('jobId', jobToRemove.id);

      const result = await removeJobAction(undefined, formData);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to remove job. Please try again.');
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
      width: canManageJobs ? 140 : 60,
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
            {canEditJob(params.row) && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setJobToEdit(params.row);
                  }}
                  aria-label="Edit job"
                  className="text-foreground/50 hover:text-primary hover:bg-primary/10"
                >
                  <EditIcon />
                </IconButton>
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
              </>
            )}
          </div>
        );
      },
    },
  ];

  const handleRowClick = (job: Job) => {
    if (canManageJobs) {
      router.push(ROUTES.recruiter.candidates(job.id));
    }
  };

  return (
    <>
      <DataTable
        rows={jobs}
        columns={columns}
        sortModel={[{ field: "postedDate", sort: "desc" }]}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
        onRowClick={canManageJobs ? (params) => handleRowClick(params.row) : undefined}
        className={canManageJobs ? "[&_.MuiDataGrid-row]:cursor-pointer" : undefined}
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

      {jobToEdit && (
        <EditJobModal
          open={!!jobToEdit}
          onClose={() => setJobToEdit(null)}
          companies={companies}
          job={jobToEdit}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
