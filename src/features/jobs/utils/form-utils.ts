export function parseLocationsFromFormData(formData: FormData): string[] {
  const raw = formData.get('locations')
  if (typeof raw !== 'string' || raw.length === 0) return []

  try {
    return JSON.parse(raw)
  } catch {
    return raw.split(',').map(s => s.trim()).filter(Boolean)
  }
}

export function parseOptionalLocationsFromFormData(formData: FormData): string[] | undefined {
  const raw = formData.get('locations')
  if (typeof raw !== 'string' || raw.length === 0) return undefined

  try {
    return JSON.parse(raw)
  } catch {
    return raw.split(',').map(s => s.trim()).filter(Boolean)
  }
}
