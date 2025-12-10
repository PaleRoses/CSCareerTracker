"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

export interface DesignSystemConfig {
  useTailwind: boolean;
  useMui: boolean;
  enableAnimations: boolean;
  enableGlassmorphism: boolean;
}

const defaultConfig: DesignSystemConfig = {
  useTailwind: true,
  useMui: true,
  enableAnimations: true,
  enableGlassmorphism: true,
};

const DesignSystemContext = createContext<DesignSystemConfig>(defaultConfig);

export interface DesignSystemProviderProps {
  children: ReactNode;
  config?: Partial<DesignSystemConfig>;
}

export function DesignSystemProvider({
  children,
  config,
}: DesignSystemProviderProps) {
  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };

  return (
    <DesignSystemContext.Provider value={mergedConfig}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem(): DesignSystemConfig {
  const context = useContext(DesignSystemContext);

  if (!context) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider"
    );
  }

  return context;
}

export default DesignSystemProvider;
