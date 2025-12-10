'use client'

import { useRef, useCallback, useState } from 'react'
import {
  TextField,
  Stack,
  Heading,
  Text,
  Box,
  Chip,
} from '@/design-system/components'
import { FormError, FormActionButtons, useFormAction } from '@/features/shared'
import { createCompanyAction } from '../actions/create-company.action'
import { updateCompanyAction } from '../actions/update-company.action'
import type { Company } from '../types'

interface CompanyFormProps {
  initialData?: Company
  onSuccess?: (companyId: string) => void
  onCancel?: () => void
}

export function CompanyForm({
  initialData,
  onSuccess,
  onCancel,
}: CompanyFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const isEditMode = !!initialData

  const [locations, setLocations] = useState<string[]>(initialData?.locations || [])
  const [locationInput, setLocationInput] = useState('')

  const resetFormState = useCallback(() => {
    formRef.current?.reset()
    setLocations([])
    setLocationInput('')
  }, [])

  const action = isEditMode ? updateCompanyAction : createCompanyAction
  const { state, formAction, isPending, getFieldError } = useFormAction(
    action,
    {
      onSuccess: (data) => {
        resetFormState()
        if (data?.companyId) {
          onSuccess?.(data.companyId)
        }
      },
    }
  )

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

  const locationsError = state.fieldErrors?.['locations']?.[0]

  return (
    <div className="p-6">
      <form ref={formRef} action={formAction}>
        <Stack gap={4}>
          <Heading level={3} className="text-center">
            {isEditMode ? 'Edit Company' : 'Add Company'}
          </Heading>

          <FormError state={state} />

          {isEditMode && (
            <input
              type="hidden"
              name="companyId"
              value={initialData.id}
            />
          )}

          <input
            type="hidden"
            name="locations"
            value={JSON.stringify(locations)}
          />

          <TextField
            name="name"
            label="Company Name"
            placeholder="Enter company name"
            defaultValue={initialData?.name || ''}
            required
            fullWidth
            disabled={isPending}
            {...getFieldError('name')}
          />

          <TextField
            name="website"
            label="Website"
            type="url"
            placeholder="https://example.com"
            defaultValue={initialData?.website || ''}
            fullWidth
            disabled={isPending}
            {...getFieldError('website')}
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
                Add at least one location (optional)
              </Text>
            )}
          </Box>

          <TextField
            name="size"
            label="Company Size"
            type="number"
            placeholder="Number of employees"
            defaultValue={initialData?.size || ''}
            fullWidth
            disabled={isPending}
            {...getFieldError('size')}
          />

          <TextField
            name="industry"
            label="Industry"
            placeholder="e.g. Technology, Healthcare, Finance"
            defaultValue={initialData?.industry || ''}
            fullWidth
            disabled={isPending}
            {...getFieldError('industry')}
          />

          <TextField
            name="description"
            label="Description"
            placeholder="Brief company description"
            defaultValue={initialData?.description || ''}
            multiline
            rows={3}
            fullWidth
            disabled={isPending}
            {...getFieldError('description')}
          />

          <FormActionButtons
            onCancel={onCancel}
            isPending={isPending}
            submitLabel={isEditMode ? 'Save Changes' : 'Create Company'}
            pendingLabel={isEditMode ? 'Saving...' : 'Creating...'}
          />
        </Stack>
      </form>
    </div>
  )
}

export default CompanyForm
