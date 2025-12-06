"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  Heading,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Text,
} from "@/design-system/components";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  WorkIcon,
  SearchIcon,
  BusinessIcon,
  AssessmentIcon,
  PersonIcon,
} from "@/design-system/icons";
import { layout } from "@/design-system/tokens";
import {
  NAV_ITEMS,
  RECRUITER_NAV_ITEMS,
  RECRUITER_ROLES,
  isRouteActive,
  type NavLinkItem,
  type NavItem,
} from "@/config/routes";
import { UI_STRINGS } from "@/lib/constants/ui-strings";

const DRAWER_WIDTH = layout.sidebarWidth;

// Icon mapping for nav items
const ICON_MAP: Record<NavLinkItem['icon'], React.ReactNode> = {
  DashboardIcon: <DashboardIcon />,
  WorkIcon: <WorkIcon />,
  SearchIcon: <SearchIcon />,
  BusinessIcon: <BusinessIcon />,
  AssessmentIcon: <AssessmentIcon />,
  PersonIcon: <PersonIcon />,
};

interface SidebarProps {
  userRole?: string | null;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  // Determine if user is a recruiter
  const isRecruiter = userRole && RECRUITER_ROLES.includes(userRole as typeof RECRUITER_ROLES[number]);

  // Build nav items based on role
  const navItems: NavItem[] = isRecruiter
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

      <List className="px-3 py-4">
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
    </Drawer>
  );
}

export { DRAWER_WIDTH };
