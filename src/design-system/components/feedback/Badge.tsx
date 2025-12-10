"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import MuiBadge, { type BadgeProps as MuiBadgeProps } from "@mui/material/Badge";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error";

type MuiBadgeColor = NonNullable<MuiBadgeProps["color"]>;

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "content"> {
  children: ReactNode;
  content?: number | string;
  variant?: BadgeVariant;
  max?: number;
  dot?: boolean;
  invisible?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

const variantColorMap: Record<BadgeVariant, MuiBadgeColor> = {
  default: "default",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  error: "error",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, content, variant = "default", max = 99, dot = false, invisible = false, className, sx }, ref) => {
    return (
      <MuiBadge
        ref={ref}
        badgeContent={content}
        color={variantColorMap[variant] as MuiBadgeProps["color"]}
        max={max}
        variant={dot ? "dot" : "standard"}
        invisible={invisible}
        className={cn(className)}
        sx={sx}
      >
        {children}
      </MuiBadge>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
