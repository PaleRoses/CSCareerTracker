'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, Heading } from '@/design-system/components'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
  headingLevel?: 2 | 3 | 4
  headingClassName?: string
  className?: string
}

export function SectionCard({
  title,
  subtitle,
  children,
  headingLevel = 3,
  headingClassName = 'mb-4',
  className,
}: SectionCardProps) {
  return (
    <Card className={className}>
      <CardContent>
        <Heading level={headingLevel} className={cn(subtitle ? 'mb-2' : headingClassName)}>
          {title}
        </Heading>
        {subtitle && (
          <div className="text-sm text-foreground/60 mb-4">{subtitle}</div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

export default SectionCard
