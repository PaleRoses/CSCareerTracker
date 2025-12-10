'use client'

import { useState } from 'react'
import {
  TextField,
  Stack,
  Heading,
  Text,
} from '@/design-system/components'
import { FormError, FormActionButtons, useFormAction } from '@/features/shared'
import { updateApplicationAction } from '../actions/update-application.action'
import type { Application, Outcome } from '../schemas/application.schema'
import { OUTCOME_OPTIONS } from '../config'
import { UI_STRINGS } from '@/lib/constants/ui-strings'

interface EditApplicationFormProps {
  application: Application
  onSuccess?: () => void
  onCancel?: () => void
}

export function EditApplicationForm({
  application,
  onSuccess,
  onCancel,
}: EditApplicationFormProps) {
  const [outcome, setOutcome] = useState<Outcome | ''>(application.outcome || '')

  const { state, formAction, isPending, getFieldError } = useFormAction(
    updateApplicationAction,
    { onSuccess }
  )

  return (
    <div className="p-6">
      <form action={formAction}>
        <Stack gap={4}>
          <Heading level={3} className="text-center">
            {UI_STRINGS.forms.application.editTitle}
          </Heading>

          <div className="bg-surface-secondary/50 rounded-lg p-4 border border-border/50">
            <Text variant="caption" color="secondary" className="block mb-1">
              {UI_STRINGS.forms.application.companyLabel}
            </Text>
            <Text variant="body1" className="font-medium">
              {application.company}
            </Text>
            <Text variant="caption" color="secondary" className="block mt-1">
              {UI_STRINGS.forms.application.companyCannotChange}
            </Text>
          </div>

          <FormError state={state} />

          <input type="hidden" name="id" value={application.id} />

          <TextField
            name="positionTitle"
            label={UI_STRINGS.forms.application.positionLabel}
            placeholder={UI_STRINGS.forms.application.positionPlaceholder}
            required
            fullWidth
            disabled={isPending}
            defaultValue={application.positionTitle}
            {...getFieldError('positionTitle')}
          />

          <TextField
            name="dateApplied"
            label={UI_STRINGS.forms.application.dateAppliedLabel}
            type="date"
            required
            fullWidth
            disabled={isPending}
            defaultValue={application.dateApplied}
            {...getFieldError('dateApplied')}
          />

          <div className="space-y-1">
            <label
              htmlFor="outcome"
              className="block text-sm font-medium text-foreground/80"
            >
              {UI_STRINGS.forms.application.outcomeLabel}
            </label>
            <select
              id="outcome"
              name="outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as Outcome | '')}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                         disabled:opacity-50 disabled:cursor-not-allowed
                         appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              {OUTCOME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <TextField
            name="location"
            label={UI_STRINGS.forms.application.locationLabel}
            placeholder={UI_STRINGS.forms.application.locationPlaceholder}
            fullWidth
            disabled={isPending}
            defaultValue={application.metadata.location || ''}
            {...getFieldError('location')}
          />

          <TextField
            name="jobUrl"
            label={UI_STRINGS.forms.application.jobUrlLabel}
            type="url"
            placeholder={UI_STRINGS.forms.application.jobUrlPlaceholder}
            fullWidth
            disabled={isPending}
            defaultValue={application.metadata.jobUrl || ''}
            {...getFieldError('jobUrl')}
          />

          <FormActionButtons
            onCancel={onCancel}
            isPending={isPending}
            submitLabel={UI_STRINGS.buttons.save}
            pendingLabel={UI_STRINGS.loading.saving}
          />
        </Stack>
      </form>
    </div>
  )
}

export default EditApplicationForm
