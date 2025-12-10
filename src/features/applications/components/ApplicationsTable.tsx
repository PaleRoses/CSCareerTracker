"use client";

import { useCallback } from "react";
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
  type RowClickParams,
} from "@/design-system/components";
import { DeleteIcon } from "@/design-system/icons";
import { formatDate, capitalize } from "@/lib/utils";
import type { Application } from "@/features/applications/types";
import { OUTCOME_TO_CHIP_VARIANT, isOutcomeDisplayStatus } from "../constants";
import { getCurrentStage, getChipVariant } from "../utils/status-utils";
import { TABLE_COLUMNS, TABLE_PAGINATION } from "../config";
import { ROUTES } from "@/config/routes";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import { deleteApplication } from "../actions/delete-application.action";
import { useDeleteConfirmation } from "@/features/shared/hooks";

interface ApplicationsTableProps {
  applications: Application[];
}

export default function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const router = useRouter();

  const handleDeleteApplication = useCallback(
    async (application: Application) => {
      const result = await deleteApplication(application.id);
      if (result.success) {
        router.refresh();
      }
    },
    [router]
  );

  const {
    itemToDelete,
    isOpen: isDeleteDialogOpen,
    isPending,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation(handleDeleteApplication);

  const handleRowClick = (params: RowClickParams<Application>) => {
    router.push(ROUTES.applicationDetail(String(params.id)));
  };

  const handleDeleteClick = (application: Application, e: React.MouseEvent) => {
    e.stopPropagation();
    requestDelete(application);
  };

  const columns: ColumnDef<Application>[] = [
    {
      id: "company",
      field: "company",
      headerName: UI_STRINGS.tables.applications.company,
      flex: 1,
      minWidth: TABLE_COLUMNS.company.minWidth,
    },
    {
      id: "positionTitle",
      field: "positionTitle",
      headerName: UI_STRINGS.tables.applications.position,
      flex: 1,
      minWidth: TABLE_COLUMNS.position.minWidth,
    },
    {
      id: "dateApplied",
      field: "dateApplied",
      headerName: UI_STRINGS.tables.applications.dateApplied,
      width: TABLE_COLUMNS.dateApplied.width,
      valueFormatter: (value: unknown) => formatDate(value as string),
    },
    {
      id: "currentStage",
      field: "currentStage",
      headerName: UI_STRINGS.tables.applications.currentStage,
      width: TABLE_COLUMNS.currentStage.width,
      renderCell: (params: CellRenderParams<Application>) => {
        const stage = getCurrentStage(params.row.stages);
        const stageVariant = stage?.status ? getChipVariant(stage.status) : "default";
        return (
          <Chip
            label={stage?.name || "N/A"}
            size="small"
            variant={stageVariant}
          />
        );
      },
    },
    {
      id: "outcome",
      field: "outcome",
      headerName: UI_STRINGS.tables.applications.outcome,
      width: TABLE_COLUMNS.outcome.width,
      renderCell: (params: CellRenderParams<Application>) => {
        const outcome = isOutcomeDisplayStatus(params.value) ? params.value : "pending";
        const chipVariant = OUTCOME_TO_CHIP_VARIANT[outcome];
        return (
          <Chip
            label={capitalize(outcome)}
            size="small"
            variant={chipVariant}
          />
        );
      },
    },
    {
      id: "location",
      field: "location",
      headerName: UI_STRINGS.tables.applications.location,
      width: TABLE_COLUMNS.location.width,
      valueGetter: (_value: unknown, row: Application) => row.metadata?.location || "N/A",
    },
    {
      id: "actions",
      field: "actions",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: (params: CellRenderParams<Application>) => (
        <IconButton
          size="small"
          onClick={(e) => handleDeleteClick(params.row, e)}
          disabled={isPending}
          aria-label="Delete application"
          className="text-foreground/50 hover:text-error hover:bg-error/10"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <DataTable
        rows={applications}
        columns={columns}
        sortModel={[{ field: "dateApplied", sort: "desc" }]}
        pageSizeOptions={[...TABLE_PAGINATION.pageSizeOptions]}
        onRowClick={handleRowClick}
      />

      <Dialog open={isDeleteDialogOpen} onClose={cancelDelete} maxWidth="xs">
        <DialogTitle>Delete Application</DialogTitle>
        <DialogContent>
          <Text color="secondary">
            Are you sure you want to delete the application for{" "}
            <Text as="span" weight="semibold" color="primary">
              {itemToDelete?.positionTitle}
            </Text>{" "}
            at{" "}
            <Text as="span" weight="semibold" color="primary">
              {itemToDelete?.company}
            </Text>
            ? This action cannot be undone.
          </Text>
        </DialogContent>
        <DialogActions>
          <Button variant="ghost" onClick={cancelDelete} disabled={isPending}>
            {UI_STRINGS.buttons.cancel}
          </Button>
          <Button variant="danger" onClick={confirmDelete} loading={isPending}>
            {UI_STRINGS.buttons.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
