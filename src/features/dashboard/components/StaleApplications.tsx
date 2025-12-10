"use client";

import {
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@/design-system/components";
import { EmptyState, SectionCard } from "@/features/shared";
import { STALE_THRESHOLD_DAYS } from "../constants";

interface StaleApplication {
  id: string;
  company: string;
  currentStage: string;
  daysSinceUpdate: number;
}

interface StaleApplicationsProps {
  staleApplications: StaleApplication[];
}

export default function StaleApplications({ staleApplications }: StaleApplicationsProps) {
  return (
    <SectionCard
      title="Needs Attention"
      subtitle={`Applications with no activity for ${STALE_THRESHOLD_DAYS}+ days`}
      className="h-full"
    >
      {staleApplications.length === 0 ? (
        <EmptyState message="All applications are up to date!" />
      ) : (
        <List dense>
          {staleApplications.map((app) => (
            <ListItem key={app.id} disablePadding className="mb-2 flex items-center justify-between">
              <ListItemText
                primary={app.company}
                secondary={`${app.currentStage} • ${app.daysSinceUpdate} days`}
              />
              <Chip
                label="Follow up"
                size="small"
                variant="pending"
                className="border border-warning/50"
              />
            </ListItem>
          ))}
        </List>
      )}
    </SectionCard>
  );
}
