/**
 * Chart Type Definitions
 *
 * Abstract interfaces for chart components.
 * These types are implementation-agnostic, allowing the underlying
 * library (MUI Charts, Recharts, Nivo, etc.) to be swapped.
 */

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: number[];
  color?: string;
}

export interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  horizontal?: boolean;
  showGrid?: boolean;
  className?: string;
}

export interface PieChartProps {
  data: ChartDataPoint[];
  height?: number;
  colors?: string[];
  showLabels?: boolean;
  showLegend?: boolean;
  /** 0 for pie, >0 for donut */
  innerRadius?: number;
  className?: string;
}

export interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  area?: boolean;
  curved?: boolean;
  showDots?: boolean;
  className?: string;
}

export interface MultiLineChartProps {
  categories: string[];
  series: ChartSeries[];
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  className?: string;
}
