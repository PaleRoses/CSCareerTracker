"use client";

import { forwardRef, type SyntheticEvent } from "react";
import MuiAutocomplete, { type AutocompleteProps as MuiAutocompleteProps } from "@mui/material/Autocomplete";
import MuiTextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export interface AutocompleteOption {
  id: string;
  label: string;
  [key: string]: unknown;
}

export interface AutocompleteProps<T extends AutocompleteOption = AutocompleteOption> {
  options: T[];
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  freeSolo?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  value?: T | null;
  inputValue?: string;
  onChange?: (event: SyntheticEvent, value: T | string | null) => void;
  onInputChange?: (event: SyntheticEvent, value: string) => void;
  className?: string;
  getOptionLabel?: (option: T | string) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  renderOption?: MuiAutocompleteProps<T, false, false, boolean>["renderOption"];
  groupBy?: (option: T) => string;
  noOptionsText?: string;
  loading?: boolean;
  loadingText?: string;
  sx?: SxProps<Theme>;
}

const inputStyles: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "var(--color-border)" },
    "&:hover fieldset": { borderColor: "var(--color-border-subtle)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
  },
  "& .MuiInputLabel-root": { color: "var(--color-text-secondary)" },
  "& .MuiInputBase-input": { color: "var(--color-text-primary)" },
};

export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps<AutocompleteOption>>(
  (
    {
      options, label, placeholder, helperText, error, errorMessage, freeSolo = false,
      fullWidth = false, disabled = false, required = false, value, inputValue,
      onChange, onInputChange, className, getOptionLabel, isOptionEqualToValue,
      renderOption, groupBy, noOptionsText = "No options", loading = false,
      loadingText = "Loading...", sx,
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;

    const defaultGetOptionLabel = (option: AutocompleteOption | string): string =>
      typeof option === "string" ? option : option.label;

    const defaultIsOptionEqualToValue = (option: AutocompleteOption, val: AutocompleteOption): boolean =>
      option.id === val.id;

    return (
      <MuiAutocomplete
        ref={ref}
        options={options}
        freeSolo={freeSolo}
        fullWidth={fullWidth}
        disabled={disabled}
        value={value}
        inputValue={inputValue}
        onChange={onChange as MuiAutocompleteProps<AutocompleteOption, false, false, boolean>["onChange"]}
        onInputChange={onInputChange}
        getOptionLabel={getOptionLabel || defaultGetOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue || defaultIsOptionEqualToValue}
        renderOption={renderOption}
        groupBy={groupBy}
        noOptionsText={noOptionsText}
        loading={loading}
        loadingText={loadingText}
        className={cn(className)}
        sx={{
          ...inputStyles,
          "& .MuiAutocomplete-popupIndicator": { color: "var(--color-text-secondary)" },
          "& .MuiAutocomplete-clearIndicator": { color: "var(--color-text-secondary)" },
          ...sx,
        }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "var(--color-background-elevated)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
              "& .MuiAutocomplete-option": {
                color: "var(--color-text-primary)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                "&[aria-selected='true']": { bgcolor: "rgba(var(--color-primary-rgb), 0.2)" },
              },
              "& .MuiAutocomplete-noOptions": {
                color: "var(--color-text-secondary)",
              },
            },
          },
          popper: {
            sx: { zIndex: 1400 },
          },
        }}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            label={label}
            placeholder={placeholder}
            helperText={errorMessage || helperText}
            error={hasError}
            required={required}
            variant="outlined"
            sx={inputStyles}
          />
        )}
      />
    );
  }
);

Autocomplete.displayName = "Autocomplete";

export default Autocomplete;
