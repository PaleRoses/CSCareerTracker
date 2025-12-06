import type { ChipVariant } from '@/design-system/components'

export const OUTCOME_VARIANTS: Record<string, ChipVariant> = {
  pending: 'default',
  offer: 'success',
  rejected: 'error',
  withdrawn: 'warning',
}
