import type { ChipVariant } from '@/design-system/components'

export const JOB_TYPE_VARIANTS: Record<string, ChipVariant> = {
  'full-time': 'primary',
  'part-time': 'secondary',
  'internship': 'success',
  'contract': 'warning',
  'other': 'default',
}
