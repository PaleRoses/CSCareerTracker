"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiBox from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  component?: React.ElementType;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, className, sx, component = "div", ...props }, ref) => {
    return (
      <MuiBox
        ref={ref}
        component={component}
        className={cn(className)}
        sx={sx}
        {...props}
      >
        {children}
      </MuiBox>
    );
  }
);

Box.displayName = "Box";

export default Box;
