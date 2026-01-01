'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface UserFormData {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'agent' | 'admin'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  avatar?: string
  location: string
  password?: string
  confirmPassword?: string
  // Agent specific fields
  agency?: string
  licenseNumber?: string
  specialties?: string[]
  // Customer preferences
  preferences?: {
    propertyTypes: string[]
    priceRange: { min: number; max: number }
    locations: string[]
  }
}

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UserFormData) => void
  initialData?: Partial<UserFormData>
  mode?: 'create' | 'edit'
}

const propertyTypes = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
  'Studio',
  'Commercial',
  'Plot',
  'Office'
]

const locations = [
  'Dubai Marina',
  'Business Bay',
  'Jumeirah',
  'Palm Jumeirah',
  'Dubai Silicon Oasis',
  'Dubai Festival City',
  'Al Barsha',
  'Dubai Hills Estate',
  'Dubai Creek Harbour',
  'Bluewaters Island'
]

const specialties = [
  'Luxury Properties',
  'Commercial Properties',
  'Investment Properties',
  'Residential Properties',
  'Office Spaces',
  'Retail Properties',
  'Waterfront Properties',
  'Off-Plan Properties'
]

export default function UserForm({ isOpen, onClose, onSubmit, initialData, mode = 'create' }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    location: '',
    password: '',
    confirmPassword: '',
    preferences: {
      propertyTypes: [],
      priceRange: { min: 0, max: 0 },
      locations: []
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        preferences: {
          propertyTypes: initialData.preferences?.propertyTypes || [],
          priceRange: initialData.preferences?.priceRange || { min: 0, max: 0 },
          locations: initialData.preferences?.locations || []
        }
      })
    } else {
      // Reset form for create mode
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        status: 'active',
        location: '',
        password: '',
        confirmPassword: '',
        preferences: {
          propertyTypes: [],
          priceRange: { min: 0, max: 0 },
          locations: []
        }
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (mode === 'create') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    if (formData.role === 'agent') {
      if (!formData.agency?.trim()) {
        newErrors.agency = 'Agency is required for agents'
      }
      if (!formData.licenseNumber?.trim()) {
        newErrors.licenseNumber = 'License number is required for agents'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = { ...formData }
    if (mode === 'edit') {
      delete submitData.password
      delete submitData.confirmPassword
    }

    onSubmit(submitData)
    onClose()
  }

  const handlePropertyTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        propertyTypes: prev.preferences!.propertyTypes.includes(type)
          ? prev.preferences!.propertyTypes.filter(t => t !== type)
          : [...prev.preferences!.propertyTypes, type]
      }
    }))
  }

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        locations: prev.preferences!.locations.includes(location)
          ? prev.preferences!.locations.filter(l => l !== location)
          : [...prev.preferences!.locations, location]
      }
    }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties?.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...(prev.specialties || []), specialty]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {mode === 'create' ? 'Add New User' : 'Edit User'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.name ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="+971 XX XXX XXXX"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.location ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter location"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password Section (Create Mode Only) */}
          {mode === 'create' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full px-4 py-2 pr-10 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.password ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-4 py-2 pr-10 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Agent Information */}
          {formData.role === 'agent' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Agent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Agency *
                  </label>
                  <input
                    type="text"
                    value={formData.agency || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, agency: e.target.value }))}
                    className={`w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.agency ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter agency name"
                  />
                  {errors.agency && <p className="text-red-500 text-sm mt-1">{errors.agency}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    License Number *
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    className={`w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.licenseNumber ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter license number"
                  />
                  {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Specialties
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {specialties.map((specialty) => (
                    <label key={specialty} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.specialties?.includes(specialty) || false}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        className="rounded border-border text-primary focus:ring-primary/50"
                      />
                      <span className="text-sm text-foreground">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Customer Preferences */}
          {formData.role === 'customer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Property Preferences</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Property Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {propertyTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.preferences?.propertyTypes.includes(type) || false}
                        onChange={() => handlePropertyTypeToggle(type)}
                        className="rounded border-border text-primary focus:ring-primary/50"
                      />
                      <span className="text-sm text-foreground">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minimum Price (AED)
                  </label>
                  <input
                    type="number"
                    value={formData.preferences?.priceRange.min || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences!,
                        priceRange: { ...prev.preferences!.priceRange, min: Number(e.target.value) }
                      }
                    }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Maximum Price (AED)
                  </label>
                  <input
                    type="number"
                    value={formData.preferences?.priceRange.max || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences!,
                        priceRange: { ...prev.preferences!.priceRange, max: Number(e.target.value) }
                      }
                    }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Preferred Locations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.preferences?.locations.includes(location) || false}
                        onChange={() => handleLocationToggle(location)}
                        className="rounded border-border text-primary focus:ring-primary/50"
                      />
                      <span className="text-sm text-foreground">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {mode === 'create' ? 'Create User' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}