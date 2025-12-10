import type { Candidate, CandidateStage } from '../types'
import { STAGE_ORDER } from '../constants'

/**
 * Finds the currently active (non-ended) stage from a list of stages
 */
export function findActiveStage(stages: CandidateStage[]): CandidateStage | undefined {
  return stages.find(s => s.endedAt === null)
}

/**
 * Gets the next stage name in the pipeline progression
 * Returns null if already at the final stage or stage not found
 */
export function getNextStageName(currentStage: string): string | null {
  const currentIndex = STAGE_ORDER.indexOf(currentStage as typeof STAGE_ORDER[number])
  if (currentIndex < 0 || currentIndex >= STAGE_ORDER.length - 1) {
    return null
  }
  return STAGE_ORDER[currentIndex + 1]
}

/**
 * Checks if a candidate is in a terminal state (cannot be updated)
 * Terminal states: outcome is not pending, or stage is Rejected/Withdrawn
 */
export function isTerminalState(candidate: Pick<Candidate, 'outcome' | 'currentStage'>): boolean {
  return (
    candidate.outcome !== 'pending' ||
    candidate.currentStage === 'Rejected' ||
    candidate.currentStage === 'Withdrawn'
  )
}
