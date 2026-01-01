'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AgentSidebar from '@/components/layouts/AgentSidebar'

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  // Check if user is authenticated and has agent role
  useEffect(() => {
    if (!loading && (!user || (profile?.role !== 'agent' && profile?.role !== 'admin'))) {
      router.push('/auth/login')
    }
  }, [user, profile, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user || (profile?.role !== 'agent' && profile?.role !== 'admin')) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AgentSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="pt-20 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
