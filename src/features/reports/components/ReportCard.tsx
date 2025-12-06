'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, Heading, Text } from '@/design-system/components'

interface ReportCardProps {
  title: string
  subtitle?: string
  children?: ReactNode
  className?: string
  isEmpty?: boolean
  emptyMessage?: string
}

export function ReportCard({
  title,
  subtitle,
  children,
  className,
  isEmpty,
  emptyMessage = 'No data available',
}: ReportCardProps) {
  return (
    <Card className={className}>
      <CardContent>
        <Heading level={3} className={subtitle ? 'mb-1' : 'mb-4'}>
          {title}
        </Heading>
        {subtitle && (
          <Text variant="body2" className="text-foreground/60 mb-4">
            {subtitle}
          </Text>
        )}
        {isEmpty ? (
          <div className="py-8 text-center">
            <Text className="text-foreground/50">{emptyMessage}</Text>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

export default ReportCard
