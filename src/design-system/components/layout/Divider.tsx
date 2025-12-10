"use client";

import { forwardRef } from "react";
import MuiDivider from "@mui/material/Divider";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  flexItem?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = "horizontal", flexItem = false, className, sx, ...props }, ref) => {
    return (
      <MuiDivider
        ref={ref}
        orientation={orientation}
        flexItem={flexItem}
        className={cn(className)}
        sx={{
          borderColor: "var(--color-border-muted)",
          ...sx,
        }}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export default Divider;
