import type { ZodError } from 'zod'
import { logger } from '@/lib/logger'

export type FieldErrors = Record<string, string[]>

export type ActionState<T = void> = {
  success: boolean
  error?: string
  fieldErrors?: FieldErrors
  data?: T
  redirectTo?: string
}

export function mapZodErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}

  error.issues.forEach((issue) => {
    const field = issue.path[0] as string
    if (!field) return

    if (!fieldErrors[field]) {
      fieldErrors[field] = []
    }
    fieldErrors[field].push(issue.message)
  })

  return fieldErrors
}

export function getFirstZodError(
  error: ZodError,
  fallback = 'Validation failed'
): string {
  return error.issues[0]?.message ?? fallback
}

export function validationError<T>(
  error: ZodError,
  message = 'Please correct the form errors'
): ActionState<T> {
  return {
    success: false,
    error: message,
    fieldErrors: mapZodErrors(error),
  }
}

export function authError<T>(
  message = 'You must be logged in to perform this action'
): ActionState<T> {
  return {
    success: false,
    error: message,
  }
}

export function databaseError<T>(
  dbError: unknown,
  operation: string
): ActionState<T> {
  logger.error(`Database error during ${operation}`, { error: dbError, operation })
  return {
    success: false,
    error: `Failed to ${operation}. Please try again.`,
  }
}

export function notFoundError<T>(resource = 'resource'): ActionState<T> {
  return {
    success: false,
    error: `${resource} not found or you don't have access to it`,
  }
}

export function unexpectedError<T>(
  error: unknown,
  context: string
): ActionState<T> {
  logger.error(`Unexpected error in ${context}`, { error, context })
  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
  }
}
