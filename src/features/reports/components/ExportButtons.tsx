'use client'

import { useState, useTransition } from 'react'
import { Button, Flex } from '@/design-system/components'
import { DownloadIcon, CalendarTodayIcon } from '@/design-system/icons'
import { generateApplicationsCSVBlob, generateCalendarBlob } from '@/features/reports/queries'

type ExportType = 'csv' | 'calendar'

interface BlobResult {
  data: string
  mimeType: string
  filename: string
}

function triggerDownload({ data, mimeType, filename }: BlobResult) {
  const blob = new Blob([data], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function ExportButtons() {
  const [isPending, startTransition] = useTransition()
  const [exportType, setExportType] = useState<ExportType | null>(null)

  const handleExport = (type: ExportType, fetcher: () => Promise<BlobResult>) => {
    setExportType(type)
    startTransition(async () => {
      try {
        const result = await fetcher()
        triggerDownload(result)
      } catch {
        alert(`Failed to export ${type}. Please try again.`)
      } finally {
        setExportType(null)
      }
    })
  }

  return (
    <Flex gap={2}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<DownloadIcon />}
        onClick={() => handleExport('csv', generateApplicationsCSVBlob)}
        disabled={isPending}
      >
        {isPending && exportType === 'csv' ? 'Exporting...' : 'Export CSV'}
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<CalendarTodayIcon />}
        onClick={() => handleExport('calendar', generateCalendarBlob)}
        disabled={isPending}
      >
        {isPending && exportType === 'calendar' ? 'Generating...' : 'Export Calendar'}
      </Button>
    </Flex>
  )
}

export default ExportButtons
