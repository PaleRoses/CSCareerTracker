'use client'

import { ErrorView, type ErrorViewProps } from './ErrorView'

export type GlobalErrorViewProps = Omit<ErrorViewProps, 'variant'>

export function GlobalErrorView({ error, reset }: GlobalErrorViewProps) {
  return <ErrorView error={error} reset={reset} variant="global" />
}

export default GlobalErrorView
