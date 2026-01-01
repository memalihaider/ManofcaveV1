'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  HomeIcon,
  BuildingOfficeIcon,
  CubeIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MapIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { signOut, profile, user } = useAuth()

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
    },
   
     {
      name: 'Properties',
      href: '/admin/properties',
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
    },
    {
      name: 'Projects',
      href: '/admin/projects',
      icon: <CubeIcon className="h-5 w-5" />,
    },
     {
      name: 'Category',
      href: '/admin/category',
      icon: <CubeIcon className="h-5 w-5" />,
    },
    {
      name: 'Agents',
      href: '/admin/agents',
      icon: <UsersIcon className="h-5 w-5" />,
    },
    // {
    //   name: 'Download Interests',
    //   href: '/admin/download-interests',
    //   icon: <DocumentTextIcon className="h-5 w-5" />,
    // },
    // {
    //   name: 'Property Reviews',
    //   href: '/admin/property-reviews',
    //   icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
    // },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <UsersIcon className="h-5 w-5" />,
    },
    {
      name: 'Questions',
      href: '/admin/questions',
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
    },
    {
      name: 'Valuations',
      href: '/admin/valuations',
      icon: <ChartBarIcon className="h-5 w-5" />,
    },
    {
      name: 'Agent Properties',
      href: '/admin/agentproperties',
      icon: <ChartBarIcon className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Cog6ToothIcon className="h-5 w-5" />,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="top-4 fixed left-4 z-50 lg:hidden p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
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
        fixed left-0 top-0 h-screen w-64 bg-card border-r border-border
        transform transition-transform duration-300 z-40 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              R
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg">RAGDOL</h1>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </Link>
        </div>

      

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}



