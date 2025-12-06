"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiBox from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  wrap?: boolean;
  inline?: boolean;
  /** @deprecated Use className with Tailwind */
  sx?: SxProps<Theme>;
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const directionMap = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      className,
      direction = "row",
      align,
      justify,
      gap,
      wrap = false,
      inline = false,
      sx,
      ...props
    },
    ref
  ) => {
    const flexClasses = cn(
      inline ? "inline-flex" : "flex",
      directionMap[direction],
      align && alignMap[align],
      justify && justifyMap[justify],
      gap !== undefined && `gap-${gap}`,
      wrap && "flex-wrap",
      className
    );

    return (
      <MuiBox ref={ref} className={flexClasses} sx={sx} {...props}>
        {children}
      </MuiBox>
    );
  }
);

Flex.displayName = "Flex";

export default Flex;
