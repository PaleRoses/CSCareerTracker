"use client";

import { useMemo } from "react";
import { Grid } from "@/design-system/components";
import {
  WorkIcon,
  CheckCircleIcon,
  HourglassEmptyIcon,
  TrendingUpIcon,
} from "@/design-system/icons";

import StatCard from "@/components/ui/StatCard";
import { colors } from "@/design-system/tokens";

interface DashboardStats {
  totalApplications: number;
  offersReceived: number;
  pendingCount: number;
  responseRate: string;
}

interface StatsGridProps {
  /** Dashboard statistics data */
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statsItems = useMemo(() => [
    { title: "Total Applications", value: stats.totalApplications, icon: <WorkIcon />, color: colors.primary.DEFAULT },
    { title: "Offers Received", value: stats.offersReceived, icon: <CheckCircleIcon />, color: colors.success.DEFAULT },
    { title: "Pending", value: stats.pendingCount, icon: <HourglassEmptyIcon />, color: colors.warning.DEFAULT },
    { title: "Response Rate", value: stats.responseRate, icon: <TrendingUpIcon />, color: colors.secondary.DEFAULT },
  ], [stats.totalApplications, stats.offersReceived, stats.pendingCount, stats.responseRate]);

  return (
    <Grid container spacing={3} className="mb-8">
      {statsItems.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
          <StatCard title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
        </Grid>
      ))}
    </Grid>
  );
}

export type { DashboardStats };
