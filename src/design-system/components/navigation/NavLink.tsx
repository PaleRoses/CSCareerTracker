"use client";

import { forwardRef, type ReactNode } from "react";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiListItemText from "@mui/material/ListItemText";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface NavLinkProps {
  children?: ReactNode;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

export const NavLink = forwardRef<HTMLDivElement, NavLinkProps>(
  ({ label, icon, active = false, onClick, className, sx, ...props }, ref) => {
    const navLinkClasses = cn(
      "nav-item",
      active && "nav-item-active",
      className
    );

    const navLinkSx: SxProps<Theme> = {
      borderRadius: 2,
      py: 1.25,
      px: 1.5,
      mb: 0.5,
      ...(active && {
        backgroundColor: "rgba(110, 231, 255, 0.12)",
        "&:hover": {
          backgroundColor: "rgba(110, 231, 255, 0.18)",
        },
      }),
      ...(!active && {
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
      }),
      ...sx,
    };

    return (
      <MuiListItemButton
        ref={ref}
        onClick={onClick}
        className={navLinkClasses}
        sx={navLinkSx}
        {...props}
      >
        {icon && (
          <MuiListItemIcon
            sx={{
              minWidth: 40,
              color: active ? "primary.main" : "rgba(255, 255, 255, 0.2)",
            }}
          >
            {icon}
          </MuiListItemIcon>
        )}
        <MuiListItemText
          primary={label}
          primaryTypographyProps={{
            sx: {
              fontWeight: active ? 600 : 400,
              color: active ? "primary.main" : "text.secondary",
              fontSize: "0.9rem",
            },
          }}
        />
      </MuiListItemButton>
    );
  }
);

NavLink.displayName = "NavLink";

export default NavLink;
