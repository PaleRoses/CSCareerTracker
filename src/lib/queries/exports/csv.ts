'use server'

import { getApplications } from '../applications'
import { type ApplicationFilters } from '../core/types'

const CSV_HEADERS = [
  'Company',
  'Position',
  'Date Applied',
  'Current Stage',
  'Outcome',
  'Location',
  'Job URL',
] as const

function escapeCSVField(value: string | null | undefined): string {
  if (value == null) return ''
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export async function generateApplicationsCSV(
  filters?: ApplicationFilters
): Promise<string> {
  const applications = await getApplications(filters || {})

  const rows: string[] = [CSV_HEADERS.join(',')]

  for (const app of applications) {
    const currentStage = app.stages.find(s => s.status === 'inProgress')?.name
      || app.stages.find(s => s.status === 'successful')?.name
      || 'Unknown'

    const row = [
      escapeCSVField(app.company),
      escapeCSVField(app.positionTitle),
      formatDate(app.dateApplied),
      escapeCSVField(currentStage),
      escapeCSVField(app.outcome),
      escapeCSVField(app.metadata?.location),
      escapeCSVField(app.metadata?.jobUrl),
    ]

    rows.push(row.join(','))
  }

  return rows.join('\n')
}

export async function generateApplicationsCSVBlob(
  filters?: ApplicationFilters
): Promise<{ data: string; filename: string; mimeType: string }> {
  const csv = await generateApplicationsCSV(filters)
  const timestamp = new Date().toISOString().split('T')[0]

  return {
    data: csv,
    filename: `applications-export-${timestamp}.csv`,
    mimeType: 'text/csv;charset=utf-8;',
  }
}
