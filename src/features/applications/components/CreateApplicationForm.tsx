'use client'

import { useRef, useCallback, useState } from 'react'
import {
  TextField,
  Stack,
  Heading,
} from '@/design-system/components'
import { FormError, FormActionButtons, useFormAction } from '@/features/shared'
import { createApplicationAction } from '../actions/create-application.action'
import { JobPicker, type JobOption } from '@/features/jobs/components/JobPicker'
import { UI_STRINGS } from '@/lib/constants/ui-strings'

export type { JobOption }

interface CreateApplicationFormProps {
  jobs: JobOption[]
  onSuccess?: (applicationId: string) => void
  onCancel?: () => void
}

export function CreateApplicationForm({
  jobs,
  onSuccess,
  onCancel,
}: CreateApplicationFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedJob, setSelectedJob] = useState<JobOption | null>(null)

  const resetFormState = useCallback(() => {
    formRef.current?.reset()
    setSelectedJob(null)
  }, [])

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
  const jobError = state.fieldErrors?.['jobId']?.[0]

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
            name="jobId"
            value={selectedJob?.id || ''}
          />

          <JobPicker
            jobs={jobs}
            value={selectedJob}
            onChange={setSelectedJob}
            disabled={isPending}
            error={!!jobError}
            errorMessage={jobError}
            required
          />

          <TextField
            name="applicationDate"
            label={UI_STRINGS.forms.application.dateAppliedLabel}
            type="date"
            fullWidth
            disabled={isPending}
            defaultValue={today}
            {...getFieldError('applicationDate')}
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
