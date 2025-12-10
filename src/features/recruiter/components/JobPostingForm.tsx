'use client'

import { useActionState, useRef, useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  TextField,
  Autocomplete,
  Stack,
  Heading,
  Text,
  Box,
  Chip,
} from '@/design-system/components'
import { FormError, FormActionButtons } from '@/features/shared'
import { createJobAction } from '../actions/create-job.action'
import { updateJobAction } from '../actions/update-job.action'
import type { ActionState } from '@/lib/actions/error-utils'
import { JOB_TYPE_LABELS, type Job } from '@/features/jobs/types'

export interface CompanyOption {
  id: string
  label: string
  [key: string]: unknown  // Index signature for MUI Autocomplete compatibility
}

interface JobPostingFormProps {
  companies: CompanyOption[]
  initialData?: Job  // For edit mode - pre-populate form with existing job data
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
  initialData,
  onSuccess,
  onCancel,
}: JobPostingFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const isEditMode = !!initialData

  const initialCompanyOption = initialData
    ? companies.find(c => c.id === initialData.companyId) || null
    : null

  const initialTypeOption = initialData
    ? JOB_TYPE_OPTIONS.find(t => t.id === initialData.type) || JOB_TYPE_OPTIONS[0]
    : JOB_TYPE_OPTIONS[0]

  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(initialCompanyOption)
  const [companyInputValue, setCompanyInputValue] = useState(initialData?.companyName || '')
  const [selectedType, setSelectedType] = useState<JobTypeOption | null>(initialTypeOption)
  const [locations, setLocations] = useState<string[]>(initialData?.locations || [])
  const [locationInput, setLocationInput] = useState('')

  const action = isEditMode ? updateJobAction : createJobAction
  const [state, formAction, isPending] = useActionState(action, initialState)

  const resetFormState = useCallback(() => {
    formRef.current?.reset()
    setSelectedCompany(null)
    setCompanyInputValue('')
    setSelectedType(JOB_TYPE_OPTIONS[0])
    setLocations([])
    setLocationInput('')
  }, [])

  // Handle successful form submission
  useEffect(() => {
    if (state.success && state.data) {
      resetFormState()
      onSuccess?.(state.data.jobId)
      router.refresh()
    }
  }, [state.success, state.data, resetFormState, onSuccess, router])

  // Helper to extract field error props for TextField
  const fieldError = (field: string) => {
    const msg = state.fieldErrors?.[field]?.[0]
    return { error: !!msg, errorMessage: msg }
  }

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

  const existingCompanyId = selectedCompany?.id ?? undefined
  const companyDisplayName = selectedCompany ? '' : companyInputValue

  const companyError = state.fieldErrors?.['companyName']?.[0] || state.fieldErrors?.['companyId']?.[0]
  const locationsError = state.fieldErrors?.['locations']?.[0]

  return (
    <div className="p-6">
      <form ref={formRef} action={formAction}>
        <Stack gap={4}>
          <Heading level={3} className="text-center">
            {isEditMode ? 'Edit Job' : 'Post New Job'}
          </Heading>

          <FormError state={state} />

          {isEditMode && (
            <input
              type="hidden"
              name="jobId"
              value={initialData.id}
            />
          )}

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
            disabled={isPending || isEditMode} // Can't change company when editing
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
            defaultValue={initialData?.title || ''}
            required
            fullWidth
            disabled={isPending}
            {...fieldError('title')}
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
            defaultValue={initialData?.url || ''}
            fullWidth
            disabled={isPending}
            {...fieldError('url')}
          />

          <FormActionButtons
            onCancel={onCancel}
            isPending={isPending}
            submitLabel={isEditMode ? 'Save Changes' : 'Post Job'}
            pendingLabel={isEditMode ? 'Saving...' : 'Posting...'}
          />
        </Stack>
      </form>
    </div>
  )
}

export default JobPostingForm
