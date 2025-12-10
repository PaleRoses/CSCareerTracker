'use client'

import { useActionState, useEffect, useRef } from 'react'
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

  const processedSuccessRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    if (state.success && state.data !== processedSuccessRef.current) {
      processedSuccessRef.current = state.data
      options?.onSuccess?.(state.data)
      if (options?.autoRefresh !== false) {
        router.refresh()
      }
    }
  }, [state.success, state.data, options, router])

  const getFieldError = (field: string) => {
    const msg = state.fieldErrors?.[field]?.[0]
    return { error: !!msg, errorMessage: msg }
  }

  return { state, formAction, isPending, getFieldError }
}

export type { ActionState, ServerAction, UseFormActionOptions }
