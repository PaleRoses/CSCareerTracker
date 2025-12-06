'use client'

import { cn } from '@/lib/utils'

export interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
  variant?: 'pulse' | 'wave' | 'none'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export function Skeleton({
  className = '',
  style,
  variant = 'pulse',
  rounded = 'md',
}: SkeletonProps) {
  const animationClass = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }[variant]

  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded]

  return (
    <div
      className={cn(
        'bg-surface-variant/50',
        animationClass,
        roundedClass,
        className
      )}
      style={style}
      aria-hidden="true"
      role="presentation"
    />
  )
}
