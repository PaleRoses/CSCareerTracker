"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DataTable,
  Dialog,
  DialogContent,
  IconButton,
  Text,
  type ColumnDef,
  type CellRenderParams,
} from "@/design-system/components";
import { OpenInNewIcon, EditIcon, DeleteIcon } from "@/design-system/icons";
import { ROUTES } from "@/config/routes";
import type { Company } from "../types";
import { DeleteCompanyDialog } from "./DeleteCompanyDialog";
import { CompanyForm } from "./CompanyForm";

interface CompaniesTableProps {
  companies: Company[];
  canManage?: boolean;
}

export default function CompaniesTable({ companies, canManage = false }: CompaniesTableProps) {
  const router = useRouter();
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);

  const handleEditSuccess = () => {
    setCompanyToEdit(null);
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setCompanyToDelete(null);
    router.refresh();
  };

  const columns: ColumnDef<Company>[] = [
    {
      id: "name",
      field: "name",
      headerName: "Company",
      flex: 1,
      minWidth: 200,
    },
    {
      id: "size",
      field: "size",
      headerName: "Size",
      width: 120,
      valueFormatter: (value: unknown) => {
        if (value === null || value === undefined) return "N/A";
        const size = value as number;
        if (size >= 10000) return `${Math.floor(size / 1000)}k+`;
        if (size >= 1000) return `${(size / 1000).toFixed(1)}k`;
        return String(size);
      },
    },
    {
      id: "locations",
      field: "locations",
      headerName: "Locations",
      flex: 1,
      minWidth: 180,
      valueGetter: (_value: unknown, row: Company) => {
        if (!row.locations || row.locations.length === 0) return "N/A";
        return row.locations.slice(0, 2).join(", ") +
          (row.locations.length > 2 ? ` +${row.locations.length - 2}` : "");
      },
    },
    {
      id: "jobCount",
      field: "jobCount",
      headerName: "Open Jobs",
      width: 120,
      renderCell: (params: CellRenderParams<Company>) => {
        const count = params.value as number | undefined;
        return (
          <Text
            variant="body2"
            className={count && count > 0 ? "text-success font-medium" : "text-foreground/60"}
          >
            {count ?? 0}
          </Text>
        );
      },
    },
    {
      id: "actions",
      field: "actions",
      headerName: "",
      width: canManage ? 140 : 60,
      sortable: false,
      renderCell: (params: CellRenderParams<Company>) => {
        return (
          <div className="flex items-center gap-1">
            {params.row.website && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(params.row.website!, '_blank', 'noopener,noreferrer');
                }}
                aria-label="Visit company website"
                className="text-foreground/50 hover:text-primary hover:bg-primary/10"
              >
                <OpenInNewIcon />
              </IconButton>
            )}
            {canManage && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCompanyToEdit(params.row);
                  }}
                  aria-label="Edit company"
                  className="text-foreground/50 hover:text-primary hover:bg-primary/10"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCompanyToDelete(params.row);
                  }}
                  aria-label="Delete company"
                  className="text-foreground/50 hover:text-error hover:bg-error/10"
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

  return (
    <>
      <DataTable
        rows={companies}
        columns={columns}
        sortModel={[{ field: "name", sort: "asc" }]}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
        onRowClick={(row) => {
          router.push(ROUTES.companyDetail(String(row.id)));
        }}
      />

      {/* Edit Dialog */}
      <Dialog
        open={!!companyToEdit}
        onClose={() => setCompanyToEdit(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent noPadding>
          <CompanyForm
            initialData={companyToEdit ?? undefined}
            onSuccess={handleEditSuccess}
            onCancel={() => setCompanyToEdit(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {companyToDelete && (
        <DeleteCompanyDialog
          open={!!companyToDelete}
          onClose={() => setCompanyToDelete(null)}
          companyId={companyToDelete.id}
          companyName={companyToDelete.name}
          jobCount={companyToDelete.jobCount ?? 0}
          onDeleted={handleDeleteSuccess}
        />
      )}
    </>
  );
}
