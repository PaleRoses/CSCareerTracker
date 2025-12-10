/**
 * User Management Schemas
 *
 * Zod validation schemas for admin user management actions.
 */

import { z } from 'zod'

export const UpdateUserRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  newRole: z.enum(['applicant', 'recruiter', 'admin', 'techno_warlord'], {
    message: 'Invalid role selected',
  }),
})

export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>

export const UpdateUserStatusSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  newStatus: z.enum(['active', 'suspended', 'disabled'], {
    message: 'Invalid status selected',
  }),
  reason: z.string().max(500, 'Reason must be 500 characters or less').optional(),
})

export type UpdateUserStatusInput = z.infer<typeof UpdateUserStatusSchema>

export const DeleteUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  confirmation: z.literal(true, {
    message: 'You must confirm this action',
  }),
})

export type DeleteUserInput = z.infer<typeof DeleteUserSchema>

export const UserFiltersSchema = z.object({
  search: z.string().optional(),
  role: z
    .enum(['applicant', 'recruiter', 'admin', 'techno_warlord', 'all'])
    .optional()
    .default('all'),
  status: z.enum(['active', 'suspended', 'disabled', 'all']).optional().default('all'),
  limit: z.number().min(1).max(100).optional().default(25),
  offset: z.number().min(0).optional().default(0),
})

export type UserFiltersInput = z.infer<typeof UserFiltersSchema>
