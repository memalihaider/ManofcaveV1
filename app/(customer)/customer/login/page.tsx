'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon, HomeIcon, SparklesIcon, BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function CustomerLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [success, setSuccess] = useState('')

  const { signIn, signUp } = useAuth()
  const router = useRouter()

  // Demo credentials for customers
  const DEMO_CREDENTIALS = {
    customer1: { email: 'customer@ragdol.com', password: 'Customer123!' },
    customer2: { email: 'john_doe@example.com', password: 'password123' },
    customer3: { email: 'sarah_smith@example.com', password: 'password456' }
  }

  const fillDemoCredentials = (customerKey: keyof typeof DEMO_CREDENTIALS) => {
    const credentials = DEMO_CREDENTIALS[customerKey]
    setFormData({
      email: credentials.email,
      password: credentials.password
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password)

        if (error) {
          setError(error.message)
        } else {
          router.push('/customer/dashboard')
        }
      } else {
        // Handle signup
        const { error } = await signUp(formData.email, formData.password, {
          fullName: 'Demo User',
          phone: '+971501234567',
          role: 'customer'
        })

        if (error) {
          setError(error.message)
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.')
          setTimeout(() => {
            setIsLogin(true)
            setSuccess('')
          }, 3000)
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">RAGDOL</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Find Your Dream <span className="text-gradient">Home</span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-lg">
                    Discover premium properties in Dubai. From luxury apartments to stunning villas, find your perfect home with expert guidance.
                  </p>
                </div>

                {/* Customer Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">What you can do:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Browse exclusive property listings
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Save and compare your favorite properties
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Get free property valuations
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Connect with certified agents
                    </li>
                  </ul>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/properties"
                    className="btn-primary"
                  >
                    Browse Properties
                  </Link>
                  <Link
                    href="/customer/property-valuation"
                    className="btn-outline"
                  >
                    Free Valuation
                  </Link>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="lg:pl-8">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <HomeIcon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      {isLogin
                        ? 'Sign in to access your personalized dashboard'
                        : 'Join RAGDOL to start your property journey'
                      }
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                      <p className="text-destructive text-sm">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <p className="text-green-600 text-sm">{success}</p>
                    </div>
                  )}

                  {/* Login/Signup Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                          {isLogin ? 'Signing In...' : 'Creating Account...'}
                        </div>
                      ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                      )}
                    </button>
                  </form>

                  {/* Demo Credentials */}
                  {isLogin && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/50">
                      <h3 className="text-foreground font-medium mb-3 text-sm">Demo Accounts</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => fillDemoCredentials('customer1')}
                          className="w-full text-left p-2 bg-background hover:bg-muted text-sm rounded-lg transition-colors border border-border"
                        >
                          <div className="font-medium">Demo Customer</div>
                          <div className="text-xs text-muted-foreground">customer@ragdol.com / Customer123!</div>
                        </button>
                        <button
                          onClick={() => fillDemoCredentials('customer2')}
                          className="w-full text-left p-2 bg-background hover:bg-muted text-sm rounded-lg transition-colors border border-border"
                        >
                          <div className="font-medium">John Doe</div>
                          <div className="text-xs text-muted-foreground">john_doe@example.com / password123</div>
                        </button>
                        <button
                          onClick={() => fillDemoCredentials('customer3')}
                          className="w-full text-left p-2 bg-background hover:bg-muted text-sm rounded-lg transition-colors border border-border"
                        >
                          <div className="font-medium">Sarah Smith</div>
                          <div className="text-xs text-muted-foreground">sarah_smith@example.com / password456</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Toggle between Login/Signup */}
                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin)
                        setError('')
                        setSuccess('')
                        setFormData({ email: '', password: '' })
                      }}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      {isLogin
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"
                      }
                    </button>
                  </div>

                  {/* Admin Link */}
                  <div className="text-center mt-4">
                    <Link
                      href="/admin/login"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Admin Portal →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">RAGDOL</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with Dubai's premier real estate platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BuildingOfficeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Verified Properties</h3>
              <p className="text-muted-foreground">All listings are verified and legally compliant</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <HomeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Expert Guidance</h3>
              <p className="text-muted-foreground">Professional agents to guide you through every step</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <SparklesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Premium Service</h3>
              <p className="text-muted-foreground">End-to-end support from search to closing</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}