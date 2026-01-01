'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  ArrowLeftIcon,
  KeyIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  DocumentIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

interface Property {
  id: string
  title: string
  price: number
  priceLabel: string
  image: string
  location: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  description: string
}

export default function PropertyApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const propertyId = params.propertyId as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    residencyStatus: '',

    // Financial Information
    occupation: '',
    employer: '',
    monthlyIncome: '',
    annualIncome: '',
    downPayment: '',
    financingNeeded: false,
    financingAmount: '',
    mortgagePreferred: false,
    bankName: '',
    creditScore: '',

    // Property Requirements
    budgetMin: '',
    budgetMax: '',
    timeline: 'flexible',

    // Application Details
    coverLetter: '',
    specialRequests: '',
    preferredContactMethod: 'email',
  })

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
      }))
    }
  }, [profile, user])

  useEffect(() => {
    // Fetch property details
    const fetchProperty = async () => {
      try {
        // In a real app, this would be an API call
        const mockProperty: Property = {
          id: propertyId,
          title: 'Luxury Penthouse in Downtown Dubai',
          price: 12500000,
          priceLabel: 'total',
          image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
          location: 'Downtown Dubai, Dubai',
          type: 'Penthouse',
          bedrooms: 3,
          bathrooms: 4,
          area: 2500,
          description: 'Stunning penthouse with panoramic city views, featuring premium finishes and world-class amenities.',
        }
        setProperty(mockProperty)
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // In a real app, this would submit to an API
      console.log('Submitting application:', { propertyId, ...formData })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Redirect to account page with success message
      router.push('/account?tab=applications&success=true')
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Property not found</p>
          <Link href="/properties" className="btn-primary mt-4">
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5 border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Application</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <Link
                href={`/properties/${propertyId}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Property
              </Link>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
                Apply for This Property
              </h1>
              <p className="text-lg text-muted-foreground">
                Submit your application and our team will review it within 24-48 hours.
              </p>
            </div>

            {/* Property Preview */}
            <div className="lg:w-96">
              <div className="card-custom p-6">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-foreground mb-2">{property.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{property.location}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary font-semibold">
                    AED {property.price.toLocaleString()} {property.priceLabel}
                  </span>
                  <span className="text-sm text-muted-foreground">{property.type}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.area} sqft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {currentStep === 1 && 'Personal Information'}
                {currentStep === 2 && 'Financial Details'}
                {currentStep === 3 && 'Review & Submit'}
              </h2>
              <p className="text-muted-foreground">
                {currentStep === 1 && 'Tell us about yourself'}
                {currentStep === 2 && 'Share your financial information'}
                {currentStep === 3 && 'Review your application before submitting'}
              </p>
            </div>
          </div>

          <div className="card-custom p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-foreground mb-2">
                        Nationality
                      </label>
                      <input
                        id="nationality"
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                        className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                        placeholder="e.g., Emirati, British, American"
                      />
                    </div>

                    <div>
                      <label htmlFor="residencyStatus" className="block text-sm font-medium text-foreground mb-2">
                        Residency Status
                      </label>
                      <select
                        id="residencyStatus"
                        value={formData.residencyStatus}
                        onChange={(e) => setFormData(prev => ({ ...prev, residencyStatus: e.target.value }))}
                        className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      >
                        <option value="">Select status</option>
                        <option value="citizen">Citizen</option>
                        <option value="resident">Resident</option>
                        <option value="tourist">Tourist</option>
                        <option value="investor">Investor</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Financial Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="occupation" className="block text-sm font-medium text-foreground mb-2">
                        Occupation
                      </label>
                      <input
                        id="occupation"
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                        className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                        placeholder="e.g., Engineer, Doctor, Business Owner"
                      />
                    </div>

                    <div>
                      <label htmlFor="employer" className="block text-sm font-medium text-foreground mb-2">
                        Employer
                      </label>
                      <input
                        id="employer"
                        type="text"
                        value={formData.employer}
                        onChange={(e) => setFormData(prev => ({ ...prev, employer: e.target.value }))}
                        className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="monthlyIncome" className="block text-sm font-medium text-foreground mb-2">
                        Monthly Income (AED)
                      </label>
                      <div className="relative">
                        <CurrencyDollarIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                          id="monthlyIncome"
                          type="number"
                          value={formData.monthlyIncome}
                          onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                          placeholder="Enter monthly income"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="annualIncome" className="block text-sm font-medium text-foreground mb-2">
                        Annual Income (AED)
                      </label>
                      <div className="relative">
                        <CurrencyDollarIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                          id="annualIncome"
                          type="number"
                          value={formData.annualIncome}
                          onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                          placeholder="Enter annual income"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="downPayment" className="block text-sm font-medium text-foreground mb-2">
                        Down Payment (AED)
                      </label>
                      <div className="relative">
                        <CurrencyDollarIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                          id="downPayment"
                          type="number"
                          value={formData.downPayment}
                          onChange={(e) => setFormData(prev => ({ ...prev, downPayment: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                          placeholder="Available down payment"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-foreground mb-2">
                        Purchase Timeline
                      </label>
                      <select
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      >
                        <option value="immediately">Immediately</option>
                        <option value="1-3_months">1-3 Months</option>
                        <option value="3-6_months">3-6 Months</option>
                        <option value="6-12_months">6-12 Months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.financingNeeded}
                        onChange={(e) => setFormData(prev => ({ ...prev, financingNeeded: e.target.checked }))}
                        className="rounded border-border"
                      />
                      <span className="text-foreground">I need financing/mortgage assistance</span>
                    </label>

                    {formData.financingNeeded && (
                      <div className="ml-6 space-y-3">
                        <div>
                          <label htmlFor="financingAmount" className="block text-sm font-medium text-foreground mb-2">
                            Financing Amount Needed (AED)
                          </label>
                          <input
                            id="financingAmount"
                            type="number"
                            value={formData.financingAmount}
                            onChange={(e) => setFormData(prev => ({ ...prev, financingAmount: e.target.value }))}
                            className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                            placeholder="Amount needed for financing"
                          />
                        </div>

                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.mortgagePreferred}
                            onChange={(e) => setFormData(prev => ({ ...prev, mortgagePreferred: e.target.checked }))}
                            className="rounded border-border"
                          />
                          <span className="text-foreground">I prefer mortgage options</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Application Summary</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Full Name:</span>
                        <p className="text-foreground">{formData.fullName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Email:</span>
                        <p className="text-foreground">{formData.email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Phone:</span>
                        <p className="text-foreground">{formData.phone}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Timeline:</span>
                        <p className="text-foreground">{formData.timeline.replace('_', ' ')}</p>
                      </div>
                      {formData.financingNeeded && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-muted-foreground">Financing:</span>
                          <p className="text-foreground">
                            Needs AED {formData.financingAmount} financing
                            {formData.mortgagePreferred && ' (prefers mortgage)'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-foreground mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      id="coverLetter"
                      rows={4}
                      value={formData.coverLetter}
                      onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                      className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
                      placeholder="Tell us why you're interested in this property..."
                    />
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-foreground mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      rows={3}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      value={formData.preferredContactMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredContactMethod: e.target.value }))}
                      className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-outline"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary ml-auto"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Application...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <PaperAirplaneIcon className="h-4 w-4" />
                        Submit Application
                      </div>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}