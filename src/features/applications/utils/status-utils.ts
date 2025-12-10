import type { StageStatus } from '../schemas/application.schema'
import type { Stage } from '../types'
import { STAGE_NAMES } from '../config'

const STATUS_DEFINITIONS = {
  successful: {
    chipVariant: 'offer' as const,
    label: 'Completed',
    step: { completed: true, error: false },
  },
  rejected: {
    chipVariant: 'rejected' as const,
    label: 'Rejected',
    step: { completed: true, error: true },
  },
  inProgress: {
    chipVariant: 'default' as const,
    label: 'In Progress',
    step: { completed: false, error: false, active: true },
  },
} as const

type StatusDefinition = (typeof STATUS_DEFINITIONS)[keyof typeof STATUS_DEFINITIONS]

export function getCurrentStage(stages: Stage[]): Stage | undefined {
  return stages.find((s) => s.status === 'inProgress') || stages.at(-1)
}

export function getCurrentStageIndex(stages: Stage[]): number {
  return stages.findIndex((s) => s.status === 'inProgress')
}

export function isTerminalState(stages: Stage[]): boolean {
  return (
    stages.some((s) => s.status === 'rejected') ||
    stages.some((s) => s.name === STAGE_NAMES.WITHDRAWN) ||
    stages.some((s) => s.name === STAGE_NAMES.OFFER && s.status === 'successful')
  )
}

export type TerminalStateType = 'rejected' | 'withdrawn' | 'offer'

export function getTerminalStateType(stages: Stage[]): TerminalStateType | null {
  if (stages.some((s) => s.status === 'rejected')) return 'rejected'
  if (stages.some((s) => s.name === STAGE_NAMES.WITHDRAWN)) return 'withdrawn'
  if (stages.some((s) => s.name === STAGE_NAMES.OFFER && s.status === 'successful')) return 'offer'
  return null
}

function getStatusDef(status: StageStatus): StatusDefinition {
  return STATUS_DEFINITIONS[status] ?? STATUS_DEFINITIONS.inProgress
}

export function getChipVariant(status: StageStatus): 'offer' | 'rejected' | 'default' {
  return getStatusDef(status).chipVariant
}

export function getStatusLabel(status: StageStatus): string {
  return getStatusDef(status).label
}

export function getStepStatus(status: string): { completed: boolean; error: boolean; active?: boolean } {
  return getStatusDef(status as StageStatus).step
}
