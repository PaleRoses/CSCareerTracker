"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiGrid from "@mui/material/Grid";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  container?: boolean;
  spacing?: number;
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
