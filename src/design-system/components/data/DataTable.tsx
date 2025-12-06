"use client";

import { useMemo } from "react";
import { DataGrid, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import { Box } from "../primitives/Box";
import type {
  DataTableProps,
  ColumnDef,
  CellRenderParams,
  RowClickParams,
} from "./DataTable.types";
import { colors } from "@/design-system/tokens";

const dataGridStyles = {
  border: `1px solid ${colors.border.subtle}`,
  backgroundColor: colors.background.glassFaint,
  borderRadius: "var(--radius-lg)",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: colors.background.glassSubtle,
    borderBottom: `1px solid ${colors.border.subtle}`,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
    color: colors.text.primary,
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${colors.border.faint}`,
    color: colors.text.secondary,
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: colors.background.glassSubtle,
  },
  "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: colors.primary.subtle,
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${colors.border.subtle}`,
  },
  "& .MuiTablePagination-root": {
    color: colors.text.secondary,
  },
  "& .MuiTablePagination-selectIcon": {
    color: colors.text.secondary,
  },
};

function toGridColumns<TData>(columns: ColumnDef<TData>[]): GridColDef[] {
  return columns.map((col, _index) => ({
    field: String(col.field),
    headerName: col.headerName,
    width: col.width,
    minWidth: col.minWidth,
    flex: col.flex,
    sortable: col.sortable ?? true,
    filterable: col.filterable ?? true,
    align: col.align,
    headerAlign: col.align,
    renderCell: col.renderCell
      ? (params) =>
          col.renderCell!({
            value: params.value,
            row: params.row as TData,
            field: String(col.field),
            rowIndex: params.api.getRowIndexRelativeToVisibleRows(params.id),
          } as CellRenderParams<TData>)
      : undefined,
    valueFormatter: col.valueFormatter
      ? (value) => col.valueFormatter!(value)
      : undefined,
    valueGetter: col.valueGetter
      ? (value, row) => col.valueGetter!(value, row as TData)
      : undefined,
  }));
}

export function DataTable<TData extends { id: string | number }>({
  rows,
  columns,
  getRowId,
  pagination: _pagination = true,
  paginationModel,
  pageSizeOptions = [5, 10, 25],
  onPaginationModelChange: _onPaginationModelChange,
  sortModel,
  onSortModelChange: _onSortModelChange,
  selectable = false,
  selectedRows,
  onSelectionChange,
  onRowClick,
  onRowDoubleClick,
  height = 500,
  className,
  clickableRows = true,
  loading = false,
  emptyMessage = "No data available",
}: DataTableProps<TData>) {
  const gridColumns = useMemo(() => toGridColumns(columns), [columns]);

  const handleRowClick = (params: GridRowParams<TData>) => {
    onRowClick?.({
      id: params.id,
      row: params.row,
    } as RowClickParams<TData>);
  };

  const handleRowDoubleClick = (params: GridRowParams<TData>) => {
    onRowDoubleClick?.({
      id: params.id,
      row: params.row,
    } as RowClickParams<TData>);
  };

  return (
    <Box
      className={className}
      sx={{
        height,
        width: "100%",
        ...dataGridStyles,
        ...(clickableRows && onRowClick && {
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }),
      }}
    >
      <DataGrid
        rows={rows}
        columns={gridColumns}
        getRowId={getRowId}
        loading={loading}
        disableRowSelectionOnClick={!selectable}
        checkboxSelection={selectable}
        rowSelectionModel={
          selectedRows
            ? { type: "include" as const, ids: new Set(selectedRows) }
            : undefined
        }
        onRowSelectionModelChange={
          onSelectionChange
            ? (newSelection) => {
                const ids = newSelection.type === "include"
                  ? Array.from(newSelection.ids)
                  : [];
                onSelectionChange(ids as (string | number)[]);
              }
            : undefined
        }
        initialState={{
          pagination: paginationModel
            ? { paginationModel }
            : { paginationModel: { pageSize: 10, page: 0 } },
          sorting: sortModel
            ? { sortModel: sortModel.map((s) => ({ field: s.field, sort: s.sort })) }
            : undefined,
        }}
        pageSizeOptions={pageSizeOptions}
        onRowClick={onRowClick ? handleRowClick : undefined}
        onRowDoubleClick={onRowDoubleClick ? handleRowDoubleClick : undefined}
        localeText={{
          noRowsLabel: emptyMessage,
        }}
        sx={{
          border: "none", // We apply border on the container
        }}
      />
    </Box>
  );
}

export default DataTable;
