"use client";

import { useState, useCallback, type SyntheticEvent } from "react";
import type { AutocompleteOption } from "@/design-system/components";

export interface CompanyOption extends AutocompleteOption {
  id: string;
  label: string;
  name: string;
  website: string;
}

interface UseCompanyAutocompleteReturn {
  selectedCompany: CompanyOption | null;
  companyInputValue: string;
  existingCompanyId: string | null;
  companyDisplayName: string;
  handleChange: (event: SyntheticEvent, value: AutocompleteOption | string | null) => void;
  handleInputChange: (event: SyntheticEvent, value: string) => void;
  reset: () => void;
}

export function useCompanyAutocomplete(): UseCompanyAutocompleteReturn {
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);
  const [companyInputValue, setCompanyInputValue] = useState("");

  const handleChange = useCallback(
    (_event: SyntheticEvent, value: AutocompleteOption | string | null) => {
      if (typeof value === "string") {
        setSelectedCompany(null);
        setCompanyInputValue(value);
      } else if (value) {
        setSelectedCompany(value as CompanyOption);
        setCompanyInputValue(value.label);
      } else {
        setSelectedCompany(null);
        setCompanyInputValue("");
      }
    },
    []
  );

  const handleInputChange = useCallback(
    (_event: SyntheticEvent, value: string) => {
      setCompanyInputValue(value);
      if (selectedCompany && value !== selectedCompany.label) {
        setSelectedCompany(null);
      }
    },
    [selectedCompany]
  );

  const reset = useCallback(() => {
    setSelectedCompany(null);
    setCompanyInputValue("");
  }, []);

  const existingCompanyId = selectedCompany?.id ?? null;
  const companyDisplayName = selectedCompany ? "" : companyInputValue;

  return {
    selectedCompany,
    companyInputValue,
    existingCompanyId,
    companyDisplayName,
    handleChange,
    handleInputChange,
    reset,
  };
}
