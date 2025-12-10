"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiPaper from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  elevation?: 0 | 1 | 2 | 3;
  glass?: boolean;
  outlined?: boolean;
  sx?: SxProps<Theme>;
}

const elevationClasses = {
  0: "",
  1: "shadow-sm",
  2: "shadow-md",
  3: "shadow-lg",
};

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
