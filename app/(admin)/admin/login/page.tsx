'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ShieldCheckIcon, 
  UserGroupIcon, 
  HomeIcon, 
  ArrowLeftIcon, 
  BuildingOfficeIcon, 
  SparklesIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

type UserRole = 'customer' | 'admin' | 'agent'

export default function EnhancedLoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { signIn, signUp, signInAsAdmin, signInAsAgent } = useAuth()

  const ADMIN_CREDENTIALS = [
    { email: 'admin@ragdol.com', password: 'Admin123!' },
    { email: 'superadmin@ragdol.com', password: 'Admin123!' },
    { email: 'manager@ragdol.com', password: 'Admin123!' }
  ]

  const DEMO_CREDENTIALS = {
    admin: { email: 'admin@ragdol.com', password: 'Admin123!' },
    customer: { email: 'customer@ragdol.com', password: 'Customer123!' },
    agent: { email: 'agent@ragdol.com', password: 'Agent123!' }
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
    setError('')
    setSuccess('')
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phone: ''
    })
  }

  const fillDemoCredentials = () => {
    const credentials = DEMO_CREDENTIALS[selectedRole]
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        let result
        if (selectedRole === 'admin') {
          const adminCred = ADMIN_CREDENTIALS.find(cred => cred.email === formData.email)
          if (adminCred && formData.password === adminCred.password) {
            result = await signInAsAdmin(formData.email, formData.password)
          } else {
            result = await signInAsAdmin(formData.email, formData.password)
          }
        } else if (selectedRole === 'agent') {
          result = await signInAsAgent(formData.email, formData.password)
        } else {
          result = await signIn(formData.email, formData.password)
        }

        if (result.error) {
          setError(result.error.message || 'Login failed. Please try again.')
        } else {
          switch (selectedRole) {
            case 'admin': router.push('/admin'); break
            case 'agent': router.push('/agent/dashboard'); break
            case 'customer': router.push('/customer/dashboard'); break
          }
        }
      } else {
        const result = await signUp(formData.email, formData.password, formData.fullName)
        if (result.error) {
          setError(result.error.message || 'Registration failed.')
        } else {
          setSuccess('Account created! Please check your email for verification.')
          setIsLogin(true)
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1600607687940-47a04b629571?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Interior"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <SparklesIcon className="h-7 w-7 text-secondary" />
            </div>
            <span className="text-3xl font-serif text-white tracking-tighter">RAGDOL</span>
          </div>
          <h1 className="text-5xl font-serif text-white mb-6 leading-tight">
            Welcome to the <span className="text-primary italic">Inner Circle</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-12">
            Access your bespoke real estate portfolio, manage elite listings, and connect with the world's most discerning investors.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="text-primary font-bold text-2xl mb-1">12k+</div>
              <div className="text-slate-400 text-sm uppercase tracking-widest">Elite Members</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="text-primary font-bold text-2xl mb-1">$4.2B</div>
              <div className="text-slate-400 text-sm uppercase tracking-widest">Assets Managed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white lg:rounded-l-[4rem] shadow-2xl">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-secondary mb-2">
              {isLogin ? 'Member Login' : 'Create Account'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Enter your credentials to access the portal' : 'Join our exclusive network of real estate professionals'}
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            {(['customer', 'agent', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 capitalize ${
                  selectedRole === role 
                    ? 'bg-white text-secondary shadow-md' 
                    : 'text-slate-400 hover:text-secondary'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            )}

            <div className="relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 text-emerald-600 text-sm rounded-xl border border-emerald-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300 shadow-xl shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <button
              onClick={fillDemoCredentials}
              className="w-full py-3 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-all"
            >
              Use Demo Credentials
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-slate-500 hover:text-secondary transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-primary font-bold underline underline-offset-4">
                  {isLogin ? 'Register Now' : 'Sign In'}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-secondary transition-colors">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </Link>
            <span className="text-xs text-slate-300 uppercase tracking-widest">© 2024 RAGDOL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
