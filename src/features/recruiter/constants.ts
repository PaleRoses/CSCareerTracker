import type { ChipVariant } from '@/design-system/components'

/**
 * Pipeline stage progression order
 */
export const STAGE_ORDER = [
  'Applied',
  'OA',
  'Phone Screen',
  'Onsite/Virtual',
  'Offer',
] as const

export type StageName = (typeof STAGE_ORDER)[number]

/**
 * Stage chip color variants
 */
export const STAGE_VARIANTS: Record<string, ChipVariant> = {
  'Applied': 'default',
  'OA': 'secondary',
  'Phone Screen': 'primary',
  'Onsite/Virtual': 'warning',
  'Offer': 'success',
  'Rejected': 'error',
  'Withdrawn': 'default',
}

/**
 * Stage status chip variants
 */
export const STATUS_VARIANTS: Record<string, ChipVariant> = {
  'inProgress': 'primary',
  'successful': 'success',
  'rejected': 'error',
}

/**
 * Application outcome chip variants
 */
export const OUTCOME_VARIANTS: Record<string, ChipVariant> = {
  pending: 'default',
  offer: 'success',
  rejected: 'error',
  withdrawn: 'warning',
}
