'use client'

import { PortalErrorView } from '@/features/shared/components/errors/PortalErrorView'

interface PortalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PortalError({ error, reset }: PortalErrorProps) {
  return <PortalErrorView error={error} reset={reset} />
}
