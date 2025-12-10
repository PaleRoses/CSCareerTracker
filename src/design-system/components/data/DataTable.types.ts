import type { ReactNode } from "react";

export interface ColumnDef<TData = unknown> {
  id: string;
  field: keyof TData | string;
  headerName: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  renderCell?: (params: CellRenderParams<TData>) => ReactNode;
  valueFormatter?: (value: unknown) => string;
  valueGetter?: (value: unknown, row: TData) => unknown;
}

export interface CellRenderParams<TData = unknown> {
  value: unknown;
  row: TData;
  field: string;
  rowIndex: number;
}

export interface RowClickParams<TData = unknown> {
  id: string | number;
  row: TData;
}

export interface SortModel {
  field: string;
  sort: "asc" | "desc" | null;
}

export interface PaginationModel {
  pageSize: number;
  page: number;
}

export interface DataTableProps<TData = unknown> {
  rows: TData[];
  columns: ColumnDef<TData>[];
  getRowId?: (row: TData) => string | number;
  pagination?: boolean;
  paginationModel?: PaginationModel;
  pageSizeOptions?: number[];
  onPaginationModelChange?: (model: PaginationModel) => void;
  sortModel?: SortModel[];
  onSortModelChange?: (model: SortModel[]) => void;
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  onRowClick?: (params: RowClickParams<TData>) => void;
  onRowDoubleClick?: (params: RowClickParams<TData>) => void;
  height?: number | string;
  className?: string;
  clickableRows?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export interface DataListProps<TData = unknown> {
  items: TData[];
  getKey?: (item: TData) => string | number;
  renderItem: (item: TData, index: number) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}
