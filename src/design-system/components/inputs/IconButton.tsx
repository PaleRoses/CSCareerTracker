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
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  "aria-label": string;
  className?: string;
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
