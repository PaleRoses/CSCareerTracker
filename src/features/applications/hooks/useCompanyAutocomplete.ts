"use client";

import { useState, useCallback, type SyntheticEvent } from "react";
import type { AutocompleteOption } from "@/design-system/components";

export interface CompanyOption extends AutocompleteOption {
  id: string;
  label: string;
  name: string;
  website: string;
}

export function useCompanyAutocomplete() {
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

  return {
    selectedCompany,
    companyInputValue,
    handleChange,
    handleInputChange,
    reset,
  };
}
