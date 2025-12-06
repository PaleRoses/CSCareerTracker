import { pagination, formDefaults } from '@/design-system/tokens'
import type { Outcome } from './schemas/application.schema'

export const TABLE_COLUMNS = {
  company: { minWidth: 150 },
  position: { minWidth: 180 },
  dateApplied: { width: 130 },
  currentStage: { width: 150 },
  outcome: { width: 120 },
  location: { width: 140 },
} as const

export const TABLE_PAGINATION = {
  pageSizeOptions: pagination.defaultSizes,
  defaultPageSize: pagination.defaultPageSize,
} as const

export const FORM_TEXTAREA = {
  rows: formDefaults.textareaRows,
  rowsLarge: formDefaults.textareaRowsLarge,
} as const

export interface OutcomeOption {
  value: Outcome | ''
  label: string
}

export const OUTCOME_OPTIONS: OutcomeOption[] = [
  { value: '', label: 'In Progress (no outcome yet)' },
  { value: 'offer', label: 'Offer Received' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
] as const

export const STAGE_NAMES = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  ASSESSMENT: 'Assessment',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  OA: 'OA',
  PHONE_SCREEN: 'Phone Screen',
  ONSITE: 'Onsite/Virtual',
} as const

export type StageName = typeof STAGE_NAMES[keyof typeof STAGE_NAMES]

export const TERMINAL_STAGES = [STAGE_NAMES.WITHDRAWN, STAGE_NAMES.OFFER] as const
