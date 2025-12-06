'use client'

import type { ReactNode } from 'react'
import { Button } from '@/design-system/components'
import { cn } from '@/lib/utils'

interface FormActionButtonsProps {
  onCancel?: () => void
  isPending?: boolean
  submitLabel?: string
  pendingLabel?: string
  cancelLabel?: string
  submitVariant?: 'gradient' | 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  startIcon?: ReactNode
  className?: string
  noPadding?: boolean
}

export function FormActionButtons({
  onCancel,
  isPending = false,
  submitLabel = 'Submit',
  pendingLabel = 'Submitting...',
  cancelLabel = 'Cancel',
  submitVariant = 'gradient',
  size,
  startIcon,
  className = '',
  noPadding = false,
}: FormActionButtonsProps) {
  return (
    <div className={cn("flex gap-3 justify-end", !noPadding && "pt-4", className)}>
      {onCancel && (
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
          size={size}
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        type="submit"
        variant={submitVariant}
        loading={isPending}
        size={size}
        startIcon={startIcon}
      >
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </div>
  )
}

export default FormActionButtons
