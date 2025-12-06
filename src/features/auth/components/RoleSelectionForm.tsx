'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ButtonBase from '@mui/material/ButtonBase'
import { Card, CardContent } from '@/design-system/components/surfaces/Card'
import { Button } from '@/design-system/components/inputs/Button'
import { Heading } from '@/design-system/components/primitives/Heading'
import { Text } from '@/design-system/components/primitives/Text'
import { Stack } from '@/design-system/components/primitives/Stack'
import { Box } from '@/design-system/components/primitives/Box'
import { CheckIcon } from '@/design-system/icons'
import { setUserRole } from '@/features/auth/actions'
import { ROLE_OPTIONS, ROLE_ICONS, type RoleOption } from '@/features/auth/constants'
import { ROUTES } from '@/config/routes'

export default function RoleSelectionForm() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role)
    setError(null)
  }

  const handleSubmit = () => {
    if (!selectedRole) {
      setError('Please select a role to continue')
      return
    }

    startTransition(async () => {
      const result = await setUserRole(selectedRole)

      if (result.success) {
        router.push(ROUTES.DASHBOARD)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <Box className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Stack direction="vertical" gap={6} className="max-w-3xl w-full">
        <Stack direction="vertical" gap={2} className="text-center">
          <Heading level={1} className="text-4xl font-bold">
            Welcome to Career Tracker
          </Heading>
          <Text className="text-foreground-muted text-lg">
            Choose how you&apos;ll use the platform
          </Text>
        </Stack>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROLE_OPTIONS.map((option) => {
            const isSelected = selectedRole === option.value
            const IconComponent = ROLE_ICONS[option.iconId]

            return (
              <ButtonBase
                key={option.value}
                onClick={() => handleRoleSelect(option.value)}
                className="rounded-xl text-left w-full"
                sx={{ borderRadius: '0.75rem' }}
              >
                <Card
                  glass
                  className={`w-full transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-8">
                    <Stack direction="vertical" gap={4} className="items-center text-center">
                      <Box className="p-4 rounded-xl bg-primary/10">
                        <IconComponent className="text-primary w-10 h-10" />
                      </Box>

                      <Heading level={3} className="text-xl font-semibold">
                        {option.label}
                      </Heading>

                      <Text className="text-foreground-muted text-sm leading-relaxed">
                        {option.description}
                      </Text>

                      <Box className={`flex items-center gap-1 h-5 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                        <CheckIcon className="text-primary w-4 h-4" />
                        <Text className="text-primary font-medium text-sm">Selected</Text>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </ButtonBase>
            )
          })}
        </Box>

        {error && (
          <Box className="bg-error/10 border border-error rounded-lg p-3 text-center">
            <Text className="text-error">{error}</Text>
          </Box>
        )}

        <Box className="flex justify-center">
          <Button
            variant="gradient"
            size="large"
            onClick={handleSubmit}
            disabled={!selectedRole || isPending}
            loading={isPending}
            className="min-w-[200px]"
          >
            {isPending ? 'Setting up...' : 'Get Started'}
          </Button>
        </Box>

        <Text className="text-center text-foreground-muted text-sm">
          You can change your role later in settings
        </Text>
      </Stack>
    </Box>
  )
}
