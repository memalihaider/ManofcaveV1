'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PropertyForm from '@/components/forms/PropertyForm'
import { ArrowLeftIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function NewPropertyPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (propertyData: any) => {
    setIsSubmitting(true)
    try {
      // Submit property for review instead of publishing directly
      const submissionData = {
        ...propertyData,
        agent_id: profile?.id,
        review_status: 'pending_review', // New status for admin approval
        published: false, // Will be set to true by admin after approval
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      const response = await fetch('/api/agent/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        const result = await response.json()
        // Redirect to properties list with success message
        router.push('/agent/properties?submitted=true')
      } else {
        throw new Error('Failed to submit property')
      }
    } catch (error) {
      console.error('Error submitting property:', error)
      alert('Failed to submit property. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/agent/properties"
                className="flex items-center gap-2 text-slate-400 hover:text-secondary transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Properties
              </Link>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2 text-primary">
                <BuildingOfficeIcon className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest">New Property</span>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-serif text-secondary">Submit Property</h1>
              <p className="text-sm text-slate-500">Your listing will be reviewed by our admin team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-xl">
              <BuildingOfficeIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 mb-2">Property Submission Process</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Fill out all property details accurately</li>
                <li>• Upload high-quality images (minimum 3 photos)</li>
                <li>• Your submission will be reviewed by our admin team within 24-48 hours</li>
                <li>• Once approved, your property will be published and visible to buyers</li>
              </ul>
            </div>
          </div>
        </div>

        <PropertyForm
          isOpen={true}
          onClose={() => router.push('/agent/properties')}
          onSubmit={handleSubmit}
          mode="create"
          agents={[]} // Not needed for agent submission
          categories={[]} // Will be handled by the form component
        />

        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg font-medium text-secondary">Submitting Property...</p>
              <p className="text-sm text-slate-500 mt-2">Please wait while we process your submission</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
