'use client'

import Image from 'next/image'
import { signIn } from 'next-auth/react'
import {
  Box,
  Card,
  CardContent,
  Heading,
  Text,
  Button,
} from '@/design-system/components'
import { GoogleIcon } from '@/design-system/icons'
import developmentySeal from '@/design-system/icons/developmenty_seal.svg'

export default function LoginForm() {
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <Box className="min-h-screen flex items-center justify-center p-6 bg-login-gradient">
      <Card className="max-w-[480px] w-full">
        <CardContent className="px-10 py-12">
          <Box className="flex justify-center mb-6">
            <Image
              src={developmentySeal}
              alt="Development Dynasty Seal"
              width={220}
              height={220}
              priority
            />
          </Box>

          <Heading level={1} className="mb-4 text-center text-3xl">
            CS Career Tracker
          </Heading>

          <Text color="secondary" className="mb-10 text-center text-lg">
            Track your job applications and land your dream role
          </Text>

          <Box className="mt-6">
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              className="rounded-xl font-semibold py-4 px-6 text-base"
            >
              Continue with Google
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
