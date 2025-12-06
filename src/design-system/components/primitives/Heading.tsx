"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiTypography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  className?: string;
  /** Heading level (1-6) */
  level?: HeadingLevel;
  /** Apply gradient text effect */
  gradient?: boolean;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /**
   * @deprecated Use className with Tailwind instead.
   */
  sx?: SxProps<Theme>;
}

const levelMap: Record<HeadingLevel, { component: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }> = {
  1: { component: "h1", variant: "h1" },
  2: { component: "h2", variant: "h2" },
  3: { component: "h3", variant: "h3" },
  4: { component: "h4", variant: "h4" },
  5: { component: "h5", variant: "h5" },
  6: { component: "h6", variant: "h6" },
};

const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * Heading - A typography primitive for headings
 *
 * Renders semantic heading elements (h1-h6) with consistent styling.
 * Supports gradient text effect for branding.
 *
 * @example
 * <Heading level={1}>Page Title</Heading>
 *
 * @example
 * <Heading level={2} gradient>
 *   Gradient Section Title
 * </Heading>
 *
 * @example
 * <Heading level={3} align="center">
 *   Centered Heading
 * </Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      children,
      className,
      level = 2,
      gradient = false,
      align,
      sx,
      ...props
    },
    ref
  ) => {
    const { component, variant } = levelMap[level];

    const headingClasses = cn(
      "text-foreground",
      gradient && "text-gradient-primary",
      align && alignMap[align],
      className
    );

    return (
      <MuiTypography
        ref={ref}
        component={component}
        variant={variant}
        className={headingClasses}
        sx={sx}
        {...props}
      >
        {children}
      </MuiTypography>
    );
  }
);

Heading.displayName = "Heading";

export default Heading;
