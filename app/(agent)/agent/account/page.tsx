'use client'

import { useState, useEffect } from 'react'
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, LinkIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface AgentProfile {
  id: string
  full_name: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  profile_image: string
  verification_status: 'verified' | 'pending' | 'unverified'
}

export default function AgentAccount() {
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<AgentProfile>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/agent/profile')
      const data = await res.json()
      setProfile(data.profile)
      setFormData(data.profile || {})
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/agent/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <ArrowPathIcon className="h-8 w-8 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <UserIcon className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Profile Management</span>
            </div>
            <h1 className="text-4xl font-serif text-secondary">
              Account <span className="text-primary italic">Settings</span>
            </h1>
            <p className="text-slate-500 mt-2">Manage your profile, preferences, and account information</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all shadow-lg shadow-secondary/20"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="space-y-6">
          {/* Profile Overview */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/50 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                {profile.full_name?.charAt(0).toUpperCase()}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-2">{profile.full_name}</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{profile.phone || 'Not provided'}</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                {/* Verification Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      profile.verification_status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : profile.verification_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {profile.verification_status === 'verified'
                      ? '✓ Verified'
                      : profile.verification_status === 'pending'
                      ? '⏳ Verification Pending'
                      : '○ Unverified'}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Edit Profile</h3>
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Dubai, UAE"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-muted-foreground" />
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Max 500 characters</p>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Account Security */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Security</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <span className="text-foreground font-medium">Change Password</span>
                <span className="text-muted-foreground">&gt;</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <span className="text-foreground font-medium">Two-Factor Authentication</span>
                <span className="text-muted-foreground">&gt;</span>
              </button>
            </div>
          </div>

          {/* Account Verification */}
          {profile.verification_status !== 'verified' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Verify Your Account</h3>
              <p className="text-yellow-800 mb-4">
                Verified agents get a badge on their profile and rank higher in search results. Complete verification to increase trust with potential buyers.
              </p>
              <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                Start Verification
              </button>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-red-800 mb-4">Delete your account and all associated data. This action cannot be undone.</p>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
