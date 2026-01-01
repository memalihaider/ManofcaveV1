'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  HomeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

export default function CustomerSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { signOut, profile, user } = useAuth()

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/customer/dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
    },
    
    {
      name: 'Property Valuation',
      href: '/customer/property-valuation',
      icon: <SparklesIcon className="h-5 w-5" />,
    },
    {
      name: 'My Inquiries',
      href: '/customer/questions',
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
    },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/10
        transform transition-transform duration-300 z-40 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <Link href="/customer/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-lg">
              R
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">RAGDOL</h1>
              <p className="text-xs text-slate-400">Customer Portal</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-sm font-medium text-white truncate">
            {profile?.full_name || user?.email || 'Customer'}
          </p>
          <p className="text-xs text-slate-400">Welcome back!</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.href)
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
