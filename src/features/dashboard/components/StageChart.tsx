"use client";

import { BarChart } from "@/design-system/components";
import { colors } from "@/design-system/tokens";
import { SectionCard } from "@/components/ui/SectionCard";

interface StageDistributionItem {
  stage: string;
  value: number;
}

interface StageChartProps {
  /** Stage distribution data */
  stageDistribution: StageDistributionItem[];
}

export default function StageChart({ stageDistribution }: StageChartProps) {
  const chartData = stageDistribution.map((item) => ({
    label: item.stage,
    value: item.value,
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

export type { StageDistributionItem };
