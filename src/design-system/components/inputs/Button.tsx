"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import MuiButton from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "gradient"
  | "outlined"
  | "ghost"
  | "danger";

export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  className?: string;
  /** @deprecated Use className with Tailwind */
  sx?: SxProps<Theme>;
}

const variantConfig: Record<
  ButtonVariant,
  { muiVariant: "contained" | "outlined" | "text"; className: string }
> = {
  primary: {
    muiVariant: "contained",
    className: "bg-primary text-background hover:bg-primary-hover",
  },
  secondary: {
    muiVariant: "contained",
    className: "bg-secondary text-background hover:bg-secondary-hover",
  },
  gradient: {
    muiVariant: "contained",
    className: "btn-gradient-primary",
  },
  outlined: {
    muiVariant: "outlined",
    className: "border-border text-foreground hover:bg-background-glass",
  },
  ghost: {
    muiVariant: "text",
    className: "text-foreground hover:bg-background-glass",
  },
  danger: {
    muiVariant: "contained",
    className: "bg-error text-white hover:bg-error/90",
  },
};

const sizeConfig: Record<ButtonSize, string> = {
  small: "text-sm py-1 px-3",
  medium: "py-2 px-4",
  large: "text-lg py-3 px-6",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      fullWidth = false,
      startIcon,
      endIcon,
      loading = false,
      disabled,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const config = variantConfig[variant];

    const buttonClasses = cn(
      config.className,
      sizeConfig[size],
      "font-semibold rounded-lg transition-default",
      fullWidth && "w-full",
      (disabled || loading) && "opacity-50 cursor-not-allowed",
      className
    );

    return (
      <MuiButton
        ref={ref}
        variant={config.muiVariant}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        startIcon={loading ? undefined : startIcon}
        endIcon={loading ? undefined : endIcon}
        className={buttonClasses}
        sx={{
          background: variant === "gradient" ? undefined : "transparent",
          ...sx,
        }}
        {...props}
      >
        {loading ? "Loading..." : children}
      </MuiButton>
    );
  }
);

Button.displayName = "Button";

export default Button;
