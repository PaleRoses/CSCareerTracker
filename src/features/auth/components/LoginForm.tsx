'use client'

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

export default function LoginForm() {
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <Box
      className="min-h-screen flex items-center justify-center"
      style={{
        padding: '24px',
        background:
          'radial-gradient(circle at top, rgba(110, 231, 255, 0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.1), transparent 50%)',
      }}
    >
      <Card style={{ maxWidth: '480px', width: '100%' }}>
        <CardContent style={{ padding: '48px 40px' }}>
          <Heading level={1} style={{ marginBottom: '16px', textAlign: 'center', fontSize: '2rem' }}>
            CS Career Tracker
          </Heading>

          <Text color="secondary" style={{ marginBottom: '40px', textAlign: 'center', fontSize: '1.125rem' }}>
            Track your job applications and land your dream role
          </Text>

          <Box style={{ marginTop: '24px' }}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              style={{
                borderRadius: '12px',
                fontWeight: 600,
                padding: '16px 24px',
                fontSize: '1rem'
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
