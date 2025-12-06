import { getTodayISO } from '@/lib/utils'

export function formatNoteWithTimestamp(note: string): string {
  return `[${getTodayISO()}] ${note}`
}

export function isValidNote(note: string | null | undefined): boolean {
  return !!note?.trim()
}

export function parseNoteTimestamp(note: string): string | null {
  const match = note.match(/^\[(\d{4}-\d{2}-\d{2})\]/)
  return match ? match[1] : null
}

export function stripNoteTimestamp(note: string): string {
  return note.replace(/^\[\d{4}-\d{2}-\d{2}\]\s*/, '')
}
