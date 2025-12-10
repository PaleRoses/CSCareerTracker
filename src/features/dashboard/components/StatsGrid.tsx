"use client";

import { useMemo } from "react";
import { Grid } from "@/design-system/components";
import {
  WorkIcon,
  CheckCircleIcon,
  HourglassEmptyIcon,
  TrendingUpIcon,
} from "@/design-system/icons";

import { StatCard } from "@/features/shared";
import { colors } from "@/design-system/tokens";

interface StatsGridProps {
  totalApplications: number;
  offersReceived: number;
  pendingApplications: number;
  responseRate: number;
}

export default function StatsGrid({
  totalApplications,
  offersReceived,
  pendingApplications,
  responseRate,
}: StatsGridProps) {
  const statsItems = useMemo(() => [
    { title: "Total Applications", value: totalApplications, icon: <WorkIcon />, color: colors.primary.DEFAULT },
    { title: "Offers Received", value: offersReceived, icon: <CheckCircleIcon />, color: colors.success.DEFAULT },
    { title: "Pending", value: pendingApplications, icon: <HourglassEmptyIcon />, color: colors.warning.DEFAULT },
    { title: "Response Rate", value: `${responseRate}%`, icon: <TrendingUpIcon />, color: colors.secondary.DEFAULT },
  ], [totalApplications, offersReceived, pendingApplications, responseRate]);

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
