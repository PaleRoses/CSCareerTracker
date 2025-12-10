"use client";

import { SessionProvider } from "next-auth/react";
import ThemeRegistry from "./ThemeRegistry";
import { DesignSystemProvider } from "./DesignSystemProvider";

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
