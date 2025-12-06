'use client'

import { Box, LoadingDots } from '@/design-system/components'

export function CompaniesSkeleton() {
  return (
    <Box className="flex items-center justify-center min-h-[400px]">
      <LoadingDots size="lg" />
    </Box>
  )
}

export default CompaniesSkeleton
