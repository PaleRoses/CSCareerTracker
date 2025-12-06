"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import MuiIconButton from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export type IconButtonVariant = "default" | "primary" | "secondary" | "ghost";
export type IconButtonSize = "small" | "medium" | "large";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children: ReactNode;
  /** Button style variant */
  variant?: IconButtonVariant;
  /** Button size */
  size?: IconButtonSize;
  /** Accessible label for screen readers */
  "aria-label": string;
  /** Additional class names */
  className?: string;
  /**
   * @deprecated Use className with Tailwind instead.
   */
  sx?: SxProps<Theme>;
}

const variantClasses: Record<IconButtonVariant, string> = {
  default: "text-foreground-secondary hover:text-foreground hover:bg-background-glass",
  primary: "text-primary hover:bg-primary-subtle",
  secondary: "text-secondary hover:bg-secondary-subtle",
  ghost: "text-foreground-muted hover:text-foreground hover:bg-transparent",
};

const sizeClasses: Record<IconButtonSize, string> = {
  small: "p-1",
  medium: "p-2",
  large: "p-3",
};

/**
 * IconButton - A button containing only an icon
 *
 * Always provide an aria-label for accessibility.
 *
 * @example
 * <IconButton aria-label="Close" onClick={handleClose}>
 *   <CloseIcon />
 * </IconButton>
 *
 * @example
 * <IconButton variant="primary" aria-label="Add item" size="large">
 *   <AddIcon />
 * </IconButton>
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      variant = "default",
      size = "medium",
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const iconButtonClasses = cn(
      variantClasses[variant],
      sizeClasses[size],
      "rounded-lg transition-fast",
      className
    );

    return (
      <MuiIconButton
        ref={ref}
        className={iconButtonClasses}
        sx={sx}
        {...props}
      >
        {children}
      </MuiIconButton>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
