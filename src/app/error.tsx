'use client'

import { GlobalErrorView } from '@/features/shared/components/errors/GlobalErrorView'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <GlobalErrorView error={error} reset={reset} />
      </body>
    </html>
  )
}
