'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircleIcon, XCircleIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface PendingProperty {
  id: string
  title: string
  description: string
  type: string
  category?: string
  price: number
  currency: string
  beds: number
  baths: number
  sqft: number
  address: string
  area: string
  city: string
  images: string[]
  review_status: string
  submitted_at: string
  created_at: string
  // Contact Info
  name?: string
  phone?: string
  email?: string
  nationality?: string
  preferred_contact?: string
  user_role?: string
}

export default function PropertyReviewsPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<PendingProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<PendingProperty | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('pending_review')

  useEffect(() => {
    fetchProperties()
  }, [filter])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const status = filter === 'pending_review' ? 'pending' : filter === 'approved' ? 'approved' : 'pending'
      const response = await fetch(`/api/property-reviews?status=${status}`)
      const data = await response.json()
      setProperties(data.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (propertyId: string) => {
    if (!confirm('Are you sure you want to approve this property?')) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/property-reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          action: 'approve'
        })
      })

      const data = await response.json()

      if (data.success) {
        setReviewNotes('')
        setReviewingId(null)
        setSelectedProperty(null)
        fetchProperties()
      }
    } catch (error) {
      console.error('Error approving property:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async (propertyId: string) => {
    if (!confirm('Are you sure you want to reject this property?')) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/property-reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          action: 'reject'
        })
      })

      const data = await response.json()

      if (data.success) {
        setReviewNotes('')
        setReviewingId(null)
        setSelectedProperty(null)
        fetchProperties()
      }
    } catch (error) {
      console.error('Error rejecting property:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getImageSrc = (images: string[]) => {
    if (!images || images.length === 0) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
    }
    return images[0]
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Property Reviews</h1>
          <p className="text-muted-foreground">Manage and approve pending property listings</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {(['pending_review', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === status
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {status === 'pending_review' ? 'Pending Review' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <ArrowPathIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Property Image */}
                <div className="relative h-48 w-full bg-muted overflow-hidden">
                  <Image
                    src={getImageSrc(property.images)}
                    alt={property.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {property.type}
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-1 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-primary font-bold text-lg mb-3">
                    {property.currency} {property.price.toLocaleString()}
                  </p>

                  {/* Details */}
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{property.address}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Submitted: {new Date(property.submitted_at || property.created_at).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Review
                    </button>
                    <Link
                      href={`/properties/${property.id}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">{selectedProperty.title}</h2>
                <button
                  onClick={() => {
                    setSelectedProperty(null)
                    setReviewNotes('')
                    setReviewingId(null)
                  }}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Property Image</h3>
                    <div className="relative h-64 w-full bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={getImageSrc(selectedProperty.images)}
                        alt={selectedProperty.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="text-foreground">{selectedProperty.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-bold text-primary">
                        {selectedProperty.currency} {selectedProperty.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="text-lg font-bold text-foreground capitalize">{selectedProperty.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="text-lg font-bold text-foreground">{selectedProperty.beds}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="text-lg font-bold text-foreground">{selectedProperty.baths}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="text-lg font-bold text-foreground">{selectedProperty.sqft.toLocaleString()} sqft</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-lg font-bold text-foreground">{selectedProperty.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="text-lg font-bold text-foreground capitalize">{selectedProperty.category || 'Residential'}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold text-foreground">{selectedProperty.name || 'N/A'} ({selectedProperty.user_role || 'Owner'})</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nationality</p>
                        <p className="font-semibold text-foreground">{selectedProperty.nationality || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-semibold text-foreground">{selectedProperty.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-semibold text-foreground">{selectedProperty.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Preferred Contact</p>
                        <p className="font-semibold text-foreground capitalize">{selectedProperty.preferred_contact || 'WhatsApp'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Review Notes {filter === 'pending_review' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes for approval or rejection reasons..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                {filter === 'pending_review' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(selectedProperty.id)}
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedProperty.id)}
                      disabled={submitting || !reviewNotes.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      <XCircleIcon className="h-5 w-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProperty(null)
                        setReviewNotes('')
                        setReviewingId(null)
                      }}
                      className="px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                )}

                {filter !== 'pending_review' && (
                  <button
                    onClick={() => {
                      setSelectedProperty(null)
                      setReviewNotes('')
                      setReviewingId(null)
                    }}
                    className="w-full px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
