'use server'

import { getApplications } from '@/features/applications/queries'
import { type ApplicationFilters } from '@/features/applications/types'
import { type CalendarEvent } from '../../types'

const ICAL_HEADER = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Career Tracker//Application Events//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH`

const ICAL_FOOTER = `END:VCALENDAR`

function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function generateUID(id: string, type: string): string {
  return `${id}-${type}@career-tracker`
}

export async function extractCalendarEvents(
  filters?: ApplicationFilters
): Promise<CalendarEvent[]> {
  const applications = await getApplications(filters || {})

  const events: CalendarEvent[] = []

  for (const app of applications) {
    for (const stage of app.stages) {
      if (stage.name.toLowerCase().includes('interview') && stage.startedAt) {
        events.push({
          id: `${app.id}-${stage.id}`,
          title: `${stage.name}: ${app.company} - ${app.positionTitle}`,
          description: `Interview stage for ${app.positionTitle} at ${app.company}`,
          startDate: stage.startedAt,
          endDate: stage.completedAt || undefined,
          location: app.metadata?.location || undefined,
          type: 'interview',
        })
      }

      if (stage.status === 'inProgress' && stage.startedAt) {
        const startDate = new Date(stage.startedAt)
        const followUpDate = new Date(startDate)
        followUpDate.setDate(followUpDate.getDate() + 7)

        if (followUpDate > new Date()) {
          events.push({
            id: `${app.id}-${stage.id}-followup`,
            title: `Follow up: ${app.company} - ${stage.name}`,
            description: `Consider following up on ${app.positionTitle} application`,
            startDate: followUpDate.toISOString(),
            type: 'follow_up',
          })
        }
      }
    }
  }

  return events.sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )
}

export async function generateCalendar(
  filters?: ApplicationFilters
): Promise<string> {
  const events = await extractCalendarEvents(filters)

  const icalEvents = events.map(event => {
    const startDate = new Date(event.startDate)
    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(startDate.getTime() + 60 * 60 * 1000)

    const lines = [
      'BEGIN:VEVENT',
      `UID:${generateUID(event.id, event.type)}`,
      `DTSTAMP:${formatICalDate(new Date())}`,
      `DTSTART:${formatICalDate(startDate)}`,
      `DTEND:${formatICalDate(endDate)}`,
      `SUMMARY:${escapeICalText(event.title)}`,
      `DESCRIPTION:${escapeICalText(event.description)}`,
    ]

    if (event.location) {
      lines.push(`LOCATION:${escapeICalText(event.location)}`)
    }

    lines.push('END:VEVENT')

    return lines.join('\r\n')
  })

  return [ICAL_HEADER, ...icalEvents, ICAL_FOOTER].join('\r\n')
}

export async function generateCalendarBlob(
  filters?: ApplicationFilters
): Promise<{ data: string; filename: string; mimeType: string }> {
  const ical = await generateCalendar(filters)
  const timestamp = new Date().toISOString().split('T')[0]

  return {
    data: ical,
    filename: `career-events-${timestamp}.ics`,
    mimeType: 'text/calendar;charset=utf-8;',
  }
}
