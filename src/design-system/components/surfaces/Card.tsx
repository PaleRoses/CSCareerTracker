"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiCard from "@mui/material/Card";
import MuiCardContent from "@mui/material/CardContent";
import MuiCardHeader from "@mui/material/CardHeader";
import MuiCardActions from "@mui/material/CardActions";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  glass?: boolean;
  hoverable?: boolean;
  flat?: boolean;
  sx?: SxProps<Theme>;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, glass = true, hoverable = true, flat = false, sx, ...props }, ref) => {
    const cardClasses = cn(
      !flat && glass && "glass-card",
      !flat && !hoverable && "glass-card-static",
      flat && "bg-background-glass border border-border rounded-lg",
      className
    );

    const cardSx = flat ? sx : { background: "transparent", ...sx };

    return (
      <MuiCard ref={ref} className={cardClasses} sx={cardSx} {...props}>
        {children}
      </MuiCard>
    );
  }
);

Card.displayName = "Card";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  noPadding?: boolean;
  sx?: SxProps<Theme>;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, noPadding = false, sx, ...props }, ref) => {
    return (
      <MuiCardContent ref={ref} className={cn(noPadding && "!p-0", className)} sx={sx} {...props}>
        {children}
      </MuiCardContent>
    );
  }
);

CardContent.displayName = "CardContent";

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className, sx, ...props }, ref) => {
    return (
      <MuiCardHeader
        ref={ref}
        title={title}
        subheader={subtitle}
        action={action}
        className={cn(className)}
        sx={sx}
        {...props}
      />
    );
  }
);

CardHeader.displayName = "CardHeader";

export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  alignRight?: boolean;
  sx?: SxProps<Theme>;
}

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, className, alignRight = false, sx, ...props }, ref) => {
    return (
      <MuiCardActions ref={ref} className={cn(alignRight && "justify-end", className)} sx={sx} {...props}>
        {children}
      </MuiCardActions>
    );
  }
);

CardActions.displayName = "CardActions";

export default Card;
