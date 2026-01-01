'use client'

import { useState } from 'react'
import { 
  Settings, Globe, Bell, Shield, 
  Database, Mail, Save, RefreshCw,
  User, Lock, Eye, EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API & Integrations', icon: Database },
    { id: 'email', label: 'Email Templates', icon: Mail },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your administrative dashboard and system preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold capitalize">{activeTab} Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your {activeTab} preferences and configurations.</p>
          </div>

          <div className="p-6 space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Site Name</label>
                  <input 
                    type="text" 
                    defaultValue="Ragdol Property" 
                    className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Support Email</label>
                  <input 
                    type="email" 
                    defaultValue="support@ragdol.com" 
                    className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Default Currency</label>
                  <select className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>AED (United Arab Emirates Dirham)</option>
                    <option>USD (US Dollar)</option>
                    <option>EUR (Euro)</option>
                    <option>GBP (British Pound)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Disable public access to the site during updates.</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted cursor-pointer">
                    <span className="translate-x-1 inline-block h-4 w-4 rounded-full bg-white transition" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">New Password</label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                    <span className="translate-x-6 inline-block h-4 w-4 rounded-full bg-white transition" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">New Property Inquiries</label>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">New User Registrations</label>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">System Alerts</label>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Marketing Updates</label>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === 'api' || activeTab === 'email') && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <RefreshCw className="h-12 w-12 mb-4 animate-pulse" />
                <p>This section is under development.</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-muted/30 border-t flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
