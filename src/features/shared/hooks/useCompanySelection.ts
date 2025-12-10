'use client'

import { useState, useCallback } from 'react'

export interface CompanyOption {
  id: string
  label: string
  [key: string]: unknown
}

export interface UseCompanySelectionOptions {
  initialCompany?: CompanyOption | null
  isEditMode?: boolean
}

export interface UseCompanySelectionReturn {
  selectedCompany: CompanyOption | null
  companyInputValue: string
  setCompanyInputValue: (value: string) => void
  handleCompanyChange: (
    event: React.SyntheticEvent,
    newValue: CompanyOption | string | null
  ) => void
  clearSelection: () => void
  existingCompanyId: string | undefined
  companyDisplayName: string
}

export function useCompanySelection(
  options: UseCompanySelectionOptions = {}
): UseCompanySelectionReturn {
  const { initialCompany = null, isEditMode = false } = options

  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(initialCompany)
  const [companyInputValue, setCompanyInputValue] = useState(initialCompany?.label || '')

  const handleCompanyChange = useCallback((
    _event: React.SyntheticEvent,
    newValue: CompanyOption | string | null
  ) => {
    if (isEditMode) return

    if (typeof newValue === 'string') {
      setSelectedCompany(null)
      setCompanyInputValue(newValue)
    } else if (newValue) {
      setSelectedCompany(newValue)
      setCompanyInputValue(newValue.label)
    } else {
      setSelectedCompany(null)
      setCompanyInputValue('')
    }
  }, [isEditMode])

  const clearSelection = useCallback(() => {
    if (!isEditMode) {
      setSelectedCompany(null)
      setCompanyInputValue('')
    }
  }, [isEditMode])

  const existingCompanyId = selectedCompany?.id ?? undefined
  const companyDisplayName = selectedCompany ? '' : companyInputValue

  return {
    selectedCompany,
    companyInputValue,
    setCompanyInputValue,
    handleCompanyChange,
    clearSelection,
    existingCompanyId,
    companyDisplayName,
  }
}
