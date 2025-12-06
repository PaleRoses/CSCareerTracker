import { z } from 'zod'

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  provider: z.string().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const SyncUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  provider: z.string().optional(),
})

export type Profile = z.infer<typeof ProfileSchema>
export type SyncUserInput = z.infer<typeof SyncUserSchema>
