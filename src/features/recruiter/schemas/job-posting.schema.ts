import { z } from 'zod'

/**
 * Schema for job posting form validation
 */
export const JobPostingSchema = z
  .object({
    companyId: z.string().uuid().optional(),
    companyName: z
      .string()
      .max(100, 'Company name too long')
      .optional(),
    title: z
      .string()
      .min(1, 'Position title is required')
      .max(150, 'Position title too long'),
    type: z.enum(['full-time', 'part-time', 'internship', 'contract', 'other']),
    locations: z
      .array(z.string().min(1))
      .min(1, 'At least one location is required'),
    url: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => data.companyId || (data.companyName && data.companyName.length > 0),
    {
      message: 'Please select a company or enter a new company name',
      path: ['companyName'],
    }
  )

export type JobPostingInput = z.infer<typeof JobPostingSchema>

/**
 * Schema for updating an existing job posting
 */
export const UpdateJobPostingSchema = z.object({
  jobId: z.string().uuid(),
  title: z.string().min(1).max(150).optional(),
  type: z.enum(['full-time', 'part-time', 'internship', 'contract', 'other']).optional(),
  locations: z.array(z.string().min(1)).optional(),
  url: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
})

export type UpdateJobPostingInput = z.infer<typeof UpdateJobPostingSchema>
