import { z } from 'zod'

export const SyncUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  provider: z.string().optional(),
})

export type SyncUserInput = z.infer<typeof SyncUserSchema>
