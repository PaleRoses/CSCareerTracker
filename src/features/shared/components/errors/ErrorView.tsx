'use client'

import Link from 'next/link'
import {
  Box,
  Flex,
  Stack,
  Text,
  Heading,
  Button,
  Card,
  CardContent,
} from '@/design-system/components'

export type ErrorViewVariant = 'global' | 'portal'

export interface ErrorViewProps {
  error: Error & { digest?: string }
  reset: () => void
  variant?: ErrorViewVariant
}

function ErrorIcon() {
  return (
    <Box className="mx-auto w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
      <svg
        className="w-8 h-8 text-error"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </Box>
  )
}

function WarningIcon() {
  return (
    <Box className="mx-auto w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center">
      <svg
        className="w-7 h-7 text-warning"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </Box>
  )
}

const variantConfig = {
  global: {
    icon: ErrorIcon,
    containerClass: 'min-h-screen bg-background p-4',
    cardClass: 'max-w-md w-full',
    stackClass: 'py-8',
    headingLevel: 2 as const,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    detailsPadding: 'p-4',
    navHref: '/',
    navLabel: 'Go Home',
    useClientNav: true,
  },
  portal: {
    icon: WarningIcon,
    containerClass: 'min-h-[60vh] p-4',
    cardClass: 'max-w-lg w-full',
    stackClass: 'py-6',
    headingLevel: 3 as const,
    title: 'Unable to load this page',
    description: 'Something went wrong while loading this section. You can try again or go back to the dashboard.',
    detailsPadding: 'p-3',
    navHref: '/dashboard',
    navLabel: 'Back to Dashboard',
    useClientNav: false,
  },
} as const

export function ErrorView({ error, reset, variant = 'portal' }: ErrorViewProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const navButton = (
    <Button variant="outlined">
      {config.navLabel}
    </Button>
  )

  return (
    <Flex align="center" justify="center" className={config.containerClass}>
      <Card className={config.cardClass}>
        <CardContent>
          <Stack gap={4} className={`text-center ${config.stackClass}`}>
            <Icon />

            <Stack gap={2}>
              <Heading level={config.headingLevel}>{config.title}</Heading>
              <Text color="secondary">{config.description}</Text>
            </Stack>

            {process.env.NODE_ENV === 'development' && (
              <Box className={`bg-surface-variant/50 rounded-lg ${config.detailsPadding} text-left`}>
                <Text variant="caption" className="font-mono text-error break-all">
                  {error.message}
                </Text>
                {error.digest && (
                  <Text variant="caption" color="secondary" className="mt-1 block">
                    Digest: {error.digest}
                  </Text>
                )}
              </Box>
            )}

            <Flex gap={3} justify="center" className="pt-2">
              {config.useClientNav ? (
                <Button variant="outlined" onClick={() => window.location.href = config.navHref}>
                  {config.navLabel}
                </Button>
              ) : (
                <Link href={config.navHref}>{navButton}</Link>
              )}
              <Button onClick={reset}>Try Again</Button>
            </Flex>
          </Stack>
        </CardContent>
      </Card>
    </Flex>
  )
}

export default ErrorView
