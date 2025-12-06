"use client";

import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";
import type { BarChartProps } from "./Chart.types";
import { colors } from "@/design-system/tokens";
import { cn } from "@/lib/utils";

/**
 * Styles for MUI Charts to match our design system.
 */
const chartStyles = {
  "& .MuiChartsAxis-tickLabel": {
    fill: colors.text.secondary,
  },
  "& .MuiChartsAxis-line": {
    stroke: colors.border.subtle,
  },
  "& .MuiChartsAxis-tick": {
    stroke: colors.border.subtle,
  },
  "& .MuiChartsGrid-line": {
    stroke: colors.border.faint,
  },
};

/**
 * BarChart - A bar chart component
 *
 * Wraps MUI BarChart with an abstract interface that can be
 * swapped to Recharts, Nivo, or another implementation.
 *
 * @example
 * const stageData = [
 *   { label: "Applied", value: 45 },
 *   { label: "Screening", value: 28 },
 *   { label: "Interview", value: 12 },
 *   { label: "Offer", value: 5 },
 * ];
 *
 * <BarChart
 *   data={stageData}
 *   height={300}
 *   color="#6ee7ff"
 * />
 */
export function BarChart({
  data,
  height = 300,
  color = colors.primary.DEFAULT,
  xAxisLabel,
  yAxisLabel,
  horizontal = false,
  showGrid = true,
  className,
}: BarChartProps) {
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);

  const barColors = data.some((d) => d.color)
    ? data.map((d) => d.color || color)
    : undefined;

  return (
    <MuiBarChart
      xAxis={[
        {
          scaleType: "band",
          data: labels,
          label: xAxisLabel,
        },
      ]}
      yAxis={[
        {
          label: yAxisLabel,
        },
      ]}
      series={[
        {
          data: values,
          color: barColors ? undefined : color,
          // If individual colors are provided, this would need custom rendering
        },
      ]}
      height={height}
      layout={horizontal ? "horizontal" : "vertical"}
      grid={{ horizontal: showGrid }}
      sx={chartStyles}
      className={cn(className)}
      hideLegend
    />
  );
}

export default BarChart;
