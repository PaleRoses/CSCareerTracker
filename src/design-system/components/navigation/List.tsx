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

/**
 * List - A container for list items
 *
 * @example
 * <List>
 *   <ListItem>First item</ListItem>
 *   <ListItem>Second item</ListItem>
 * </List>
 *
 * @example
 * <List dense disablePadding>
 *   <ListItem>Compact item</ListItem>
 * </List>
 */
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

/**
 * ListItem - A single item in a list
 *
 * @example
 * <List>
 *   <ListItem>Simple text item</ListItem>
 *   <ListItem disablePadding>
 *     <ListItemButton>Clickable item</ListItemButton>
 *   </ListItem>
 * </List>
 */
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

/**
 * ListItemButton - An interactive list item
 *
 * @example
 * <ListItem disablePadding>
 *   <ListItemButton selected={isActive}>
 *     <ListItemText primary="Dashboard" />
 *   </ListItemButton>
 * </ListItem>
 *
 * @example
 * // With Link component
 * <ListItemButton component={Link} href="/dashboard">
 *   <ListItemText primary="Dashboard" />
 * </ListItemButton>
 */
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

/**
 * ListItemIcon - Icon container for list items
 *
 * @example
 * <ListItemButton>
 *   <ListItemIcon>
 *     <DashboardIcon />
 *   </ListItemIcon>
 *   <ListItemText primary="Dashboard" />
 * </ListItemButton>
 */
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

/**
 * ListItemText - Text content for list items
 *
 * @example
 * <ListItemText
 *   primary="Item title"
 *   secondary="Item description"
 * />
 *
 * @example
 * <ListItemText
 *   primary="Dashboard"
 *   primaryTypographyProps={{ fontWeight: 600, color: "text.primary" }}
 * />
 */
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
