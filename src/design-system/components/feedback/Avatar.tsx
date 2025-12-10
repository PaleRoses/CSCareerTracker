"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiAvatar from "@mui/material/Avatar";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<AvatarSize, { width: number; height: number; fontSize: string }> = {
  sm: { width: 24, height: 24, fontSize: "0.75rem" },
  md: { width: 40, height: 40, fontSize: "1rem" },
  lg: { width: 56, height: 56, fontSize: "1.25rem" },
  xl: { width: 80, height: 80, fontSize: "1.5rem" },
};

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  children?: ReactNode;
  size?: AvatarSize;
  variant?: "circular" | "rounded" | "square";
  className?: string;
  sx?: SxProps<Theme>;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      children,
      size = "md",
      variant = "circular",
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const sizeStyles = sizeMap[size];

    return (
      <MuiAvatar
        ref={ref}
        src={src}
        alt={alt}
        variant={variant}
        className={cn(className)}
        sx={{
          width: sizeStyles.width,
          height: sizeStyles.height,
          fontSize: sizeStyles.fontSize,
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiAvatar>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
