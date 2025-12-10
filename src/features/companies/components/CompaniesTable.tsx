"use client";

import { useRouter } from "next/navigation";
import {
  DataTable,
  IconButton,
  Text,
  type ColumnDef,
  type CellRenderParams,
} from "@/design-system/components";
import { OpenInNewIcon } from "@/design-system/icons";
import { ROUTES } from "@/config/routes";
import type { Company } from "../types";

interface CompaniesTableProps {
  companies: Company[];
}

export default function CompaniesTable({ companies }: CompaniesTableProps) {
  const router = useRouter();

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
      id: "website",
      field: "website",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: (params: CellRenderParams<Company>) => {
        if (!params.row.website) return null;
        return (
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
        );
      },
    },
  ];

  return (
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
  );
}
