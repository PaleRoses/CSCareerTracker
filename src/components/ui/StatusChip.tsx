"use client";

import { Chip } from "@/design-system/components";
import { capitalize } from "@/lib/utils";
import {
  OUTCOME_TO_CHIP_VARIANT,
  STAGE_TO_CHIP_VARIANT,
  type OutcomeDisplayStatus,
  type StageDisplayStatus,
} from "@/features/applications/constants";

type StatusChipProps =
  | {
      status: OutcomeDisplayStatus;
      variant?: "outcome";
      size?: "small" | "medium";
    }
  | {
      status: StageDisplayStatus;
      variant: "stage";
      size?: "small" | "medium";
    };

export default function StatusChip({ status, variant = "outcome", size = "small" }: StatusChipProps) {
  const label = capitalize(status);

  const chipVariant = variant === "outcome"
    ? OUTCOME_TO_CHIP_VARIANT[status as OutcomeDisplayStatus]
    : STAGE_TO_CHIP_VARIANT[status as StageDisplayStatus];

  return (
    <Chip
      label={label}
      size={size}
      variant={chipVariant}
      className="font-semibold"
    />
  );
}
