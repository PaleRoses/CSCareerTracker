"use client";

import { forwardRef, type ReactNode } from "react";
import MuiDrawer from "@mui/material/Drawer";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";
import { layout, colors, effects } from "@/design-system/tokens";

export type DrawerAnchor = "left" | "right" | "top" | "bottom";
export type DrawerVariant = "permanent" | "persistent" | "temporary";

export interface DrawerProps {
  children: ReactNode;
  /** For temporary/persistent variants */
  open?: boolean;
  anchor?: DrawerAnchor;
  variant?: DrawerVariant;
  width?: number | string;
  onClose?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * Drawer - A slide-out panel component
 *
 * Use for sidebars, navigation menus, or slide-in panels.
 *
 * @example
 * // Permanent sidebar
 * <Drawer variant="permanent" width={260}>
 *   <NavList>...</NavList>
 * </Drawer>
 *
 * @example
 * // Temporary mobile drawer
 * <Drawer
 *   variant="temporary"
 *   open={mobileOpen}
 *   onClose={() => setMobileOpen(false)}
 * >
 *   <NavList>...</NavList>
 * </Drawer>
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      children,
      open = true,
      anchor = "left",
      variant = "permanent",
      width = layout.sidebarWidth,
      onClose,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const drawerClasses = cn("glass-surface", className);

    const drawerSx: SxProps<Theme> = {
      width,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width,
        boxSizing: "border-box",
        backgroundColor: colors.background.glassSidebar,
        backdropFilter: effects.backdropFilter.glass,
        WebkitBackdropFilter: effects.backdropFilter.glass,
      },
      ...sx,
    };

    return (
      <MuiDrawer
        ref={ref}
        variant={variant}
        anchor={anchor}
        open={open}
        onClose={onClose}
        className={drawerClasses}
        sx={drawerSx}
        {...props}
      >
        {children}
      </MuiDrawer>
    );
  }
);

Drawer.displayName = "Drawer";

export default Drawer;
