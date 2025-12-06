"use client";

import { forwardRef, type HTMLAttributes } from "react";
import MuiLinearProgress from "@mui/material/LinearProgress";
import MuiCircularProgress from "@mui/material/CircularProgress";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";
import { colors } from "@/design-system/tokens";

export interface LinearProgressProps extends HTMLAttributes<HTMLSpanElement> {
  value?: number;
  variant?: "determinate" | "indeterminate" | "buffer" | "query";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  className?: string;
  /** @deprecated Use className with Tailwind */
  sx?: SxProps<Theme>;
}

export const LinearProgress = forwardRef<HTMLSpanElement, LinearProgressProps>(
  ({ value, variant = "indeterminate", color = "primary", className, sx, ...props }, ref) => {
    return (
      <MuiLinearProgress
        ref={ref}
        value={value}
        variant={variant}
        color={color}
        className={cn("rounded-full", className)}
        sx={{ backgroundColor: colors.background.glassSubtle, "& .MuiLinearProgress-bar": { borderRadius: "9999px" }, ...sx }}
        {...props}
      />
    );
  }
);

LinearProgress.displayName = "LinearProgress";

export type CircularProgressSize = "sm" | "md" | "lg";

const circleSizeMap: Record<CircularProgressSize, number> = { sm: 20, md: 40, lg: 56 };

export interface CircularProgressProps extends HTMLAttributes<HTMLSpanElement> {
  value?: number;
  variant?: "determinate" | "indeterminate";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: CircularProgressSize | number;
  thickness?: number;
  className?: string;
  /** @deprecated Use className with Tailwind */
  sx?: SxProps<Theme>;
}

export const CircularProgress = forwardRef<HTMLSpanElement, CircularProgressProps>(
  ({ value, variant = "indeterminate", color = "primary", size = "md", thickness = 3.6, className, sx, ...props }, ref) => {
    const computedSize = typeof size === "number" ? size : circleSizeMap[size];
    return (
      <MuiCircularProgress
        ref={ref}
        value={value}
        variant={variant}
        color={color}
        size={computedSize}
        thickness={thickness}
        className={cn(className)}
        sx={sx}
        {...props}
      />
    );
  }
);

CircularProgress.displayName = "CircularProgress";

export default LinearProgress;
