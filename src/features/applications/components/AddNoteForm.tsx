'use client'

import { useActionState, useRef, useEffect } from 'react'
import { TextField, Stack, Text } from '@/design-system/components'
import { FormActionButtons, FormError } from '@/features/shared'
import { cn } from '@/lib/utils'
import { addNoteAction } from '../actions/add-note.action'
import type { ActionState } from '../schemas/application.schema'
import { useOptimisticNotes } from '../hooks/useOptimisticNotes'
import { FORM_TEXTAREA } from '../config'
import { UI_STRINGS } from '@/lib/constants/ui-strings'

interface AddNoteFormProps {
  applicationId: string
  currentNotes: string[]
  onNotesChange?: (notes: string[]) => void
}

const initialState: ActionState<string> = {
  success: false,
}

export function AddNoteForm({
  applicationId,
  currentNotes,
  onNotesChange,
}: AddNoteFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const { optimisticNotes, addOptimisticNote, prepareNote } = useOptimisticNotes(currentNotes)

  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState<string>, formData: FormData) => {
      formData.set('applicationId', applicationId)
      return addNoteAction(prevState, formData)
    },
    initialState
  )

  useEffect(() => {
    if (state.success && state.data) {
      formRef.current?.reset()
      onNotesChange?.(optimisticNotes)
    }
  }, [state.success, state.data, optimisticNotes, onNotesChange])

  const handleSubmit = async (formData: FormData) => {
    const note = formData.get('note') as string
    const formattedNote = prepareNote(note)
    if (!formattedNote) return

    addOptimisticNote(formattedNote)
    return formAction(formData)
  }

  return (
    <Stack gap={3}>
      {optimisticNotes.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {optimisticNotes.map((note, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg bg-background-glass border border-border/30",
                isPending && index === optimisticNotes.length - 1 && "opacity-60"
              )}
            >
              <Text className="text-sm text-foreground/90">{note}</Text>
            </div>
          ))}
        </div>
      )}

      <form ref={formRef} action={handleSubmit}>
        <Stack gap={2}>
          <FormError state={state} variant="inline" showWithFieldErrors />

          <TextField
            name="note"
            label={UI_STRINGS.forms.notes.addLabel}
            placeholder={UI_STRINGS.forms.notes.placeholder}
            multiline
            rows={FORM_TEXTAREA.rows}
            fullWidth
            disabled={isPending}
            error={!!state.fieldErrors?.note}
            errorMessage={state.fieldErrors?.note?.[0]}
          />

          <FormActionButtons
            isPending={isPending}
            submitLabel={UI_STRINGS.buttons.addNote}
            pendingLabel={UI_STRINGS.loading.adding}
            submitVariant="primary"
            size="small"
            noPadding
          />
        </Stack>
      </form>

      {optimisticNotes.length === 0 && !isPending && (
        <Text className="text-foreground/50 text-sm text-center py-4">
          {UI_STRINGS.forms.notes.empty}
        </Text>
      )}
    </Stack>
  )
}

export default AddNoteForm
