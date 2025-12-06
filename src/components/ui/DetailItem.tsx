'use client'

import type { ReactNode } from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@/design-system/components'

interface DetailItemProps {
  icon: ReactNode
  label: string
  value: ReactNode
  iconColor?: string
}

export function DetailItem({
  icon,
  label,
  value,
  iconColor = 'text-primary',
}: DetailItemProps) {
  return (
    <ListItem className="py-2 px-0">
      <ListItemIcon className={`min-w-[36px] ${iconColor}`}>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} secondary={value} />
    </ListItem>
  )
}

export default DetailItem
