"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Heading,
  Button,
} from "@/design-system/components";
import {
  ArrowBackIcon,
  DeleteIcon,
  EditIcon,
} from "@/design-system/icons";
import StatusChip from "@/components/ui/StatusChip";
import { ROUTES } from "@/config/routes";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import type { OutcomeDisplayStatus } from "../constants";

interface ApplicationHeaderProps {
  positionTitle: string;
  company: string;
  outcome: OutcomeDisplayStatus;
  onEdit: () => void;
  onDelete: () => void;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (isOpen: boolean) => void;
  isPending: boolean;
}

export function ApplicationHeader({
  positionTitle,
  company,
  outcome,
  onEdit,
  onDelete,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  isPending,
}: ApplicationHeaderProps) {
  const router = useRouter();

  return (
    <Box className="mb-8">
      <Button
        variant="ghost"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(ROUTES.APPLICATIONS)}
        className="mb-4 text-foreground/60"
      >
        {UI_STRINGS.buttons.backToApplications}
      </Button>

      <Flex justify="between" align="start" wrap gap={4}>
        <Box>
          <Heading level={1}>{positionTitle}</Heading>
          <Heading level={3} className="text-foreground/60 font-medium">
            {company}
          </Heading>
        </Box>
        <Flex gap={4} align="center">
          <StatusChip status={outcome} size="medium" />
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            {UI_STRINGS.buttons.edit}
          </Button>
          {!isDeleteConfirmOpen ? (
            <Button
              variant="danger"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="border border-error"
            >
              {UI_STRINGS.buttons.delete}
            </Button>
          ) : (
            <Flex gap={2}>
              <Button
                variant="danger"
                size="small"
                onClick={onDelete}
                disabled={isPending}
              >
                {isPending ? UI_STRINGS.loading.deleting : UI_STRINGS.buttons.confirmDelete}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isPending}
              >
                {UI_STRINGS.buttons.cancel}
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default ApplicationHeader;
