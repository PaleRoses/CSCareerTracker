'use client'

import type { ActionState } from '@/lib/actions/error-utils'
import { Text } from '@/design-system/components'
import { ErrorAlert } from './ErrorAlert'
import { cn } from '@/lib/utils'

type FormErrorVariant = 'alert' | 'inline'

interface FormErrorProps<T = unknown> {
  state: ActionState<T>
  variant?: FormErrorVariant
  showWithFieldErrors?: boolean
  className?: string
}

export function FormError<T = unknown>({
  state,
  variant = 'alert',
  showWithFieldErrors = false,
  className,
}: FormErrorProps<T>) {
  if (!state.error) return null
  if (state.fieldErrors && !showWithFieldErrors) return null

  if (variant === 'inline') {
    return (
      <Text className={cn('text-error text-sm', className)}>
        {state.error}
      </Text>
    )
  }

  return <ErrorAlert message={state.error} className={className} />
}

export default FormError
