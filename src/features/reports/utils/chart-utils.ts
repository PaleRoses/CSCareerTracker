export function formatMonth(month: string): string {
  const date = new Date(`${month}-01`)
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date)
}

export function normalizeToPercentage(value: number, max: number): number {
  if (max <= 0) return 0
  return (value / max) * 100
}

export interface ThresholdConfig {
  value: number
  className: string
}

export const CONVERSION_RATE_THRESHOLDS: ThresholdConfig[] = [
  { value: 75, className: 'bg-success/80' },
  { value: 50, className: 'bg-primary/80' },
  { value: 25, className: 'bg-warning/80' },
  { value: 0, className: 'bg-error/60' },
]

export function getThresholdColor(
  value: number,
  thresholds: ThresholdConfig[] = CONVERSION_RATE_THRESHOLDS
): string {
  for (const threshold of thresholds) {
    if (value >= threshold.value) {
      return threshold.className
    }
  }
  return thresholds[thresholds.length - 1]?.className ?? ''
}
