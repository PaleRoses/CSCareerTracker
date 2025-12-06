"use client";

import { Button, Flex } from "@/design-system/components";
import { CheckIcon, CloseIcon, LogoutIcon } from "@/design-system/icons";
import { UI_STRINGS } from "@/lib/constants/ui-strings";

interface StageActionButtonsProps {
  onAdvance: () => void;
  onReject: () => void;
  onWithdraw: () => void;
  isPending: boolean;
}

export function StageActionButtons({
  onAdvance,
  onReject,
  onWithdraw,
  isPending,
}: StageActionButtonsProps) {
  return (
    <Flex justify="center" gap={3} className="mt-4 pt-4 border-t border-border/50">
      <Button
        variant="primary"
        size="small"
        startIcon={<CheckIcon />}
        onClick={onAdvance}
        disabled={isPending}
        loading={isPending}
      >
        {isPending ? UI_STRINGS.loading.updating : UI_STRINGS.buttons.completeAndAdvance}
      </Button>
      <Button
        variant="danger"
        size="small"
        startIcon={<CloseIcon />}
        onClick={onReject}
        disabled={isPending}
      >
        {UI_STRINGS.buttons.markRejected}
      </Button>
      <Button
        variant="ghost"
        size="small"
        startIcon={<LogoutIcon />}
        onClick={onWithdraw}
        disabled={isPending}
      >
        {UI_STRINGS.buttons.withdraw}
      </Button>
    </Flex>
  );
}

export default StageActionButtons;
