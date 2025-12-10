'use client'

import { IconButton } from '@/design-system/components'
import { OpenInNewIcon } from '@/design-system/icons'

interface ExternalLinkButtonProps {
  url: string
  label?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function ExternalLinkButton({
  url,
  label = 'Open in new tab',
  size = 'small',
  className = 'text-foreground/50 hover:text-primary hover:bg-primary/10',
}: ExternalLinkButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <IconButton
      size={size}
      onClick={handleClick}
      aria-label={label}
      className={className}
    >
      <OpenInNewIcon />
    </IconButton>
  )
}
