'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { mockUsers } from '@/lib/mock-data'

interface User {
  id: string
  email: string
}

interface Profile {
  id: string
  email: string
  full_name: string
  role: 'customer' | 'admin' | 'agent'
  phone: string
  avatar_url?: string
  location?: string
  bio?: string
  preferences?: any
  created_at?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  signInAsAdmin: (email: string, password: string) => Promise<{ error: any | null }>
  signInAsAgent: (email: string, password: string) => Promise<{ error: any | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('ragdol_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        const mockUser = mockUsers.find((u) => u.id === userData.id)
        if (mockUser) {
          setUser({ id: mockUser.id, email: mockUser.email })
          setProfile({
            id: mockUser.id,
            email: mockUser.email,
            full_name: mockUser.full_name,
            role: mockUser.role as any,
            phone: mockUser.phone,
            avatar_url: mockUser.avatar_url,
          })
        }
      } catch (e) {
        console.error('Error restoring session:', e)
      }
    }
    setLoading(false)
  }, [])

  async function fetchProfile(userId: string) {
    const mockUser = mockUsers.find((u) => u.id === userId)
    if (mockUser) {
      setProfile({
        id: mockUser.id,
        email: mockUser.email,
        full_name: mockUser.full_name,
        role: mockUser.role as any,
        phone: mockUser.phone,
        avatar_url: mockUser.avatar_url,
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock authentication - accept any email/password
      const mockUser = mockUsers.find((u) => u.email === email)
      if (!mockUser) {
        return { error: { message: 'User not found' } }
      }

      const userData = { id: mockUser.id, email: mockUser.email }
      localStorage.setItem('ragdol_user', JSON.stringify(userData))

      setUser({ id: mockUser.id, email: mockUser.email })
      await fetchProfile(mockUser.id)

      return { error: null }
    } catch (error: any) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true)
    try {
      // Mock sign up - create a new mock user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        full_name: userData?.full_name || '',
        role: 'customer' as const,
        phone: userData?.phone || '',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        created_at: new Date().toISOString(),
      }

      const sessionData = { id: newUser.id, email: newUser.email }
      localStorage.setItem('ragdol_user', JSON.stringify(sessionData))

      setUser({ id: newUser.id, email: newUser.email })
      setProfile({
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        phone: newUser.phone,
        avatar_url: newUser.avatar_url,
      })

      return { error: null }
    } catch (error: any) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    localStorage.removeItem('ragdol_user')
    setUser(null)
    setProfile(null)
    router.push('/')
  }

  const signInAsAdmin = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Check admin credentials
      const validAdminEmails = ['admin@ragdol.com', 'superadmin@ragdol.com', 'manager@ragdol.com']
      const validPassword = 'Admin123!'

      if (!validAdminEmails.includes(email) || password !== validPassword) {
        return { error: { message: 'Invalid admin credentials' } }
      }

      const adminUser = mockUsers.find((u) => u.email === email && u.role === 'admin')
      if (!adminUser) {
        return { error: { message: 'Admin user not found' } }
      }

      const userData = { id: adminUser.id, email: adminUser.email }
      localStorage.setItem('ragdol_user', JSON.stringify(userData))

      setUser({ id: adminUser.id, email: adminUser.email })
      await fetchProfile(adminUser.id)

      return { error: null }
    } finally {
      setLoading(false)
    }
  }

  const signInAsAgent = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Check agent credentials
      const validAgentEmails = ['agent@ragdol.com']
      const validPassword = 'Agent123!'

      if (!validAgentEmails.includes(email) || password !== validPassword) {
        return { error: { message: 'Invalid agent credentials' } }
      }

      const agentUser = mockUsers.find((u) => u.email === email && u.role === 'agent')
      if (!agentUser) {
        return { error: { message: 'Agent user not found' } }
      }

      const userData = { id: agentUser.id, email: agentUser.email }
      localStorage.setItem('ragdol_user', JSON.stringify(userData))

      setUser({ id: agentUser.id, email: agentUser.email })
      await fetchProfile(agentUser.id)

      return { error: null }
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        signInAsAdmin,
        signInAsAgent,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

