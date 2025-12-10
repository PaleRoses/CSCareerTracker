"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Switch, FormControlLabel } from "@mui/material";
import {
  Box,
  Drawer,
  Heading,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@/design-system/components";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  WorkIcon,
  SearchIcon,
  BusinessIcon,
  AssessmentIcon,
  PersonIcon,
  SettingsIcon,
  PeopleIcon,
} from "@/design-system/icons";
import { layout } from "@/design-system/tokens";
import {
  NAV_ITEMS,
  RECRUITER_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  RECRUITER_ROLES,
  ADMIN_ROLES,
  isRouteActive,
  type NavLinkItem,
  type NavItem,
} from "@/config/routes";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import { useDevMode } from "@/features/shared/dev";

const DRAWER_WIDTH = layout.sidebarWidth;

const ICON_MAP: Record<NavLinkItem['icon'], React.ReactNode> = {
  DashboardIcon: <DashboardIcon />,
  WorkIcon: <WorkIcon />,
  SearchIcon: <SearchIcon />,
  BusinessIcon: <BusinessIcon />,
  AssessmentIcon: <AssessmentIcon />,
  PersonIcon: <PersonIcon />,
  SettingsIcon: <SettingsIcon />,
  PeopleIcon: <PeopleIcon />,
};

interface SidebarProps {
  userRole?: string | null;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const { sqlModeEnabled, toggleSqlMode } = useDevMode();

  const isRecruiter = userRole && RECRUITER_ROLES.includes(userRole as typeof RECRUITER_ROLES[number]);
  const isAdmin = userRole && ADMIN_ROLES.includes(userRole as typeof ADMIN_ROLES[number]);

  const navItems: NavItem[] = isAdmin
    ? [...NAV_ITEMS, ...RECRUITER_NAV_ITEMS, ...ADMIN_NAV_ITEMS]
    : isRecruiter
      ? [...NAV_ITEMS, ...RECRUITER_NAV_ITEMS]
      : [...NAV_ITEMS];

  return (
    <Drawer variant="permanent" width={DRAWER_WIDTH}>
      <Box className="p-6">
        <Heading
          level={2}
          className="font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
        >
          {UI_STRINGS.branding.appName}
        </Heading>
      </Box>

      <List className="px-3 py-4 flex-1">
        {navItems.map((item, index) => {
          if (item.kind === "divider") {
            return <div key={`divider-${index}`} className="my-3" />;
          }

          const isActive = isRouteActive(pathname, item.href);

          return (
            <ListItem key={item.segment} disablePadding className="mb-1">
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "rounded-lg py-2.5 px-4",
                  isActive
                    ? "bg-primary/10 hover:bg-primary/15"
                    : "hover:bg-white/[0.06]"
                )}
              >
                <ListItemIcon
                  className={isActive ? "text-primary" : "text-foreground/60"}
                >
                  {ICON_MAP[item.icon]}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.9rem",
                    className: isActive ? "text-foreground" : "text-foreground/60",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box className="px-4 py-3 border-t border-white/10">
        <FormControlLabel
          control={
            <Switch
              checked={sqlModeEnabled}
              onChange={toggleSqlMode}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'var(--color-secondary)',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'var(--color-secondary)',
                },
              }}
            />
          }
          label="SQL Mode"
          slotProps={{
            typography: {
              sx: {
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: 'var(--color-foreground-muted)',
                fontWeight: 500,
              },
            },
          }}
        />
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
