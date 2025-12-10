export type {
  StageStatus,
  Outcome,
  Stage,
  ApplicationMetadata,
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateStageInput,
  AddNoteInput,
  DeleteApplicationInput,
  ActionState,
} from './schemas/application.schema'

export type ApplicationFilters = {
  companyId?: string
  companyName?: string
  positionTitle?: string
  dateFrom?: string
  dateTo?: string
  outcome?: 'pending' | 'offer' | 'rejected' | 'withdrawn'
  currentStage?: string
  limit?: number
  offset?: number
}

export {
  StageStatusSchema,
  OutcomeSchema,
  StageSchema,
  ApplicationMetadataSchema,
  ApplicationSchema,
  CreateApplicationSchema,
  UpdateApplicationSchema,
  UpdateStageSchema,
  AddNoteSchema,
  DeleteApplicationSchema,
  DEFAULT_STAGES,
  createDefaultStages,
} from './schemas/application.schema'
