"use client";

import { forwardRef, type ReactNode } from "react";
import MuiAppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";
import { layout, colors, effects } from "@/design-system/tokens";

export interface AppBarProps {
  children: ReactNode;
  position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
  sidebarOffset?: boolean;
  className?: string;
  /** @deprecated Use className with Tailwind */
  sx?: SxProps<Theme>;
}

export const AppBar = forwardRef<HTMLDivElement, AppBarProps>(
  (
    {
      children,
      position = "fixed",
      sidebarOffset = false,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const appBarClasses = cn("glass-surface", className);

    const appBarSx: SxProps<Theme> = {
      ...(sidebarOffset && {
        width: `calc(100% - ${layout.sidebarWidth}px)`,
        ml: `${layout.sidebarWidth}px`,
      }),
      backgroundColor: colors.background.glassSidebar,
      backdropFilter: effects.backdropFilter.glass,
      WebkitBackdropFilter: effects.backdropFilter.glass,
      boxShadow: "none",
      ...sx,
    };

    return (
      <MuiAppBar
        ref={ref}
        position={position}
        className={appBarClasses}
        sx={appBarSx}
        {...props}
      >
        <MuiToolbar>{children}</MuiToolbar>
      </MuiAppBar>
    );
  }
);

AppBar.displayName = "AppBar";

export default AppBar;
