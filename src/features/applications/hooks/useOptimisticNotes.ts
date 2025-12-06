'use client'

import { useOptimistic } from 'react'
import { formatNoteWithTimestamp, isValidNote } from '../utils/note-utils'

export interface UseOptimisticNotesResult {
  optimisticNotes: string[]
  addOptimisticNote: (formattedNote: string) => void
  prepareNote: (rawNote: string) => string | null
}

export function useOptimisticNotes(
  currentNotes: string[]
): UseOptimisticNotesResult {
  const [optimisticNotes, addOptimisticNote] = useOptimistic(
    currentNotes,
    (state: string[], newNote: string) => [...state, newNote]
  )

  const prepareNote = (rawNote: string): string | null => {
    if (!isValidNote(rawNote)) return null
    return formatNoteWithTimestamp(rawNote)
  }

  return {
    optimisticNotes,
    addOptimisticNote,
    prepareNote,
  }
}

export default useOptimisticNotes
