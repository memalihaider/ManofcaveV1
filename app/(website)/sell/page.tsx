'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import { CheckIcon, PhotoIcon, DocumentTextIcon, CurrencyDollarIcon, XMarkIcon, DocumentIcon, MapPinIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import('@/components/shared/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center border border-border">
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <MapPinIcon className="w-8 h-8 animate-bounce" />
        <p className="text-sm font-medium">Loading Map...</p>
      </div>
    </div>
  )
})

const steps = [
  { id: 1, title: 'Property Details', description: 'Tell us about your property' },
  { id: 2, title: 'Pricing & Photos', description: 'Set price and upload images' },
  { id: 3, title: 'Contact Info', description: 'Your contact information' },
  { id: 4, title: 'Review & Publish', description: 'Review and go live' },
]

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    propertyType: 'apartment',
    category: 'residential',
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    location: '',
    latitude: 25.2048, // Default Dubai
    longitude: 55.2708,
    price: '',
    description: '',
    name: '',
    phone: '',
    email: '',
    nationality: '',
    preferredContact: 'whatsapp',
    userRole: 'owner',
    photos: [] as File[],
    floorPlan: null as File | null,
    brochure: null as File | null,
  })

  const photoInputRef = useRef<HTMLInputElement>(null)
  const floorPlanInputRef = useRef<HTMLInputElement>(null)
  const brochureInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'floorPlan' | 'brochure') => {
    const files = e.target.files
    if (!files) return

    const MAX_SIZE = 1024 * 1024 // 1MB

    if (type === 'photos') {
      const newPhotos = Array.from(files)
      const validPhotos = newPhotos.filter(file => {
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name} is too large. Max size is 1MB.`)
          return false
        }
        return true
      })
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...validPhotos] }))
    } else {
      const file = files[0]
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} is too large. Max size is 1MB.`)
        return
      }
      setFormData(prev => ({ ...prev, [type]: file }))
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const removeFile = (type: 'floorPlan' | 'brochure') => {
    setFormData(prev => ({ ...prev, [type]: null }))
  }

  const handleLocationChange = useCallback((lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: address
    }))
  }, [])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, we would upload files to Supabase Storage here
      // and then save the property data to the database
      
      toast.success('Listing submitted successfully! It is now pending review.')
      
      // Redirect to a success page or back to home
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting listing:', error)
      toast.error('Failed to submit listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 via-background to-secondary/10 py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              List Your Property on <span className="text-gradient">RAGDOL</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Reach thousands of potential buyers and renters. Quick, easy, and completely free
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Steps Indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep >= step.id
                          ? 'bg-primary text-background'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.id ? <CheckIcon className="w-6 h-6" /> : step.id}
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 transition-all ${
                          currentStep > step.id ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground">
                  {steps[currentStep - 1].title}
                </h3>
                <p className="text-muted-foreground">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-card border border-border rounded-lg p-8 mb-8 space-y-6">
              {/* Step 1: Property Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Property Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="luxury">Luxury</option>
                        <option value="off-plan">Off-Plan / New Projects</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Property Type
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="studio">Studio</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="office">Office</option>
                        <option value="retail">Retail</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Bedrooms
                      </label>
                      <select
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Bathrooms
                      </label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Area (Sq Ft)
                      </label>
                      <input
                        type="number"
                        name="area"
                        placeholder="e.g., 1500"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-foreground mb-3 flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-primary" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        placeholder="e.g., Downtown Dubai, Dubai"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Or select directly from the map:
                      </p>
                      <LocationPicker 
                        lat={formData.latitude} 
                        lng={formData.longitude} 
                        onChange={handleLocationChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-3">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your property, features, amenities..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Photos */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <label className="block font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-primary" />
                      Price (AED)
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g., 2500000"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>

                  {/* Photos Upload */}
                  <div>
                    <label className="block font-semibold text-foreground mb-3 flex items-center gap-2">
                      <PhotoIcon className="w-5 h-5 text-primary" />
                      Upload Photos (Max 1MB per image)
                    </label>
                    <div 
                      onClick={() => photoInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <input
                        type="file"
                        ref={photoInputRef}
                        onChange={(e) => handleFileChange(e, 'photos')}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <PhotoIcon className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-foreground font-medium mb-1">
                        Click to upload multiple photos
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG or WEBP (Max. 1MB each)
                      </p>
                    </div>

                    {/* Photo Previews */}
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {formData.photos.map((file, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removePhoto(index)
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Documents Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Floor Plan */}
                    <div>
                      <label className="block font-semibold text-foreground mb-3 flex items-center gap-2">
                        <DocumentIcon className="w-5 h-5 text-primary" />
                        Floor Plan (Max 1MB)
                      </label>
                      {!formData.floorPlan ? (
                        <div 
                          onClick={() => floorPlanInputRef.current?.click()}
                          className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                        >
                          <input
                            type="file"
                            ref={floorPlanInputRef}
                            onChange={(e) => handleFileChange(e, 'floorPlan')}
                            accept=".pdf,image/*"
                            className="hidden"
                          />
                          <DocumentIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium text-foreground">Upload Floor Plan</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <DocumentIcon className="w-6 h-6 text-primary flex-shrink-0" />
                            <div className="truncate">
                              <p className="text-sm font-medium text-foreground truncate">{formData.floorPlan.name}</p>
                              <p className="text-xs text-muted-foreground">{(formData.floorPlan.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button onClick={() => removeFile('floorPlan')} className="p-1 hover:bg-red-100 text-red-500 rounded-full transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Brochure Plan */}
                    <div>
                      <label className="block font-semibold text-foreground mb-3 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-primary" />
                        Brochure Plan (Max 1MB)
                      </label>
                      {!formData.brochure ? (
                        <div 
                          onClick={() => brochureInputRef.current?.click()}
                          className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                        >
                          <input
                            type="file"
                            ref={brochureInputRef}
                            onChange={(e) => handleFileChange(e, 'brochure')}
                            accept=".pdf,image/*"
                            className="hidden"
                          />
                          <DocumentTextIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium text-foreground">Upload Brochure</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <DocumentTextIcon className="w-6 h-6 text-primary flex-shrink-0" />
                            <div className="truncate">
                              <p className="text-sm font-medium text-foreground truncate">{formData.brochure.name}</p>
                              <p className="text-xs text-muted-foreground">{(formData.brochure.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button onClick={() => removeFile('brochure')} className="p-1 hover:bg-red-100 text-red-500 rounded-full transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Nationality
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        placeholder="e.g., Emirati, British, Indian"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+971 XX XXX XXXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        I am a...
                      </label>
                      <select
                        name="userRole"
                        value={formData.userRole}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                      >
                        <option value="owner">Property Owner</option>
                        <option value="agent">Real Estate Agent</option>
                        <option value="developer">Developer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Preferred Contact Method
                      </label>
                      <select
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-background border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-4">Review Your Listing</h3>
                    <div className="space-y-3 text-sm">
                      <p>
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-semibold text-foreground ml-2 capitalize">
                          {formData.category}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Property Type:</span>
                        <span className="font-semibold text-foreground ml-2 capitalize">
                          {formData.propertyType}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-semibold text-foreground ml-2">{formData.location}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Coordinates:</span>
                        <span className="font-semibold text-foreground ml-2">
                          {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold text-primary text-lg ml-2">
                          AED {formData.price ? parseInt(formData.price).toLocaleString() : '0'}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span className="font-semibold text-foreground ml-2">{formData.bedrooms}</span>
                      </p>
                      <div className="pt-4 border-t border-border mt-4 space-y-2">
                        <h4 className="font-semibold text-foreground mb-2">Contact Details</h4>
                        <p>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-semibold text-foreground ml-2">{formData.name} ({formData.userRole})</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Nationality:</span>
                          <span className="font-semibold text-foreground ml-2">{formData.nationality || 'Not specified'}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Preferred Contact:</span>
                          <span className="font-semibold text-foreground ml-2 capitalize">{formData.preferredContact}</span>
                        </p>
                      </div>
                      <div className="pt-4 border-t border-border mt-4 space-y-2">
                        <p className="flex items-center justify-between">
                          <span className="text-muted-foreground">Photos:</span>
                          <span className="font-semibold text-foreground">{formData.photos.length} images</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="text-muted-foreground">Floor Plan:</span>
                          <span className={formData.floorPlan ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                            {formData.floorPlan ? "✓ Uploaded" : "✗ Missing"}
                          </span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="text-muted-foreground">Brochure:</span>
                          <span className={formData.brochure ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                            {formData.brochure ? "✓ Uploaded" : "✗ Missing"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-foreground">
                      ✓ Your listing will be submitted for review. Once an admin approves it, 
                      it will be published on the website. You will receive a confirmation email shortly.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              {currentStep === 4 ? (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Listing'
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-card border-t border-border">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Why List on <span className="text-gradient">RAGDOL</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: '⚡', title: 'Quick & Easy', desc: 'List your property in just 5 minutes' },
              { icon: '💰', title: '100% Free', desc: 'No hidden fees or charges' },
              { icon: '📱', title: 'Wide Reach', desc: 'Reach thousands of buyers and renters' },
              { icon: '⭐', title: 'Top Featured', desc: 'Premium listing options available' },
              { icon: '👥', title: 'Direct Contact', desc: 'Connect directly with interested buyers' },
              { icon: '📊', title: 'Analytics', desc: 'Track views and inquiries' },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
