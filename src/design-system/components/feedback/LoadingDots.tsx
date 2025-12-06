'use client'

import { colors, shadows } from '../../tokens'

export interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { container: 24, dot: 4 },
  md: { container: 40, dot: 6 },
  lg: { container: 56, dot: 8 },
}

const DOT_COUNT = 8

export function LoadingDots({ size = 'md', className }: LoadingDotsProps) {
  const { container, dot } = sizeMap[size]
  const radius = (container - dot) / 2

  return (
    <div
      className={className}
      style={{
        width: container,
        height: container,
        position: 'relative',
        animation: 'spinnerRotate 1s linear infinite',
      }}
    >
      {Array.from({ length: DOT_COUNT }).map((_, i) => {
        const angle = (i * 360) / DOT_COUNT
        const opacity = 1 - (i * 0.85) / DOT_COUNT
        const radian = (angle * Math.PI) / 180
        const x = radius * Math.cos(radian) + radius
        const y = radius * Math.sin(radian) + radius

        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              width: dot,
              height: dot,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.primary.DEFAULT}, ${colors.secondary.DEFAULT})`,
              boxShadow: i === 0 ? shadows.glow : 'none',
              opacity,
              left: x,
              top: y,
            }}
          />
        )
      })}
      <style>{`
        @keyframes spinnerRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoadingDots
