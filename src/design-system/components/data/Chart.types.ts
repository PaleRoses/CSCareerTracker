/**
 * Chart Type Definitions
 *
 * Abstract interfaces for chart components.
 * These types are implementation-agnostic, allowing the underlying
 * library (MUI Charts, Recharts, Nivo, etc.) to be swapped.
 */

/**
 * A single data point for charts.
 */
export interface ChartDataPoint {
  /** Label for the data point (x-axis or legend) */
  label: string;
  /** Numeric value */
  value: number;
  /** Optional color override */
  color?: string;
}

/**
 * A data series for multi-series charts.
 */
export interface ChartSeries {
  /** Series identifier */
  id: string;
  /** Series display name */
  name: string;
  /** Data points in this series */
  data: number[];
  /** Series color */
  color?: string;
}

/**
 * Props for BarChart component.
 */
export interface BarChartProps {
  /** Data points to display */
  data: ChartDataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Bar color */
  color?: string;
  /** X-axis label */
  xAxisLabel?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Horizontal bars instead of vertical */
  horizontal?: boolean;
  /** Show grid lines */
  showGrid?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Props for PieChart component.
 */
export interface PieChartProps {
  /** Data points to display */
  data: ChartDataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Array of colors for slices */
  colors?: string[];
  /** Show labels on slices */
  showLabels?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Inner radius for donut chart (0 for pie) */
  innerRadius?: number;
  /** Additional class names */
  className?: string;
}

/**
 * Props for LineChart component.
 */
export interface LineChartProps {
  /** Data points to display */
  data: ChartDataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Line color */
  color?: string;
  /** X-axis label */
  xAxisLabel?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Fill area under line */
  area?: boolean;
  /** Curved line */
  curved?: boolean;
  /** Show data points */
  showDots?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Props for multi-series LineChart.
 */
export interface MultiLineChartProps {
  /** Categories for x-axis */
  categories: string[];
  /** Data series to display */
  series: ChartSeries[];
  /** Chart height in pixels */
  height?: number;
  /** X-axis label */
  xAxisLabel?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Show legend */
  showLegend?: boolean;
  /** Additional class names */
  className?: string;
}
