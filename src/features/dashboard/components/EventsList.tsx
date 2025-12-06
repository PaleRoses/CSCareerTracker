"use client";

import {
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@/design-system/components";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionCard } from "@/components/ui/SectionCard";
import { cn, formatDate } from "@/lib/utils";
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_TO_CHIP_VARIANT,
} from "../constants";
import type { ActivityItem } from "@/lib/queries/core/types";

interface EventsListProps {
  /** Recent activity items to display */
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
