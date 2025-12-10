"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiBox from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  align?: "start" | "center" | "end" | "stretch";
  sx?: SxProps<Theme>;
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      className,
      direction = "vertical",
      gap = 4,
      align,
      sx,
      ...props
    },
    ref
  ) => {
    const stackClasses = cn(
      "flex",
      direction === "vertical" ? "flex-col" : "flex-row",
      gap !== undefined && `gap-${gap}`,
      align && alignMap[align],
      className
    );

    return (
      <MuiBox ref={ref} className={stackClasses} sx={sx} {...props}>
        {children}
      </MuiBox>
    );
  }
);

Stack.displayName = "Stack";

export default Stack;
