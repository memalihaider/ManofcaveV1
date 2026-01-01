'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
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

export default function PropertyInquiryPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const propertyId = params.propertyId as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'general',
    preferredContact: 'email',
    timeline: 'flexible',
    financing: false,
  })

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.full_name || '',
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
        // For now, we'll use mock data
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
      console.log('Submitting inquiry:', { propertyId, ...formData })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to account page with success message
      router.push('/account?tab=inquiries&success=true')
    } catch (error) {
      console.error('Error submitting inquiry:', error)
    } finally {
      setSubmitting(false)
    }
  }

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
            <span className="text-foreground font-medium">Inquiry</span>
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
                Inquire About This Property
              </h1>
              <p className="text-lg text-muted-foreground">
                Get in touch with our agents to learn more about this property.
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

      {/* Inquiry Form */}
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card-custom p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Send Your Inquiry</h2>
                <p className="text-muted-foreground">Our agents will respond within 24 hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inquiry Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What would you like to know?
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value }))}
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                >
                  <option value="general">General Information</option>
                  <option value="pricing">Pricing & Financing</option>
                  <option value="availability">Availability & Viewing</option>
                  <option value="documents">Legal Documents</option>
                  <option value="neighborhood">Neighborhood Information</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <input
                      id="phone"
                      type="tel"
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

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value }))}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Timeline
                  </label>
                  <select
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

              {/* Financing Interest */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.financing}
                    onChange={(e) => setFormData(prev => ({ ...prev, financing: e.target.checked }))}
                    className="rounded border-border"
                  />
                  <span className="text-foreground">I'm interested in financing options</span>
                </label>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Tell us more about your interest in this property..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Inquiry...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <PaperAirplaneIcon className="h-4 w-4" />
                      Send Inquiry
                    </div>
                  )}
                </button>
                <Link
                  href={`/properties/${propertyId}`}
                  className="btn-outline"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}