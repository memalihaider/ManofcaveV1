'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export interface DownloadInterestData {
  full_name: string
  email: string
  phone: string
  nationality: string
  occupation: string
  employer: string
  monthly_income: string
  interested_in_financing: boolean
  budget_range: string
  timeline: string
  additional_notes: string
}

interface DownloadInterestFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DownloadInterestData) => Promise<void>
  downloadType: 'floor_plan' | 'brochure'
  propertyTitle: string
}

export default function DownloadInterestForm({
  isOpen,
  onClose,
  onSubmit,
  downloadType,
  propertyTitle
}: DownloadInterestFormProps) {
  const [formData, setFormData] = useState<DownloadInterestData>({
    full_name: '',
    email: '',
    phone: '',
    nationality: '',
    occupation: '',
    employer: '',
    monthly_income: '',
    interested_in_financing: false,
    budget_range: '',
    timeline: '',
    additional_notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<DownloadInterestData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<DownloadInterestData> = {}

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        nationality: '',
        occupation: '',
        employer: '',
        monthly_income: '',
        interested_in_financing: false,
        budget_range: '',
        timeline: '',
        additional_notes: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof DownloadInterestData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 rounded-t-[2.5rem]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-secondary">
                {downloadType === 'floor_plan' ? 'Download Floor Plan' : 'Download Brochure'}
              </h2>
              <p className="text-slate-600 mt-1">{propertyTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-secondary">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all ${
                    errors.full_name ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.full_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all ${
                    errors.email ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all ${
                    errors.phone ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="+971 XX XXX XXXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="Enter your nationality"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-secondary">Professional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="e.g. Engineer, Doctor, Business Owner"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Employer/Company
                </label>
                <input
                  type="text"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="Enter your employer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Monthly Income (AED)
              </label>
              <input
                type="number"
                value={formData.monthly_income}
                onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="Enter your monthly income"
                min="0"
              />
            </div>
          </div>

          {/* Property Interest */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-secondary">Property Interest</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budget_range}
                  onChange={(e) => handleInputChange('budget_range', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                >
                  <option value="">Select budget range</option>
                  <option value="under_1m">Under AED 1,000,000</option>
                  <option value="1m_3m">AED 1M - 3M</option>
                  <option value="3m_5m">AED 3M - 5M</option>
                  <option value="5m_10m">AED 5M - 10M</option>
                  <option value="10m_20m">AED 10M - 20M</option>
                  <option value="over_20m">Over AED 20M</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                >
                  <option value="">Select timeline</option>
                  <option value="immediately">Immediately</option>
                  <option value="1-3_months">1-3 months</option>
                  <option value="3-6_months">3-6 months</option>
                  <option value="6-12_months">6-12 months</option>
                  <option value="just_researching">Just researching</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="financing"
                checked={formData.interested_in_financing}
                onChange={(e) => handleInputChange('interested_in_financing', e.target.checked)}
                className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
              />
              <label htmlFor="financing" className="text-sm font-bold text-slate-700">
                Interested in financing/mortgage options
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.additional_notes}
                onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                placeholder="Any additional information or questions..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-lg font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : `Download ${downloadType === 'floor_plan' ? 'Floor Plan' : 'Brochure'}`}
            </button>
            <p className="text-xs text-slate-500 text-center mt-3">
              By submitting this form, you agree to be contacted by our agents regarding this property.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}