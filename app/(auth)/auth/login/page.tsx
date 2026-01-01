'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UnifiedLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the primary admin login page
    router.replace('/admin/login')
  }, [router])

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
        <p className="text-[#a3a3a3]">Redirecting to login...</p>
      </div>
    </div>
  )
}