export function formatSize(size: number | null): string {
  if (!size) return 'Unknown'
  if (size >= 10000) return `${Math.floor(size / 1000)}k+ employees`
  if (size >= 1000) return `${(size / 1000).toFixed(1)}k employees`
  return `${size} employees`
}
