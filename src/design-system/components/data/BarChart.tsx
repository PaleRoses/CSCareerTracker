"use client";

import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";
import type { BarChartProps } from "./Chart.types";
import { colors } from "@/design-system/tokens";
import { cn } from "@/lib/utils";

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
