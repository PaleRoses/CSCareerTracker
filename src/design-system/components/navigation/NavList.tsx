"use client";

import { forwardRef, type ReactNode } from "react";
import MuiList from "@mui/material/List";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface NavListProps {
  children: ReactNode;
  title?: string;
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * NavList - A container for NavLink components
 *
 * @example
 * <NavList>
 *   <NavLink label="Dashboard" icon={<DashboardIcon />} active />
 *   <NavLink label="Settings" icon={<SettingsIcon />} />
 * </NavList>
 *
 * @example
 * <NavList title="Main Menu">
 *   <NavLink label="Home" icon={<HomeIcon />} />
 *   <NavLink label="Profile" icon={<ProfileIcon />} />
 * </NavList>
 */
export const NavList = forwardRef<HTMLUListElement, NavListProps>(
  ({ children, title, className, sx, ...props }, ref) => {
    return (
      <MuiList
        ref={ref}
        className={cn(className)}
        sx={sx}
        subheader={
          title ? (
            <li className="text-foreground-muted text-xs uppercase tracking-wider px-4 py-2">
              {title}
            </li>
          ) : undefined
        }
        {...props}
      >
        {children}
      </MuiList>
    );
  }
);

NavList.displayName = "NavList";

export default NavList;
