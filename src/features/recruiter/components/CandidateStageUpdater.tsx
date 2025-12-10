'use client'

import { useActionState } from 'react'
import {
  Box,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Text,
  Chip,
} from '@/design-system/components'
import { CheckCircleIcon, CloseIcon, ArrowForwardIcon } from '@/design-system/icons'
import { FormError } from '@/features/shared'
import type { Candidate } from '../types'
import {
  updateCandidateStageAction,
  advanceCandidateAction,
} from '../actions'
import type { ActionState } from '@/lib/actions/error-utils'
import { useState } from 'react'
import { STAGE_VARIANTS, STATUS_VARIANTS } from '../constants'
import { findActiveStage, getNextStageName, isTerminalState } from '../utils/stage-utils'

interface CandidateStageUpdaterProps {
  candidate: Candidate
  onUpdate?: () => void
}

const initialState: ActionState<{ stageId: string }> = {
  success: false,
}

export function CandidateStageUpdater({ candidate, onUpdate: _onUpdate }: CandidateStageUpdaterProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<'reject' | 'advance' | null>(null)
  const [notes, setNotes] = useState('')

  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateCandidateStageAction,
    initialState
  )

  const [advanceState, advanceAction, isAdvancePending] = useActionState(
    advanceCandidateAction,
    initialState
  )

  const isPending = isUpdatePending || isAdvancePending

  const activeStage = findActiveStage(candidate.stages)
  const nextStageName = getNextStageName(candidate.currentStage)
  const isTerminal = isTerminalState(candidate)

  const handleOpenDialog = (action: 'reject' | 'advance') => {
    setDialogAction(action)
    setNotes('')
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    if (!isPending) {
      setDialogOpen(false)
      setDialogAction(null)
    }
  }

  return (
    <Box>
      <Stack gap={3} className="mb-6">
        <Text variant="body1" className="font-semibold">
          Application Progress
        </Text>

        <Box className="flex gap-2 flex-wrap">
          {candidate.stages.map((stage) => (
            <Box key={stage.id} className="flex flex-col items-center">
              <Chip
                label={stage.name}
                variant={STAGE_VARIANTS[stage.name] || 'default'}
                size="small"
              />
              <Chip
                label={stage.status}
                variant={STATUS_VARIANTS[stage.status]}
                size="small"
                className="mt-1"
              />
            </Box>
          ))}
        </Box>
      </Stack>

      {!isTerminal && activeStage && (
        <Stack direction="horizontal" gap={2}>
          {nextStageName && (
            <Button
              variant="primary"
              startIcon={<ArrowForwardIcon />}
              onClick={() => handleOpenDialog('advance')}
              disabled={isPending}
            >
              Advance to {nextStageName}
            </Button>
          )}

          {candidate.currentStage === 'Offer' && (
            <Button
              variant="primary"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleOpenDialog('advance')}
              disabled={isPending}
            >
              Mark Offer Accepted
            </Button>
          )}

          <Button
            variant="ghost"
            startIcon={<CloseIcon />}
            onClick={() => handleOpenDialog('reject')}
            disabled={isPending}
            className="text-error hover:bg-error/10"
          >
            Reject
          </Button>
        </Stack>
      )}

      {isTerminal && (
        <Text variant="body2" className="text-foreground/60 italic">
          This application is in a terminal state ({candidate.outcome || candidate.currentStage}).
          No further updates allowed.
        </Text>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === 'reject'
            ? 'Reject Candidate'
            : dialogAction === 'advance' && candidate.currentStage === 'Offer'
              ? 'Mark Offer as Accepted'
              : `Advance to ${nextStageName}`}
        </DialogTitle>
        <DialogContent>
          <form
            action={dialogAction === 'reject' ? updateAction : advanceAction}
            id="stage-form"
          >
            <input type="hidden" name="applicationId" value={candidate.applicationId} />
            {dialogAction === 'reject' ? (
              <>
                <input type="hidden" name="stageId" value={activeStage?.id || ''} />
                <input type="hidden" name="newStatus" value="rejected" />
              </>
            ) : (
              <input
                type="hidden"
                name="nextStageName"
                value={candidate.currentStage === 'Offer' ? 'Offer' : nextStageName || ''}
              />
            )}

            <FormError state={dialogAction === 'reject' ? updateState : advanceState} />

            <Text variant="body2" className="mb-4">
              {dialogAction === 'reject'
                ? `Are you sure you want to reject ${candidate.userName}?`
                : candidate.currentStage === 'Offer'
                  ? `Mark ${candidate.userName}'s offer as accepted?`
                  : `Advance ${candidate.userName} to ${nextStageName}?`}
            </Text>

            <TextField
              name="notes"
              label="Notes (optional)"
              placeholder="Add any notes about this decision..."
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isPending}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="ghost" onClick={handleCloseDialog} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="stage-form"
            variant="primary"
            disabled={isPending}
            className={dialogAction === 'reject' ? 'bg-error hover:bg-error/90' : ''}
          >
            {isPending
              ? 'Updating...'
              : dialogAction === 'reject'
                ? 'Reject'
                : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CandidateStageUpdater
