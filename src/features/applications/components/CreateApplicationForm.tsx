'use client'

import { useActionState, useRef, useCallback } from 'react'
import {
  TextField,
  Autocomplete,
  Stack,
  Heading,
} from '@/design-system/components'
import { FormError } from '@/components/ui/FormError'
import { FormActionButtons } from '@/components/ui/FormActionButtons'
import { useFormSuccess } from '@/features/shared/hooks'
import { getTodayISO } from '@/lib/utils'
import { getFieldError, getFieldErrorProps } from '@/lib/form-utils'
import { createApplicationAction } from '../actions/create-application.action'
import type { ActionState } from '../schemas/application.schema'
import { UI_STRINGS } from '@/lib/constants/ui-strings'
import { useCompanyAutocomplete, type CompanyOption } from '../hooks'

export type { CompanyOption }

interface CreateApplicationFormProps {
  companies: CompanyOption[]
  onSuccess?: (applicationId: string) => void
  onCancel?: () => void
}

type CreateApplicationResult = {
  applicationId: string
}

const initialState: ActionState<CreateApplicationResult> = {
  success: false,
}

export function CreateApplicationForm({
  companies,
  onSuccess,
  onCancel,
}: CreateApplicationFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const {
    selectedCompany,
    companyInputValue,
    existingCompanyId,
    companyDisplayName,
    handleChange: handleCompanyChange,
    handleInputChange: handleCompanyInputChange,
    reset: resetCompanyAutocomplete,
  } = useCompanyAutocomplete()

  const [state, formAction, isPending] = useActionState(
    createApplicationAction,
    initialState
  )

  const resetFormState = useCallback(() => {
    formRef.current?.reset()
    resetCompanyAutocomplete()
  }, [resetCompanyAutocomplete])

  useFormSuccess(state, {
    onSuccess: (data) => data && onSuccess?.(data.applicationId),
    resetForm: resetFormState,
  })

  const today = getTodayISO()
  const companyError = getFieldError(state.fieldErrors, 'companyName') || getFieldError(state.fieldErrors, 'companyId')

  return (
    <div className="p-6">
      <form ref={formRef} action={formAction}>
        <Stack gap={4}>
          <Heading level={3} className="text-center">
            {UI_STRINGS.forms.application.addTitle}
          </Heading>

          <FormError state={state} />

          <input
            type="hidden"
            name="companyId"
            value={existingCompanyId || ''}
          />
          <input
            type="hidden"
            name="companyName"
            value={companyDisplayName}
          />

          <Autocomplete
            options={companies}
            label={UI_STRINGS.forms.application.companyLabel}
            placeholder={UI_STRINGS.forms.application.companyPlaceholder}
            freeSolo
            required
            fullWidth
            disabled={isPending}
            value={selectedCompany}
            inputValue={companyInputValue}
            onChange={handleCompanyChange}
            onInputChange={handleCompanyInputChange}
            error={!!companyError}
            errorMessage={companyError}
            noOptionsText={UI_STRINGS.forms.application.companyNoOptions}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option
              return option.label
            }}
          />

          <TextField
            name="positionTitle"
            label={UI_STRINGS.forms.application.positionLabel}
            placeholder={UI_STRINGS.forms.application.positionPlaceholder}
            required
            fullWidth
            disabled={isPending}
            {...getFieldErrorProps(state.fieldErrors, 'positionTitle')}
          />

          <TextField
            name="applicationDate"
            label={UI_STRINGS.forms.application.dateAppliedLabel}
            type="date"
            required
            fullWidth
            disabled={isPending}
            defaultValue={today}
            {...getFieldErrorProps(state.fieldErrors, 'applicationDate')}
          />

          <TextField
            name="location"
            label={UI_STRINGS.forms.application.locationLabel}
            placeholder={UI_STRINGS.forms.application.locationPlaceholder}
            fullWidth
            disabled={isPending}
            {...getFieldErrorProps(state.fieldErrors, 'location')}
          />

          <TextField
            name="jobUrl"
            label={UI_STRINGS.forms.application.jobUrlLabel}
            type="url"
            placeholder={UI_STRINGS.forms.application.jobUrlPlaceholder}
            fullWidth
            disabled={isPending}
            {...getFieldErrorProps(state.fieldErrors, 'jobUrl')}
          />

          <FormActionButtons
            onCancel={onCancel}
            isPending={isPending}
            submitLabel={UI_STRINGS.buttons.addApplication}
            pendingLabel={UI_STRINGS.loading.creating}
          />
        </Stack>
      </form>
    </div>
  )
}

export default CreateApplicationForm
