'use client'

import { Text } from '@/design-system/components'

interface EmptyStateProps {
  message?: string
  className?: string
}

export function EmptyState({
  message = 'No items found.',
  className = '',
}: EmptyStateProps) {
  return (
    <Text
      color="secondary"
      className={`text-center py-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </Text>
  )
}

export default EmptyState
