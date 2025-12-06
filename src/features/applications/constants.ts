import type { ChipVariant } from "@/design-system/components";

export type OutcomeDisplayStatus = 'offer' | 'rejected' | 'pending' | 'withdrawn';

const VALID_OUTCOME_STATUSES: readonly OutcomeDisplayStatus[] = ['offer', 'rejected', 'pending', 'withdrawn'];

export function isOutcomeDisplayStatus(value: unknown): value is OutcomeDisplayStatus {
  return typeof value === 'string' && VALID_OUTCOME_STATUSES.includes(value as OutcomeDisplayStatus);
}

export type StageDisplayStatus = 'upcoming' | 'inProgress' | 'successful' | 'rejected';

const VALID_STAGE_STATUSES: readonly StageDisplayStatus[] = ['upcoming', 'inProgress', 'successful', 'rejected'];

export function isStageDisplayStatus(value: unknown): value is StageDisplayStatus {
  return typeof value === 'string' && VALID_STAGE_STATUSES.includes(value as StageDisplayStatus);
}

export const OUTCOME_COLORS: Record<OutcomeDisplayStatus, { bg: string; text: string }> = {
  offer: { bg: "rgba(111, 255, 193, 0.15)", text: "#6fffc1" },
  rejected: { bg: "rgba(253, 164, 175, 0.15)", text: "#fda4af" },
  pending: { bg: "rgba(252, 211, 77, 0.15)", text: "#fcd34d" },
  withdrawn: { bg: "rgba(156, 163, 175, 0.15)", text: "#9ca3af" },
};

export const STAGE_COLORS: Record<StageDisplayStatus, string> = {
  upcoming: "rgba(255, 255, 255, 0.2)",
  inProgress: "#6ee7ff",
  successful: "#6fffc1",
  rejected: "#fda4af",
};

export const OUTCOME_TO_CHIP_VARIANT: Record<OutcomeDisplayStatus, ChipVariant> = {
  offer: "offer",
  rejected: "rejected",
  pending: "pending",
  withdrawn: "pending",
};

export const STAGE_TO_CHIP_VARIANT: Record<StageDisplayStatus, ChipVariant> = {
  upcoming: "upcoming",
  inProgress: "inProgress",
  successful: "success",
  rejected: "rejected",
};
