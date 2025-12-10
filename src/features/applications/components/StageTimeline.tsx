"use client";

import { useState } from "react";
import {
  Text,
  Flex,
  Stepper,
  Step,
  StepLabel,
} from "@/design-system/components";
import { SectionCard } from "@/features/shared";
import { NoteIcon } from "@/design-system/icons";
import { StageActionButtons } from "./StageActionButtons";
import { formatDate } from "@/lib/utils";
import type { Stage } from "@/features/applications/types";
import { getStepStatus, getCurrentStage, getCurrentStageIndex, isTerminalState, getTerminalStateType, type TerminalStateType } from "../utils/status-utils";
import { useStageActions } from "../hooks";
import StageNotesModal from "./StageNotesModal";
import { UI_STRINGS } from "@/lib/constants/ui-strings";

const TERMINAL_STATE_MESSAGES: Record<TerminalStateType, string> = {
  rejected: UI_STRINGS.messages.rejected,
  withdrawn: UI_STRINGS.messages.withdrawn,
  offer: UI_STRINGS.messages.offerReceived,
};

const STEP_HOVER_SX = {
  cursor: "pointer",
  "&:hover .MuiStepLabel-root": {
    opacity: 0.8,
  },
} as const;

interface StageTimelineProps {
  stages: Stage[];
  applicationId: string;
  userRole?: string | null;
}

export default function StageTimeline({ stages, applicationId, userRole }: StageTimelineProps) {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  const activeStepIndex = getCurrentStageIndex(stages);
  const currentStage = getCurrentStage(stages) ?? null;
  const { advance, reject, withdraw, isPending } = useStageActions(applicationId, currentStage);

  const handleStageClick = (stage: Stage) => {
    setSelectedStage(stage);
  };

  const isTerminal = isTerminalState(stages);

  return (
    <>
      <SectionCard title="Application Timeline" headingClassName="mb-6">
        <Stepper activeStep={activeStepIndex} alternativeLabel>
          {stages.map((stage) => {
            const status = getStepStatus(stage.status);
            const hasNotes = !!stage.notes;

            return (
              <Step
                key={stage.id}
                completed={status.completed}
                sx={STEP_HOVER_SX}
                onClick={() => handleStageClick(stage)}
              >
                <StepLabel
                  error={status.error}
                  optional={
                    <Flex direction="column" align="center" gap={1}>
                      <Text variant="caption" color="secondary">
                        {stage.completedAt
                          ? formatDate(stage.completedAt)
                          : stage.startedAt
                            ? `Started ${formatDate(stage.startedAt)}`
                            : ""}
                      </Text>
                      {hasNotes && (
                        <Flex align="center" gap={1} className="text-primary/70">
                          <NoteIcon sx={{ fontSize: 12 }} />
                          <Text variant="caption" className="text-primary/70">
                            notes
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  }
                >
                  {stage.name}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Text
          variant="caption"
          color="secondary"
          className="text-center mt-4 opacity-60"
        >
          {UI_STRINGS.messages.stageClickHint}
        </Text>

        {currentStage && !isTerminal && userRole === 'techno_warlord' && (
          <StageActionButtons
            onAdvance={advance}
            onReject={reject}
            onWithdraw={withdraw}
            isPending={isPending}
          />
        )}

        {isTerminal && getTerminalStateType(stages) && (
          <Text
            variant="body2"
            color="secondary"
            className="text-center mt-4 pt-4 border-t border-border/50"
          >
            {TERMINAL_STATE_MESSAGES[getTerminalStateType(stages)!]}
          </Text>
        )}
      </SectionCard>

      {selectedStage && (
        <StageNotesModal
          open={!!selectedStage}
          stage={selectedStage}
          applicationId={applicationId}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </>
  );
}
