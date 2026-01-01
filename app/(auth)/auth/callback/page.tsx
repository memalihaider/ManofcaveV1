'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { refreshProfile } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Mock auth session - assume success
        const mockSession = { user: { id: 'mock-user-id' } }

        if (mockSession) {
          // Refresh the profile data
          await refreshProfile()
          router.push('/account')
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/auth/login?error=auth_callback_error')
      }
    }

    handleAuthCallback()
  }, [router, refreshProfile])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Completing Sign In</h2>
        <p className="text-muted-foreground">Please wait while we set up your account...</p>
      </div>
    </div>
  )
}