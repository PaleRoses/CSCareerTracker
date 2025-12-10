"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiTypography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export type TextVariant =
  | "body1"
  | "body2"
  | "caption"
  | "overline";

export type TextColor =
  | "primary"
  | "secondary"
  | "muted"
  | "error"
  | "success"
  | "warning";

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  children?: ReactNode;
  className?: string;
  variant?: TextVariant;
  color?: TextColor;
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  truncate?: boolean;
  as?: "p" | "span" | "div" | "label";
  sx?: SxProps<Theme>;
}

const colorMap: Record<TextColor, string> = {
  primary: "text-foreground",
  secondary: "text-foreground-secondary",
  muted: "text-foreground-muted",
  error: "text-error",
  success: "text-success",
  warning: "text-warning",
};

const weightMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const muiVariantMap: Record<TextVariant, "body1" | "body2" | "caption" | "overline"> = {
  body1: "body1",
  body2: "body2",
  caption: "caption",
  overline: "overline",
};

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      children,
      className,
      variant = "body1",
      color = "primary",
      weight,
      align,
      truncate = false,
      as = "p",
      sx,
      ...props
    },
    ref
  ) => {
    const textClasses = cn(
      colorMap[color],
      weight && weightMap[weight],
      align && alignMap[align],
      truncate && "truncate",
      className
    );

    return (
      <MuiTypography
        ref={ref}
        component={as}
        variant={muiVariantMap[variant]}
        className={textClasses}
        sx={sx}
        {...props}
      >
        {children}
      </MuiTypography>
    );
  }
);

Text.displayName = "Text";

export default Text;
