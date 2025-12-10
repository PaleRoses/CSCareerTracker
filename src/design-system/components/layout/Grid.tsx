"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiGrid from "@mui/material/Grid";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  container?: boolean;
  spacing?: number;
  /** Columns to span (1-12), "auto", or "grow" */
  size?:
    | number
    | "auto"
    | "grow"
    | {
        xs?: number | "auto" | "grow";
        sm?: number | "auto" | "grow";
        md?: number | "auto" | "grow";
        lg?: number | "auto" | "grow";
        xl?: number | "auto" | "grow";
      };
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * Grid - A responsive grid layout component
 *
 * Based on a 12-column grid system. MUI Grid v2 uses a `size` prop
 * instead of separate `xs`, `sm`, `md` props.
 *
 * @example
 * // Container with spacing
 * <Grid container spacing={3}>
 *   <Grid size={{ xs: 12, md: 6 }}>
 *     <Card>Half width on medium+</Card>
 *   </Grid>
 *   <Grid size={{ xs: 12, md: 6 }}>
 *     <Card>Half width on medium+</Card>
 *   </Grid>
 * </Grid>
 *
 * @example
 * // Responsive grid items
 * <Grid container spacing={2}>
 *   <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
 *     <StatCard />
 *   </Grid>
 * </Grid>
 *
 * @example
 * // Simple fixed size
 * <Grid container spacing={2}>
 *   <Grid size={6}>
 *     <Card>Always 6 columns</Card>
 *   </Grid>
 * </Grid>
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      container = false,
      spacing,
      size,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <MuiGrid
        ref={ref}
        container={container}
        spacing={spacing}
        size={size}
        className={cn(className)}
        sx={sx}
        {...props}
      >
        {children}
      </MuiGrid>
    );
  }
);

Grid.displayName = "Grid";

export default Grid;
