'use client'

import { Text } from '@/design-system/components'
import { cn } from '@/lib/utils'

interface ErrorAlertProps {
  message: string
  className?: string
}

export function ErrorAlert({ message, className }: ErrorAlertProps) {
  return (
    <div className={cn("p-3 rounded-lg bg-error/10 border border-error/20", className)}>
      <Text className="text-error text-sm">{message}</Text>
    </div>
  )
}

export default ErrorAlert
