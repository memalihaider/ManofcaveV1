'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import {
  UserCircleIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BuildingOfficeIcon,
  KeyIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'

interface SavedProperty {
  id: string
  title: string
  price: number
  priceLabel: string
  image: string
  location: string
  type: string
}

export default function AccountPage() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'inquiries' | 'applications' | 'settings'>('profile')
  const [savedProperties] = useState<SavedProperty[]>([
    // Mock saved properties - in real app, this would come from database
    {
      id: '1',
      title: 'Luxury Penthouse in Downtown Dubai',
      price: 12500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Downtown Dubai, Dubai',
      type: 'Penthouse',
    },
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5 border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">My Account</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
                Welcome back, <span className="text-gradient">{profile?.full_name || user.email?.split('@')[0]}</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your profile, saved properties, and account settings.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSignOut}
                className="btn-outline flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-custom p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{profile?.full_name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'saved'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <HeartIcon className="h-5 w-5" />
                  Saved Properties ({savedProperties.length})
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'inquiries'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Inquiries
                </button>

                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'applications'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <KeyIcon className="h-5 w-5" />
                  Applications
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="card-custom p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                  <button className="btn-outline flex items-center gap-2">
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Full Name
                    </label>
                    <div className="p-3 bg-muted/50 rounded-lg text-foreground">
                      {profile?.full_name || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Email Address
                    </label>
                    <div className="p-3 bg-muted/50 rounded-lg text-foreground">
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="p-3 bg-muted/50 rounded-lg text-foreground">
                      {profile?.phone || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Account Type
                    </label>
                    <div className="p-3 bg-muted/50 rounded-lg text-foreground capitalize">
                      {profile?.role || 'User'}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/properties" className="card-custom p-4 hover:border-primary/50 transition-colors">
                      <HomeIcon className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-semibold text-foreground">Browse Properties</h4>
                      <p className="text-sm text-muted-foreground">Find your dream home</p>
                    </Link>

                    <Link href="/sell" className="card-custom p-4 hover:border-primary/50 transition-colors">
                      <BuildingOfficeIcon className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-semibold text-foreground">List Property</h4>
                      <p className="text-sm text-muted-foreground">Sell your property</p>
                    </Link>

                    <Link href="/services" className="card-custom p-4 hover:border-primary/50 transition-colors">
                      <KeyIcon className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-semibold text-foreground">Our Services</h4>
                      <p className="text-sm text-muted-foreground">Property management</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="card-custom p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Saved Properties</h2>

                {savedProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <HeartIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No saved properties yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start browsing properties and save your favorites for later.
                    </p>
                    <Link href="/properties" className="btn-primary">
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedProperties.map((property) => (
                      <div key={property.id} className="card-custom p-4">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-foreground mb-2">{property.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{property.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-semibold">
                            AED {property.price.toLocaleString()} {property.priceLabel}
                          </span>
                          <span className="text-sm text-muted-foreground">{property.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="card-custom p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">My Inquiries</h2>
                  <Link href="/properties" className="btn-primary">
                    Ask About a Property
                  </Link>
                </div>

                {/* Mock inquiries for demonstration */}
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          Luxury Penthouse in Downtown Dubai
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Sent 2 days ago • Status: <span className="text-yellow-600 font-medium">Pending Response</span>
                        </p>
                        <p className="text-sm text-foreground">
                          "I'm interested in this property and would like to know about the financing options available."
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          New
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          Modern 3BR Villa in Jumeirah
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Sent 1 week ago • Status: <span className="text-green-600 font-medium">Responded</span>
                        </p>
                        <p className="text-sm text-foreground">
                          "Can you provide more details about the neighborhood amenities and school districts?"
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Replied
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8 pt-6 border-t border-border">
                  <p className="text-muted-foreground mb-4">
                    Want to inquire about more properties?
                  </p>
                  <Link href="/properties" className="btn-primary">
                    Browse Properties
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="card-custom p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">My Applications</h2>
                  <Link href="/properties" className="btn-primary">
                    Apply for a Property
                  </Link>
                </div>

                {/* Mock applications for demonstration */}
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          Luxury Penthouse in Downtown Dubai
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Applied 3 days ago • Status: <span className="text-blue-600 font-medium">Under Review</span>
                        </p>
                        <p className="text-sm text-foreground mb-3">
                          Application for AED 12,500,000 penthouse with financing assistance requested.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📋 Documents submitted</span>
                          <span>💰 Financing: AED 8,000,000</span>
                          <span>📅 Timeline: 3-6 months</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          In Review
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          Modern 4BR Townhouse in Dubai Hills
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Applied 1 week ago • Status: <span className="text-green-600 font-medium">Approved</span>
                        </p>
                        <p className="text-sm text-foreground mb-3">
                          Application approved! Ready to proceed with purchase agreement.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>✅ Documents verified</span>
                          <span>💰 Down payment: AED 2,500,000</span>
                          <span>📅 Closing: Next month</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          Premium 3BR Apartment in Business Bay
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Applied 2 weeks ago • Status: <span className="text-yellow-600 font-medium">Pending Documents</span>
                        </p>
                        <p className="text-sm text-foreground mb-3">
                          Application submitted. Awaiting additional documentation from applicant.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📄 Documents needed</span>
                          <span>💰 Financing: Self-funded</span>
                          <span>📅 Timeline: Immediate</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8 pt-6 border-t border-border">
                  <p className="text-muted-foreground mb-4">
                    Ready to apply for more properties?
                  </p>
                  <Link href="/properties" className="btn-primary">
                    Browse Properties
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card-custom p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-border" defaultChecked />
                        <span className="text-foreground">Email notifications for new properties</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-border" defaultChecked />
                        <span className="text-foreground">Price change alerts</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-foreground">Marketing emails</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-border" defaultChecked />
                        <span className="text-foreground">Show my profile to agents</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-foreground">Allow property recommendations</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <button className="btn-outline text-red-400 border-red-400 hover:bg-red-400/10">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
