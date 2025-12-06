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
  /** Text style variant */
  variant?: TextVariant;
  /** Text color */
  color?: TextColor;
  /** Font weight */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Truncate text with ellipsis */
  truncate?: boolean;
  /** HTML element to render */
  as?: "p" | "span" | "div" | "label";
  /**
   * @deprecated Use className with Tailwind instead.
   */
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

/**
 * Text - A typography primitive for body text
 *
 * Use this for paragraphs, labels, captions, and other body text.
 * For headings, use the Heading component.
 *
 * @example
 * <Text>Default body text</Text>
 *
 * @example
 * <Text variant="caption" color="secondary">
 *   Secondary caption text
 * </Text>
 *
 * @example
 * <Text weight="semibold" truncate>
 *   This text will be truncated if too long...
 * </Text>
 */
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
