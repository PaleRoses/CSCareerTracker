import { z } from 'zod'
import { logger } from './logger'

const serverEnvSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
})

function validateServerEnv() {
  if (typeof window !== 'undefined') {
    return {} as z.infer<typeof serverEnvSchema>
  }

  const parsed = serverEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    logger.error('Invalid server environment variables', {
      fieldErrors: parsed.error.flatten().fieldErrors,
    })
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid server environment variables')
    }
  }

  return (parsed.data ?? {}) as z.infer<typeof serverEnvSchema>
}

function validateClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  if (!parsed.success) {
    logger.error('Invalid client environment variables', {
      fieldErrors: parsed.error.flatten().fieldErrors,
    })
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid client environment variables')
    }
  }

  return (parsed.data ?? {}) as z.infer<typeof clientEnvSchema>
}

export const serverEnv = validateServerEnv()
export const clientEnv = validateClientEnv()
export const env = {
  ...serverEnv,
  ...clientEnv,
}

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
export type Env = ServerEnv & ClientEnv
