'use client'

import { useRef, useCallback } from 'react'
import {
  TextField,
  Autocomplete,
  Stack,
  Heading,
} from '@/design-system/components'
import { FormError, FormActionButtons, useFormAction } from '@/features/shared'
import { createApplicationAction } from '../actions/create-application.action'
import { UI_STRINGS } from '@/lib/constants/ui-strings'
import { useCompanyAutocomplete, type CompanyOption } from '../hooks'

export type { CompanyOption }

interface CreateApplicationFormProps {
  companies: CompanyOption[]
  onSuccess?: (applicationId: string) => void
  onCancel?: () => void
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
    handleChange: handleCompanyChange,
    handleInputChange: handleCompanyInputChange,
    reset: resetCompanyAutocomplete,
  } = useCompanyAutocomplete()

  const existingCompanyId = selectedCompany?.id ?? ''
  const companyDisplayName = selectedCompany ? '' : companyInputValue

  const resetFormState = useCallback(() => {
    formRef.current?.reset()
    resetCompanyAutocomplete()
  }, [resetCompanyAutocomplete])

  const { state, formAction, isPending, getFieldError } = useFormAction(
    createApplicationAction,
    {
      onSuccess: (data) => {
        resetFormState()
        if (data?.applicationId) {
          onSuccess?.(data.applicationId)
        }
      },
    }
  )

  const today = new Date().toISOString().split('T')[0]
  const companyError = state.fieldErrors?.['companyName']?.[0] || state.fieldErrors?.['companyId']?.[0]

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
            value={existingCompanyId}
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
            {...getFieldError('positionTitle')}
          />

          <TextField
            name="applicationDate"
            label={UI_STRINGS.forms.application.dateAppliedLabel}
            type="date"
            required
            fullWidth
            disabled={isPending}
            defaultValue={today}
            {...getFieldError('applicationDate')}
          />

          <TextField
            name="location"
            label={UI_STRINGS.forms.application.locationLabel}
            placeholder={UI_STRINGS.forms.application.locationPlaceholder}
            fullWidth
            disabled={isPending}
            {...getFieldError('location')}
          />

          <TextField
            name="jobUrl"
            label={UI_STRINGS.forms.application.jobUrlLabel}
            type="url"
            placeholder={UI_STRINGS.forms.application.jobUrlPlaceholder}
            fullWidth
            disabled={isPending}
            {...getFieldError('jobUrl')}
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
