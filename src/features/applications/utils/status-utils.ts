import type { StageStatus } from '../schemas/application.schema'
import type { Stage } from '../types'
import { STAGE_NAMES } from '../config'

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

export function getStatusColor(status: StageStatus): string {
  const colors: Record<StageStatus, string> = {
    successful: 'success',
    rejected: 'error',
    inProgress: 'primary',
  }
  return colors[status] || 'default'
}

export function getChipVariant(status: StageStatus): 'offer' | 'rejected' | 'default' {
  switch (status) {
    case 'successful':
      return 'offer'
    case 'rejected':
      return 'rejected'
    case 'inProgress':
    default:
      return 'default'
  }
}

export function getStatusLabel(status: StageStatus): string {
  const labels: Record<StageStatus, string> = {
    successful: 'Completed',
    rejected: 'Rejected',
    inProgress: 'In Progress',
  }
  return labels[status] || status
}

export function getStepStatus(status: string): {
  completed: boolean
  error: boolean
  active?: boolean
} {
  if (status === 'successful') return { completed: true, error: false }
  if (status === 'rejected') return { completed: true, error: true }
  if (status === 'inProgress') return { completed: false, error: false, active: true }
  return { completed: false, error: false }
}
