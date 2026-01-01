'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import FloatingActionButtons from '@/components/shared/FloatingActionButtons'
import FloatingTools from '@/components/shared/FloatingTools'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAgentPortal = pathname?.startsWith('/agent')
  const isAdminPortal = pathname?.startsWith('/admin')
  const isCustomerPortal = pathname?.startsWith('/customer')

  const isPortal = isAgentPortal || isAdminPortal || isCustomerPortal

  return (
    <>
      {!isPortal && <Header />}
      <main className={`flex-2 ${!isPortal ? 'pt-20' : ''}`}>
        {children}
      </main>
      {!isPortal && <Footer />}
      {!isPortal && <FloatingActionButtons />}
      {!isPortal && <FloatingTools />}
    </>
  )
}