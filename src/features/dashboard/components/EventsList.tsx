"use client";

import {
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@/design-system/components";
import { EmptyState, SectionCard } from "@/features/shared";
import { cn, formatDate } from "@/lib/utils";
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_TO_CHIP_VARIANT,
} from "../constants";
import type { ActivityItem } from "../types";

interface EventsListProps {
  activities?: ActivityItem[];
}

export default function EventsList({ activities = [] }: EventsListProps) {
  return (
    <SectionCard title="Recent Activity">
      {activities.length === 0 ? (
        <EmptyState message="No recent activity." />
      ) : (
        <List>
          {activities.map((activity, index) => (
            <ListItem
              key={activity.id}
              className={cn(
                "flex items-center justify-between py-3",
                index < activities.length - 1 && "border-b border-white/[0.08]"
              )}
            >
              <ListItemText
                primary={activity.description}
                secondary={formatDate(activity.date)}
              />
              <Chip
                label={ACTIVITY_TYPE_LABELS[activity.type]}
                size="small"
                variant={ACTIVITY_TYPE_TO_CHIP_VARIANT[activity.type]}
              />
            </ListItem>
          ))}
        </List>
      )}
    </SectionCard>
  );
}

export type { ActivityItem };
