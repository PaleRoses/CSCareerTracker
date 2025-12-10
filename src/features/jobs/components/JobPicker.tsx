'use client'

import { Autocomplete } from '@/design-system/components'

export interface JobOption {
  id: string
  label: string  // "Position Title @ Company Name"
  companyName: string
  title: string
  [key: string]: unknown  // Index signature for MUI Autocomplete compatibility
}

interface JobPickerProps {
  jobs: JobOption[]
  value: JobOption | null
  onChange: (job: JobOption | null) => void
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  required?: boolean
}

export function JobPicker({
  jobs,
  value,
  onChange,
  disabled,
  error,
  errorMessage,
  required = false,
}: JobPickerProps) {
  return (
    <Autocomplete
      options={jobs}
      label="Select Job"
      placeholder="Search for a job..."
      required={required}
      fullWidth
      disabled={disabled}
      value={value}
      onChange={(_, newValue) => onChange(newValue as JobOption | null)}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option
        return option.label
      }}
      error={error}
      errorMessage={errorMessage}
      groupBy={(option) => (option as JobOption).companyName}
      noOptionsText="No jobs available"
    />
  )
}

export default JobPicker
