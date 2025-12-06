'use client'

import { useActionState, useRef, useCallback, useState } from 'react'
import {
  TextField,
  Autocomplete,
  Stack,
  Heading,
  Text,
  Box,
  Chip,
} from '@/design-system/components'
import { FormError } from '@/components/ui/FormError'
import { FormActionButtons } from '@/components/ui/FormActionButtons'
import { useFormSuccess } from '@/hooks/useFormSuccess'
import { getFieldError, getFieldErrorProps } from '@/lib/form-utils'
import { createJobAction } from '../actions/create-job.action'
import type { ActionState } from '@/lib/actions/error-utils'
import { JOB_TYPE_LABELS } from '@/features/jobs/types'
import type { JobType } from '@/features/jobs/types'

export interface CompanyOption {
  id: string
  label: string
  [key: string]: unknown  // Index signature for MUI Autocomplete compatibility
}

interface JobPostingFormProps {
  companies: CompanyOption[]
  onSuccess?: (jobId: string) => void
  onCancel?: () => void
}

type CreateJobResult = {
  jobId: string
}

const initialState: ActionState<CreateJobResult> = {
  success: false,
}

interface JobTypeOption {
  id: string
  label: string
  [key: string]: unknown
}

const JOB_TYPE_OPTIONS: JobTypeOption[] = Object.entries(JOB_TYPE_LABELS).map(([value, label]) => ({
  id: value,
  label,
}))

export function JobPostingForm({
  companies,
  onSuccess,
  onCancel,
}: JobPostingFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  // Company autocomplete state
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null)
  const [companyInputValue, setCompanyInputValue] = useState('')

  // Job type state
  const [selectedType, setSelectedType] = useState<JobTypeOption | null>(
    JOB_TYPE_OPTIONS[0] // Default to full-time
  )

  // Locations state (multi-value)
  const [locations, setLocations] = useState<string[]>([])
  const [locationInput, setLocationInput] = useState('')

  const [state, formAction, isPending] = useActionState(createJobAction, initialState)

  const resetFormState = useCallback(() => {
    formRef.current?.reset()
    setSelectedCompany(null)
    setCompanyInputValue('')
    setSelectedType(JOB_TYPE_OPTIONS[0])
    setLocations([])
    setLocationInput('')
  }, [])

  useFormSuccess(state, {
    onSuccess: (data) => data && onSuccess?.(data.jobId),
    resetForm: resetFormState,
  })

  const handleCompanyChange = (
    _event: React.SyntheticEvent,
    newValue: CompanyOption | string | null
  ) => {
    if (typeof newValue === 'string') {
      // User typed a custom value
      setSelectedCompany(null)
      setCompanyInputValue(newValue)
    } else if (newValue) {
      // User selected an existing option
      setSelectedCompany(newValue)
      setCompanyInputValue(newValue.label)
    } else {
      // Cleared
      setSelectedCompany(null)
      setCompanyInputValue('')
    }
  }

  const handleAddLocation = () => {
    const trimmed = locationInput.trim()
    if (trimmed && !locations.includes(trimmed)) {
      setLocations(prev => [...prev, trimmed])
      setLocationInput('')
    }
  }

  const handleRemoveLocation = (locationToRemove: string) => {
    setLocations(prev => prev.filter(loc => loc !== locationToRemove))
  }

  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddLocation()
    }
  }

  // Derive company values for hidden fields
  const existingCompanyId = selectedCompany?.id ?? undefined
  // If we have a selected company, use empty string (companyId is set)
  // Otherwise use the typed input value for new company creation
  const companyDisplayName = selectedCompany ? '' : companyInputValue

  const companyError = getFieldError(state.fieldErrors, 'companyName') || getFieldError(state.fieldErrors, 'companyId')
  const locationsError = getFieldError(state.fieldErrors, 'locations')

  return (
    <div className="p-6">
      <form ref={formRef} action={formAction}>
        <Stack gap={4}>
          <Heading level={3} className="text-center">
            Post New Job
          </Heading>

          <FormError state={state} />

          {/* Hidden fields for company */}
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

          {/* Hidden fields for job type and locations */}
          <input
            type="hidden"
            name="type"
            value={selectedType?.id || 'full-time'}
          />
          <input
            type="hidden"
            name="locations"
            value={JSON.stringify(locations)}
          />

          <Autocomplete
            options={companies}
            label="Company"
            placeholder="Select or enter company name"
            freeSolo
            required
            fullWidth
            disabled={isPending}
            value={selectedCompany}
            inputValue={companyInputValue}
            onChange={handleCompanyChange}
            onInputChange={(_e, value) => setCompanyInputValue(value)}
            error={!!companyError}
            errorMessage={companyError}
            noOptionsText="Type to add a new company"
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option
              return option.label
            }}
          />

          <TextField
            name="title"
            label="Position Title"
            placeholder="e.g. Senior Software Engineer"
            required
            fullWidth
            disabled={isPending}
            {...getFieldErrorProps(state.fieldErrors, 'title')}
          />

          <Autocomplete
            options={JOB_TYPE_OPTIONS}
            label="Job Type"
            required
            fullWidth
            disabled={isPending}
            value={selectedType}
            onChange={(_e, value) => setSelectedType(value as typeof selectedType)}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
          />

          {/* Locations with chips */}
          <Box>
            <TextField
              label="Locations"
              placeholder="e.g. San Francisco, CA"
              fullWidth
              disabled={isPending}
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={handleLocationKeyDown}
              onBlur={handleAddLocation}
              error={!!locationsError}
              helperText={locationsError || 'Press Enter to add multiple locations'}
            />
            {locations.length > 0 && (
              <Box className="flex flex-wrap gap-2 mt-2">
                {locations.map((location) => (
                  <Chip
                    key={location}
                    label={location}
                    size="small"
                    variant="default"
                    onDelete={() => handleRemoveLocation(location)}
                  />
                ))}
              </Box>
            )}
            {locations.length === 0 && (
              <Text variant="body2" className="text-foreground/50 mt-1">
                At least one location is required
              </Text>
            )}
          </Box>

          <TextField
            name="url"
            label="Job Posting URL"
            type="url"
            placeholder="https://company.com/careers/job-posting"
            fullWidth
            disabled={isPending}
            {...getFieldErrorProps(state.fieldErrors, 'url')}
          />

          <FormActionButtons
            onCancel={onCancel}
            isPending={isPending}
            submitLabel="Post Job"
            pendingLabel="Posting..."
          />
        </Stack>
      </form>
    </div>
  )
}

export default JobPostingForm
