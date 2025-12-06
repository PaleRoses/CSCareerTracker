"use client";

import { forwardRef } from "react";
import MuiDivider from "@mui/material/Divider";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface DividerProps {
  /** Orientation of the divider */
  orientation?: "horizontal" | "vertical";
  /** Flex item (for vertical dividers in flex containers) */
  flexItem?: boolean;
  /** Additional class names */
  className?: string;
  /**
   * @deprecated Use className with Tailwind instead.
   */
  sx?: SxProps<Theme>;
}

/**
 * Divider - A visual separator component
 *
 * @example
 * <Stack gap={4}>
 *   <Text>Above</Text>
 *   <Divider />
 *   <Text>Below</Text>
 * </Stack>
 *
 * @example
 * <Flex gap={4}>
 *   <Text>Left</Text>
 *   <Divider orientation="vertical" flexItem />
 *   <Text>Right</Text>
 * </Flex>
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = "horizontal", flexItem = false, className, sx, ...props }, ref) => {
    return (
      <MuiDivider
        ref={ref}
        orientation={orientation}
        flexItem={flexItem}
        className={cn(className)}
        sx={{
          borderColor: "var(--color-border-muted)",
          ...sx,
        }}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export default Divider;
