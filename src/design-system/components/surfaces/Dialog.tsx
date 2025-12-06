"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiDialog from "@mui/material/Dialog";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogActions from "@mui/material/DialogActions";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
  className?: string;
  glass?: boolean;
  /** @deprecated Use className with Tailwind instead. */
  sx?: SxProps<Theme>;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      children,
      maxWidth = "sm",
      fullWidth = true,
      className,
      glass = true,
      sx,
    },
    ref
  ) => {
    return (
      <MuiDialog
        ref={ref}
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        className={className}
        slotProps={{
          paper: {
            className: cn(
              glass && "glass-card",
              "!bg-background-glass !backdrop-blur-xl"
            ),
            sx: glass
              ? {
                  backgroundImage: "none",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                }
              : undefined,
          },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
        sx={sx}
      >
        {children}
      </MuiDialog>
    );
  }
);

Dialog.displayName = "Dialog";

export interface DialogTitleProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  /** @deprecated Use className with Tailwind instead. */
  sx?: SxProps<Theme>;
}

export const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
  ({ children, className, sx, ...props }, ref) => {
    return (
      <MuiDialogTitle
        ref={ref}
        className={cn("text-text-primary font-semibold", className)}
        sx={sx}
        {...props}
      >
        {children}
      </MuiDialogTitle>
    );
  }
);

DialogTitle.displayName = "DialogTitle";

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  noPadding?: boolean;
  /** @deprecated Use className with Tailwind instead. */
  sx?: SxProps<Theme>;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, noPadding = false, sx, ...props }, ref) => {
    return (
      <MuiDialogContent
        ref={ref}
        className={cn(noPadding && "!p-0", className)}
        sx={sx}
        {...props}
      >
        {children}
      </MuiDialogContent>
    );
  }
);

DialogContent.displayName = "DialogContent";

export interface DialogActionsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  /** @deprecated Use className with Tailwind instead. */
  sx?: SxProps<Theme>;
}

export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(
  ({ children, className, sx, ...props }, ref) => {
    return (
      <MuiDialogActions
        ref={ref}
        className={cn("gap-2", className)}
        sx={sx}
        {...props}
      >
        {children}
      </MuiDialogActions>
    );
  }
);

DialogActions.displayName = "DialogActions";

export default Dialog;
