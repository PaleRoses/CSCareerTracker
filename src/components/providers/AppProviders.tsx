"use client";

import { SessionProvider } from "next-auth/react";
import ThemeRegistry from "@/components/providers/ThemeRegistry";
import { DesignSystemProvider } from "@/components/providers/DesignSystemProvider";

export interface AppProvidersProps {
  children: React.ReactNode;
  enableMui?: boolean;
}

export default function AppProviders({
  children,
  enableMui = true,
}: AppProvidersProps) {
  return (
    <SessionProvider>
      <DesignSystemProvider config={{ useMui: enableMui }}>
        <ThemeRegistry enableMui={enableMui}>{children}</ThemeRegistry>
      </DesignSystemProvider>
    </SessionProvider>
  );
}
