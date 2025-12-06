"use client";

import { Box } from "@/design-system/components";
import Sidebar, { DRAWER_WIDTH } from "./Sidebar";
import TopBar from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
  userRole?: string | null;
}

export default function AppShell({ children, userRole }: AppShellProps) {
  return (
    <Box className="flex min-h-screen">
      <TopBar />
      <Sidebar userRole={userRole} />
      <Box
        component="main"
        className="grow p-6"
        style={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          background: "var(--gradient-background)",
        }}
      >
        <div className="h-16" />
        {children}
      </Box>
    </Box>
  );
}
