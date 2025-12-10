'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionState } from '@/lib/actions/error-utils'

interface UseFormSuccessOptions<T> {
  onSuccess?: (data?: T) => void
  resetForm?: () => void
  refreshOnSuccess?: boolean
}

export function useFormSuccess<T = void>(
  state: ActionState<T>,
  options: UseFormSuccessOptions<T> = {}
): void {
  const { onSuccess, resetForm, refreshOnSuccess = true } = options
  const router = useRouter()
  const successCountRef = useRef(0)
  const lastSuccessCountRef = useRef(0)

  useEffect(() => {
    if (state.success) {
      successCountRef.current += 1
    }
  }, [state.success, state.data])

  useEffect(() => {
    if (state.success && successCountRef.current > lastSuccessCountRef.current) {
      lastSuccessCountRef.current = successCountRef.current

      resetForm?.()
      onSuccess?.(state.data)

      if (refreshOnSuccess) {
        router.refresh()
      }
    }
  }, [state.success, state.data, onSuccess, resetForm, refreshOnSuccess, router])
}

export default useFormSuccess
