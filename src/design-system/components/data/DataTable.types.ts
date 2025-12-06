/**
 * DataTable Type Definitions
 *
 * Abstract interfaces for data table functionality.
 * These types are implementation-agnostic, allowing the underlying
 * library (MUI DataGrid, TanStack Table, etc.) to be swapped.
 */

import type { ReactNode } from "react";

/**
 * Column definition for a data table.
 * Maps to various table library column configs.
 */
export interface ColumnDef<TData = unknown> {
  /** Unique identifier for the column */
  id: string;
  /** Field name in the data object */
  field: keyof TData | string;
  /** Display name in the column header */
  headerName: string;
  /** Fixed width in pixels */
  width?: number;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Flex grow factor (1 = take remaining space) */
  flex?: number;
  /** Allow sorting on this column */
  sortable?: boolean;
  /** Allow filtering on this column */
  filterable?: boolean;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Custom cell renderer */
  renderCell?: (params: CellRenderParams<TData>) => ReactNode;
  /** Format the value for display */
  valueFormatter?: (value: unknown) => string;
  /** Compute a derived value from the row */
  valueGetter?: (value: unknown, row: TData) => unknown;
}

/**
 * Parameters passed to custom cell renderers.
 */
export interface CellRenderParams<TData = unknown> {
  /** The cell value */
  value: unknown;
  /** The full row data */
  row: TData;
  /** The field name */
  field: string;
  /** Row index */
  rowIndex: number;
}

/**
 * Parameters passed to row click handlers.
 */
export interface RowClickParams<TData = unknown> {
  /** Row identifier */
  id: string | number;
  /** The full row data */
  row: TData;
}

/**
 * Sort model for the table.
 */
export interface SortModel {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  sort: "asc" | "desc" | null;
}

/**
 * Pagination model for the table.
 */
export interface PaginationModel {
  /** Number of rows per page */
  pageSize: number;
  /** Current page index (0-based) */
  page: number;
}

/**
 * Props for the DataTable component.
 */
export interface DataTableProps<TData = unknown> {
  /** Array of row data */
  rows: TData[];
  /** Column definitions */
  columns: ColumnDef<TData>[];
  /** Function to get a unique ID from each row */
  getRowId?: (row: TData) => string | number;
  /** Enable pagination */
  pagination?: boolean;
  /** Initial pagination settings */
  paginationModel?: PaginationModel;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Handler for pagination changes */
  onPaginationModelChange?: (model: PaginationModel) => void;
  /** Initial sort model */
  sortModel?: SortModel[];
  /** Handler for sort changes */
  onSortModelChange?: (model: SortModel[]) => void;
  /** Enable row selection */
  selectable?: boolean;
  /** Currently selected row IDs */
  selectedRows?: (string | number)[];
  /** Handler for selection changes */
  onSelectionChange?: (ids: (string | number)[]) => void;
  /** Handler for row click */
  onRowClick?: (params: RowClickParams<TData>) => void;
  /** Handler for row double click */
  onRowDoubleClick?: (params: RowClickParams<TData>) => void;
  /** Table height */
  height?: number | string;
  /** Additional class names */
  className?: string;
  /** Make rows clickable (cursor pointer) */
  clickableRows?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Props for simple List-based data display (not a full table).
 */
export interface DataListProps<TData = unknown> {
  /** Array of items */
  items: TData[];
  /** Function to get a unique key from each item */
  getKey?: (item: TData) => string | number;
  /** Render function for each item */
  renderItem: (item: TData, index: number) => ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional class names */
  className?: string;
}
