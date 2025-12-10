'use client'

import { useState, useTransition } from 'react'
import { Button, Flex } from '@/design-system/components'
import { DownloadIcon, CalendarTodayIcon } from '@/design-system/icons'
import { generateApplicationsCSVBlob, generateCalendarBlob } from '@/features/reports/queries'

export function ExportButtons() {
  const [isPending, startTransition] = useTransition()
  const [exportType, setExportType] = useState<'csv' | 'calendar' | null>(null)

  const handleCSVExport = () => {
    setExportType('csv')
    startTransition(async () => {
      try {
        const result = await generateApplicationsCSVBlob()

        // Create blob and download
        const blob = new Blob([result.data], { type: result.mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to export CSV:', error)
      } finally {
        setExportType(null)
      }
    })
  }

  const handleCalendarExport = () => {
    setExportType('calendar')
    startTransition(async () => {
      try {
        const result = await generateCalendarBlob()

        // Create blob and download
        const blob = new Blob([result.data], { type: result.mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to export calendar:', error)
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
        onClick={handleCSVExport}
        disabled={isPending}
      >
        {isPending && exportType === 'csv' ? 'Exporting...' : 'Export CSV'}
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<CalendarTodayIcon />}
        onClick={handleCalendarExport}
        disabled={isPending}
      >
        {isPending && exportType === 'calendar' ? 'Generating...' : 'Export Calendar'}
      </Button>
    </Flex>
  )
}

export default ExportButtons
