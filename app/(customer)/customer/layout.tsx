'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import CustomerSidebar from '@/components/layouts/CustomerSidebar'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isAuthPage = pathname === '/customer/login' || pathname === '/customer/signup'

  useEffect(() => {
    if (!loading && !isAuthPage && !user) {
      router.push('/customer/login')
    }
  }, [user, loading, router, isAuthPage])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <CustomerSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
