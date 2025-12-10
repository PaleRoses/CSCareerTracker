import type { Candidate, CandidateStage } from '../types'
import { STAGE_ORDER } from '../constants'

export function findActiveStage(stages: CandidateStage[]): CandidateStage | undefined {
  return stages.find(s => s.endedAt === null)
}

export function getNextStageName(currentStage: string): string | null {
  const currentIndex = STAGE_ORDER.indexOf(currentStage as typeof STAGE_ORDER[number])
  if (currentIndex < 0 || currentIndex >= STAGE_ORDER.length - 1) {
    return null
  }
  return STAGE_ORDER[currentIndex + 1]
}

export function isTerminalState(candidate: Pick<Candidate, 'outcome' | 'currentStage'>): boolean {
  return (
    candidate.outcome !== 'pending' ||
    candidate.currentStage === 'Rejected' ||
    candidate.currentStage === 'Withdrawn'
  )
}
