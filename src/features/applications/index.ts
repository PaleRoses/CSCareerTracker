export {
  createApplicationAction,
  updateApplicationAction,
  deleteApplication,
  updateStageAction,
  addNoteAction,
} from './actions'

export {
  getApplications,
  getApplication,
  getApplicationWithTag,
  getApplicationsPaginated,
  applicationExists,
  getApplicationTimeline,
  getCompanies,
  type ApplicationTimeline,
  type TimelineStage,
  type CompanyOption,
} from './queries'

export {
  ApplicationSchema,
  CreateApplicationSchema,
  UpdateApplicationSchema,
  UpdateStageSchema,
  AddNoteSchema,
  StageSchema,
  StageStatusSchema,
  OutcomeSchema,
  createDefaultStages,
} from './schemas/application.schema'

export type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateStageInput,
  AddNoteInput,
  Stage,
  StageStatus,
  Outcome,
  ActionState,
} from './schemas/application.schema'

export { OUTCOME_COLORS, STAGE_COLORS } from './constants'
