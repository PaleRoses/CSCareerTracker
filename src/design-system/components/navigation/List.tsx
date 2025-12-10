"use client";

import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from "react";
import MuiList from "@mui/material/List";
import MuiListItem from "@mui/material/ListItem";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiListItemText from "@mui/material/ListItemText";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
  dense?: boolean;
  disablePadding?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ children, dense = false, disablePadding = false, className, sx, ...props }, ref) => {
    return (
      <MuiList
        ref={ref}
        dense={dense}
        disablePadding={disablePadding}
        className={cn(className)}
        sx={sx}
        {...props}
      >
        {children}
      </MuiList>
    );
  }
);

List.displayName = "List";

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "children"> {
  children?: ReactNode;
  disablePadding?: boolean;
  alignItems?: "flex-start" | "center";
  secondaryAction?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      children,
      disablePadding = false,
      alignItems = "center",
      secondaryAction,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <MuiListItem
        ref={ref}
        disablePadding={disablePadding}
        alignItems={alignItems}
        secondaryAction={secondaryAction}
        className={cn(className)}
        sx={sx}
        {...props}
      >
        {children}
      </MuiListItem>
    );
  }
);

ListItem.displayName = "ListItem";

export interface ListItemButtonProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  component?: ElementType;
  href?: string;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export const ListItemButton = forwardRef<HTMLDivElement, ListItemButtonProps>(
  (
    {
      children,
      component,
      href,
      selected = false,
      disabled = false,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <MuiListItemButton
        ref={ref}
        component={component as ElementType}
        href={href}
        selected={selected}
        disabled={disabled}
        className={cn(
          "rounded-lg",
          selected && "bg-primary-subtle",
          className
        )}
        sx={{
          '&:focus-visible': {
            outline: 'none',
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiListItemButton>
    );
  }
);

ListItemButton.displayName = "ListItemButton";

export interface ListItemIconProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export const ListItemIcon = forwardRef<HTMLDivElement, ListItemIconProps>(
  ({ children, className, sx, ...props }, ref) => {
    return (
      <MuiListItemIcon
        ref={ref}
        className={cn("min-w-[40px]", className)}
        sx={sx}
        {...props}
      >
        {children}
      </MuiListItemIcon>
    );
  }
);

ListItemIcon.displayName = "ListItemIcon";

export interface ListItemTextProps extends HTMLAttributes<HTMLDivElement> {
  primary?: ReactNode;
  secondary?: ReactNode;
  primaryTypographyProps?: {
    fontWeight?: number | string;
    color?: string;
    fontSize?: string;
    className?: string;
  };
  secondaryTypographyProps?: {
    color?: string;
    fontSize?: string;
    className?: string;
  };
  className?: string;
  sx?: SxProps<Theme>;
}

export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(
  (
    {
      primary,
      secondary,
      primaryTypographyProps,
      secondaryTypographyProps,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <MuiListItemText
        ref={ref}
        primary={primary}
        secondary={secondary}
        primaryTypographyProps={primaryTypographyProps}
        secondaryTypographyProps={secondaryTypographyProps}
        className={cn(className)}
        sx={sx}
        {...props}
      />
    );
  }
);

ListItemText.displayName = "ListItemText";

export default List;
