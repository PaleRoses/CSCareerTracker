"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";

export type TextFieldVariant = "outlined" | "filled";

export interface TextFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "color" | "onChange"
  > {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  variant?: TextFieldVariant;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  value?: string | number;
  onChange?: MuiTextFieldProps["onChange"];
  className?: string;
  /** @deprecated Use className with Tailwind */
  sx?: SxProps<Theme>;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error,
      errorMessage,
      variant = "outlined",
      fullWidth = false,
      multiline = false,
      rows,
      type = "text",
      value,
      onChange,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;
    const displayHelperText = errorMessage || helperText;

    return (
      <MuiTextField
        inputRef={ref}
        label={label}
        helperText={displayHelperText}
        error={hasError}
        variant={variant}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        type={type}
        value={value}
        onChange={onChange}
        className={cn(className)}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "var(--color-border)",
            },
            "&:hover fieldset": {
              borderColor: "var(--color-border-subtle)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--color-primary)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "var(--color-text-secondary)",
          },
          "& .MuiInputBase-input": {
            color: "var(--color-text-primary)",
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
