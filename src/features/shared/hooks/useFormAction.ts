'use client'

import { useActionState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface ActionState<T = unknown> {
  success: boolean
  error?: string
  data?: T
  fieldErrors?: Record<string, string[]>
}

type ServerAction<T> = (
  state: ActionState<T>,
  formData: FormData
) => Promise<ActionState<T>>

interface UseFormActionOptions<T> {
  onSuccess?: (data: T | undefined) => void
  autoRefresh?: boolean
}

export function useFormAction<T = unknown>(
  action: ServerAction<T>,
  options?: UseFormActionOptions<T>
) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(action, { success: false })

  // Use refs to avoid stale closure issues with options
  const onSuccessRef = useRef(options?.onSuccess)
  const autoRefreshRef = useRef(options?.autoRefresh)
  const hasProcessedRef = useRef(false)

  // Keep refs up to date
  onSuccessRef.current = options?.onSuccess
  autoRefreshRef.current = options?.autoRefresh

  useEffect(() => {
    if (state.success && !hasProcessedRef.current) {
      hasProcessedRef.current = true
      onSuccessRef.current?.(state.data)
      if (autoRefreshRef.current !== false) {
        router.refresh()
      }
    } else if (!state.success) {
      // Reset when state goes back to non-success (new submission attempt)
      hasProcessedRef.current = false
    }
  }, [state.success, state.data, router])

  const getFieldError = (field: string) => {
    const msg = state.fieldErrors?.[field]?.[0]
    return { error: !!msg, errorMessage: msg }
  }

  return { state, formAction, isPending, getFieldError }
}

export type { ActionState, ServerAction, UseFormActionOptions }
