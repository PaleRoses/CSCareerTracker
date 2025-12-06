'use client'

import { ErrorView, type ErrorViewProps } from './ErrorView'

export type PortalErrorViewProps = Omit<ErrorViewProps, 'variant'>

export function PortalErrorView({ error, reset }: PortalErrorViewProps) {
  return <ErrorView error={error} reset={reset} variant="portal" />
}

export default PortalErrorView
