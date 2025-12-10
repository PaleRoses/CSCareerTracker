'use client'

import { useOptimistic } from 'react'

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
    if (!rawNote?.trim()) return null
    const today = new Date().toISOString().split('T')[0]
    return `[${today}] ${rawNote}`
  }

  return {
    optimisticNotes,
    addOptimisticNote,
    prepareNote,
  }
}

export default useOptimisticNotes
