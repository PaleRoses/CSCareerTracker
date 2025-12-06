import type { ZodSchema } from 'zod'
import { logger } from '@/lib/logger'

export function validateInDev<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context: string
): void {
  if (process.env.NODE_ENV !== 'development') return

  const result = schema.safeParse(data)
  if (!result.success) {
    logger.warn(`${context} validation warning`, { issues: result.error.issues })
  }
}
