"use client";

import { forwardRef } from "react";
import MuiChip, { type ChipProps as MuiChipProps } from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export type ChipVariant =
  | "default"
  | "offer"
  | "rejected"
  | "withdrawn"
  | "pending"
  | "inProgress"
  | "upcoming"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error";

export type ChipSize = "small" | "medium";

export interface ChipProps
  extends Omit<MuiChipProps, "variant" | "color" | "size"> {
  variant?: ChipVariant;
  size?: ChipSize;
  className?: string;
  /** @deprecated Use className with Tailwind */
  sx?: SxProps<Theme>;
}

const variantClasses: Record<ChipVariant, string> = {
  default: "bg-background-glass text-foreground",
  offer: "chip-offer",
  rejected: "chip-rejected",
  withdrawn: "chip-withdrawn",
  pending: "chip-pending",
  inProgress: "chip-in-progress",
  upcoming: "chip-upcoming",
  primary: "bg-primary-muted text-primary",
  secondary: "bg-secondary-muted text-secondary",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  error: "bg-error-muted text-error-text",
};

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ variant = "default", size = "small", className, sx, ...props }, ref) => {
    return (
      <MuiChip
        ref={ref}
        size={size}
        className={cn(variantClasses[variant], className)}
        sx={sx}
        {...props}
      />
    );
  }
);

Chip.displayName = "Chip";

export default Chip;
