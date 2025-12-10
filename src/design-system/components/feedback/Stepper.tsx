"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import MuiStepper from "@mui/material/Stepper";
import MuiStep from "@mui/material/Step";
import MuiStepLabel from "@mui/material/StepLabel";
import type { SxProps, Theme } from "@mui/material/styles";
import { cn } from "@/lib/utils";
import { colors } from "@/design-system/tokens";

const defaultStepperStyles: SxProps<Theme> = {
  "& .MuiStepLabel-label": { color: colors.text.secondary, marginTop: "8px" },
  "& .MuiStepLabel-label.Mui-active": { color: colors.primary.DEFAULT },
  "& .MuiStepLabel-label.Mui-completed": { color: colors.text.primary },
  "& .MuiStepIcon-root": { color: colors.background.glassSubtle },
  "& .MuiStepIcon-root.Mui-active": { color: colors.primary.DEFAULT },
  "& .MuiStepIcon-root.Mui-completed": { color: colors.success.DEFAULT },
  "& .MuiStepIcon-root.Mui-error": { color: colors.error.DEFAULT },
};

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  activeStep?: number;
  alternativeLabel?: boolean;
  orientation?: "horizontal" | "vertical";
  nonLinear?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ children, activeStep, alternativeLabel = false, orientation = "horizontal", nonLinear = false, className, sx, ...props }, ref) => {
    return (
      <MuiStepper
        ref={ref}
        activeStep={activeStep}
        alternativeLabel={alternativeLabel}
        orientation={orientation}
        nonLinear={nonLinear}
        className={cn(className)}
        sx={{ ...defaultStepperStyles, ...sx }}
        {...props}
      >
        {children}
      </MuiStepper>
    );
  }
);

Stepper.displayName = "Stepper";

export interface StepProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  completed?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  active?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ children, completed = false, disabled = false, expanded = false, active, className, sx, ...props }, ref) => {
    return (
      <MuiStep ref={ref} completed={completed} disabled={disabled} expanded={expanded} active={active} className={cn(className)} sx={sx} {...props}>
        {children}
      </MuiStep>
    );
  }
);

Step.displayName = "Step";

export interface StepLabelProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children?: ReactNode;
  error?: boolean;
  optional?: ReactNode;
  icon?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export const StepLabel = forwardRef<HTMLSpanElement, StepLabelProps>(
  ({ children, error = false, optional, icon, className, sx, ...props }, ref) => {
    return (
      <MuiStepLabel ref={ref} error={error} optional={optional} icon={icon} className={cn(className)} sx={sx} {...props}>
        {children}
      </MuiStepLabel>
    );
  }
);

StepLabel.displayName = "StepLabel";

export default Stepper;
