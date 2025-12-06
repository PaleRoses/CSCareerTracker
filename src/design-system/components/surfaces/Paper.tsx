"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiPaper from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  /** Elevation level (0-3) */
  elevation?: 0 | 1 | 2 | 3;
  /** Apply glassmorphism effect */
  glass?: boolean;
  /** Make the paper outlined instead of elevated */
  outlined?: boolean;
  /**
   * @deprecated Use className with Tailwind instead.
   */
  sx?: SxProps<Theme>;
}

const elevationClasses = {
  0: "",
  1: "shadow-sm",
  2: "shadow-md",
  3: "shadow-lg",
};

/**
 * Paper - A surface component for elevation
 *
 * A basic container component that provides elevation and background.
 * Use Card for more complex content groupings with actions.
 *
 * @example
 * <Paper elevation={2}>
 *   <Text>Elevated content</Text>
 * </Paper>
 *
 * @example
 * <Paper glass>
 *   <Text>Glass effect paper</Text>
 * </Paper>
 *
 * @example
 * <Paper outlined>
 *   <Text>Outlined paper</Text>
 * </Paper>
 */
export const Paper = forwardRef<HTMLDivElement, PaperProps>(
  (
    {
      children,
      className,
      elevation = 1,
      glass = false,
      outlined = false,
      sx,
      ...props
    },
    ref
  ) => {
    const paperClasses = cn(
      "rounded-lg",
      glass && "bg-background-glass backdrop-glass",
      !glass && "bg-background-paper",
      outlined && "border border-border",
      !outlined && elevationClasses[elevation],
      className
    );

    return (
      <MuiPaper
        ref={ref}
        elevation={0} // We handle elevation through Tailwind
        className={paperClasses}
        sx={sx}
        {...props}
      >
        {children}
      </MuiPaper>
    );
  }
);

Paper.displayName = "Paper";

export default Paper;
