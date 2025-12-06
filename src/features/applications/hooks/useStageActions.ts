"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Stage } from "@/features/applications/types";
import {
  advanceStageAction,
  withdrawApplicationAction,
  updateStageAction,
} from "../actions/update-stage.action";

interface UseStageActionsReturn {
  advance: () => void;
  reject: () => void;
  withdraw: () => void;
  isPending: boolean;
}

export function useStageActions(
  applicationId: string,
  currentStage: Stage | null
): UseStageActionsReturn {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const advance = () => {
    if (!currentStage) return;
    startTransition(async () => {
      const result = await advanceStageAction(applicationId, currentStage.id);
      if (result.success) {
        router.refresh();
      }
    });
  };

  const reject = () => {
    if (!currentStage) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("applicationId", applicationId);
      formData.set("stageId", currentStage.id);
      formData.set("status", "rejected");

      const result = await updateStageAction({ success: false }, formData);
      if (result.success) {
        router.refresh();
      }
    });
  };

  const withdraw = () => {
    startTransition(async () => {
      const result = await withdrawApplicationAction(applicationId);
      if (result.success) {
        router.refresh();
      }
    });
  };

  return { advance, reject, withdraw, isPending };
}
