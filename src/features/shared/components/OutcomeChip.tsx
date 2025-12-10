'use client'

import { Chip } from '@/design-system/components'
import type { Outcome } from '@/features/applications/types'

type ChipVariant = 'offer' | 'rejected' | 'withdrawn' | 'pending' | 'default' | 'primary' | 'secondary'

const OUTCOME_VARIANTS: Record<Outcome, ChipVariant> = {
  offer: 'offer',
  rejected: 'rejected',
  withdrawn: 'withdrawn',
}

interface OutcomeChipProps {
  outcome: Outcome | 'pending' | null | undefined
  size?: 'small' | 'medium'
}

export function OutcomeChip({ outcome, size = 'small' }: OutcomeChipProps) {
  const variant: ChipVariant = outcome && outcome !== 'pending'
    ? OUTCOME_VARIANTS[outcome]
    : 'pending'

  const label = outcome
    ? outcome.charAt(0).toUpperCase() + outcome.slice(1)
    : 'Pending'

  return (
    <Chip
      variant={variant}
      size={size}
      label={label}
    />
  )
}
