import { z } from 'zod'

// =============================================================================
// Create Company Schema
// =============================================================================

export const CreateCompanySchema = z.object({
  name: z
    .string()
    .min(1, 'Company name is required')
    .max(255, 'Company name too long'),
  website: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  locations: z.array(z.string().min(1)).default([]),
  size: z.coerce.number().positive('Size must be a positive number').optional(),
  description: z.string().max(2000, 'Description too long').optional(),
  industry: z.string().max(100, 'Industry too long').optional(),
})

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>

// =============================================================================
// Update Company Schema
// =============================================================================

export const UpdateCompanySchema = z.object({
  companyId: z.string().uuid('Invalid company ID'),
  name: z.string().min(1, 'Company name is required').max(255, 'Company name too long').optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  locations: z.array(z.string().min(1)).optional(),
  size: z.coerce.number().positive('Size must be a positive number').optional().nullable(),
  description: z.string().max(2000, 'Description too long').optional(),
  industry: z.string().max(100, 'Industry too long').optional(),
})

export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>

// =============================================================================
// Delete Company Schema
// =============================================================================

export const DeleteCompanySchema = z.object({
  companyId: z.string().uuid('Invalid company ID'),
  confirmation: z.literal(true, {
    message: 'You must confirm deletion',
  }),
})

export type DeleteCompanyInput = z.infer<typeof DeleteCompanySchema>

// =============================================================================
// Re-exports
// =============================================================================

export { type ActionState, type FieldErrors } from '@/lib/actions/error-utils'
