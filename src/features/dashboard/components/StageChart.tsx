"use client";

import { BarChart } from "@/design-system/components";
import { colors } from "@/design-system/tokens";
import { SectionCard } from "@/features/shared";

interface StageDistribution {
  stage: string;
  count: number;
}

interface StageChartProps {
  stageDistribution: StageDistribution[];
}

export default function StageChart({ stageDistribution }: StageChartProps) {
  const chartData = stageDistribution.map((item) => ({
    label: item.stage,
    value: item.count,
  }));

  return (
    <SectionCard title="Application Stage Distribution" className="h-full">
      <BarChart
        data={chartData}
        height={300}
        color={colors.primary.DEFAULT}
      />
    </SectionCard>
  );
}
