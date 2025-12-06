import { z } from 'zod'

export const StageStatusSchema = z.enum([
  'inProgress',
  'successful',
  'rejected',
])

export const OutcomeSchema = z.enum(['offer', 'rejected', 'withdrawn'])

export const OfferStatusSchema = z.enum(['pending', 'accepted', 'declined'])

export const StageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Stage name is required'),
  status: StageStatusSchema,
  startedAt: z.string().datetime({ message: 'Invalid date format' }),
  completedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
  updatedBy: z.string().nullable().optional(),  // User ID of who last modified this stage
})

export const CreateStageSchema = z.object({
  name: z.string().min(1, 'Stage name is required'),
  status: StageStatusSchema.default('inProgress'),
  startedAt: z.string().datetime().optional(),
})

export const UpdateStageSchema = z.object({
  applicationId: z.string().uuid(),
  stageId: z.string().uuid(),
  status: StageStatusSchema.optional(),
  completedAt: z.string().datetime().optional(),
})

export const ApplicationMetadataSchema = z.object({
  jobUrl: z.string().url('Please enter a valid URL').or(z.literal('')),
  location: z.string(),
})

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1, 'Company name is required'),
  positionTitle: z.string().min(1, 'Position title is required'),
  dateApplied: z.string(),
  outcome: OutcomeSchema,
  offerStatus: OfferStatusSchema.nullable().optional(),
  stages: z.array(StageSchema),
  metadata: ApplicationMetadataSchema,
  notes: z.array(z.string()),
  userId: z.string().uuid().optional(),
  jobId: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateApplicationSchema = z
  .object({
    companyId: z.string().optional(),
    companyName: z.string().max(100, 'Company name too long').optional(),
    positionTitle: z
      .string()
      .min(1, 'Position title is required')
      .max(150, 'Position title too long'),
    applicationDate: z.string().min(1, 'Date applied is required'),
    location: z.string().optional(),
    jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  })
  .refine(
    (data) => data.companyId || (data.companyName && data.companyName.length > 0),
    {
      message: 'Please select a company or enter a new company name',
      path: ['companyName'],
    }
  )

export const UpdateApplicationSchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1).max(100).optional(),
  positionTitle: z.string().min(1).max(150).optional(),
  dateApplied: z.string().optional(),
  outcome: OutcomeSchema.optional(),
  offerStatus: OfferStatusSchema.nullable().optional(),
  location: z.string().optional(),
  jobUrl: z.string().url().optional().or(z.literal('')),
})

export const AddNoteSchema = z.object({
  applicationId: z.string().uuid(),
  stageId: z.string().uuid(),
  note: z
    .string()
    .min(1, 'Note cannot be empty')
    .max(2000, 'Note is too long (max 2000 characters)'),
})

export const DeleteApplicationSchema = z.object({
  id: z.string().uuid(),
})

export type StageStatus = z.infer<typeof StageStatusSchema>
export type Outcome = z.infer<typeof OutcomeSchema>
export type OfferStatus = z.infer<typeof OfferStatusSchema>
export type Stage = z.infer<typeof StageSchema>
export type ApplicationMetadata = z.infer<typeof ApplicationMetadataSchema>
export type Application = z.infer<typeof ApplicationSchema>
export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>
export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>
export type UpdateStageInput = z.infer<typeof UpdateStageSchema>
export type AddNoteInput = z.infer<typeof AddNoteSchema>
export type DeleteApplicationInput = z.infer<typeof DeleteApplicationSchema>

export { type ActionState, type FieldErrors } from '@/lib/actions/error-utils'

export const DEFAULT_STAGES = [
  'Applied',
  'OA',
  'Phone Screen',
  'Onsite/Virtual',
  'Offer',
  'Rejected',
] as const

export function createDefaultStages(): Omit<Stage, 'id'>[] {
  return [{
    name: 'Applied',
    status: 'inProgress' as StageStatus,
    startedAt: new Date().toISOString(),
  }]
}
