'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Stage } from '@/features/applications/types'
import { advanceStageAction } from '../actions/advance-stage.action'
import { rejectStageAction } from '../actions/reject-stage.action'
import { withdrawApplicationAction } from '../actions/withdraw-application.action'

interface UseStageActionsReturn {
  advance: () => void
  reject: () => void
  withdraw: () => void
  isPending: boolean
}

export function useStageActions(
  applicationId: string,
  currentStage: Stage | null
): UseStageActionsReturn {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const advance = () => {
    if (!currentStage) return
    startTransition(async () => {
      const result = await advanceStageAction(applicationId, currentStage.id)
      if (result.success) {
        router.refresh()
      }
    })
  }

  const reject = () => {
    if (!currentStage) return
    startTransition(async () => {
      const result = await rejectStageAction(applicationId, currentStage.id)
      if (result.success) {
        router.refresh()
      }
    })
  }

  const withdraw = () => {
    startTransition(async () => {
      const result = await withdrawApplicationAction(applicationId)
      if (result.success) {
        router.refresh()
      }
    })
  }

  return { advance, reject, withdraw, isPending }
}
