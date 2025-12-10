'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  TextField,
  Stack,
  Heading,
  Text,
  Chip,
  Flex,
  Button,
} from '@/design-system/components'
import { FormActionButtons } from '@/features/shared'
import { CloseIcon, NoteIcon } from '@/design-system/icons'
import { addNoteAction } from '../actions/add-note.action'
import { getChipVariant, getStatusLabel } from '../utils/status-utils'
import type { Stage, ActionState } from '../schemas/application.schema'
import { UI_STRINGS } from '@/lib/constants/ui-strings'

interface StageNotesModalProps {
  open: boolean
  stage: Stage
  applicationId: string
  onClose: () => void
}

const initialState: ActionState<string> = {
  success: false,
}

export function StageNotesModal({
  open,
  stage,
  applicationId,
  onClose,
}: StageNotesModalProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [localNotes, setLocalNotes] = useState(stage.notes || '')
  const [prevStageNotes, setPrevStageNotes] = useState(stage.notes)
  const processedActionRef = useRef<string | null>(null)

  const [state, formAction, isPending] = useActionState(
    addNoteAction,
    initialState
  )

  if (stage.notes !== prevStageNotes) {
    setPrevStageNotes(stage.notes)
    setLocalNotes(stage.notes || '')
  }

  useEffect(() => {
    if (state.success && state.data && state.data !== processedActionRef.current) {
      processedActionRef.current = state.data
      const newNote = state.data
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: optimistic UI update after action success
      setLocalNotes((prev) => (prev ? `${prev}\n${newNote}` : newNote))
      formRef.current?.reset()
      router.refresh()
    }
  }, [state.success, state.data, router])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Stack gap={4} className="p-2">
          <Flex justify="between" align="center">
            <Flex align="center" gap={3}>
              <Heading level={3}>{stage.name}</Heading>
              <Chip
                label={getStatusLabel(stage.status)}
                variant={getChipVariant(stage.status)}
                size="small"
              />
            </Flex>
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </Button>
          </Flex>

          <div>
            <Text variant="body2" className="mb-2 font-medium text-foreground/70">
              {UI_STRINGS.forms.notes.notesLabel}
            </Text>
            {localNotes ? (
              <div className="bg-surface-secondary/50 rounded-lg p-4 border border-border/50 max-h-48 overflow-y-auto">
                <Text
                  variant="body2"
                  className="whitespace-pre-wrap text-foreground/90"
                >
                  {localNotes}
                </Text>
              </div>
            ) : (
              <div className="bg-surface-secondary/30 rounded-lg p-4 border border-dashed border-border/50">
                <Text variant="body2" color="secondary" className="text-center">
                  {UI_STRINGS.forms.notes.emptyStage}
                </Text>
              </div>
            )}
          </div>

          <form ref={formRef} action={formAction}>
            <input type="hidden" name="applicationId" value={applicationId} />
            <input type="hidden" name="stageId" value={stage.id} />

            <Stack gap={3}>
              <TextField
                name="note"
                label={UI_STRINGS.forms.notes.addTitle}
                placeholder={UI_STRINGS.forms.notes.stageNotePlaceholder}
                multiline
                rows={3}
                fullWidth
                disabled={isPending}
                error={!!state.error}
                errorMessage={state.error}
              />

              <FormActionButtons
                onCancel={onClose}
                isPending={isPending}
                submitLabel={UI_STRINGS.buttons.addNote}
                pendingLabel={UI_STRINGS.loading.adding}
                cancelLabel={UI_STRINGS.buttons.close}
                submitVariant="primary"
                startIcon={<NoteIcon />}
                noPadding
              />
            </Stack>
          </form>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default StageNotesModal
