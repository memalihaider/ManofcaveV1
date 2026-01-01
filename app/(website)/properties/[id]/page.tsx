'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/lib/database.types'
import PropertyImageGallery from '@/components/property/PropertyImageGallery'
import PropertySlider from '@/components/property/PropertySlider'
import PropertyAgents from '@/components/property/PropertyAgents'
import MortgageCalculator from '@/components/shared/MortgageCalculator'
import DownloadInterestForm, { DownloadInterestData } from '@/components/forms/DownloadInterestForm'
import { useState, use } from 'react'
import dynamic from 'next/dynamic'
import {
  MapPinIcon,
  HomeIcon,
  Square3Stack3DIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  PhotoIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import('@/components/shared/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-[2.5rem] flex items-center justify-center border border-slate-100">
      <div className="text-slate-400 flex flex-col items-center gap-2">
        <MapPinIcon className="w-8 h-8 animate-bounce" />
        <p className="text-sm font-bold uppercase tracking-widest">Loading Map...</p>
      </div>
    </div>
  )
})

type Property = Database['public']['Tables']['properties']['Row'] & {
  agent?: Database['public']['Tables']['profiles']['Row'] & {
    agent_details?: Database['public']['Tables']['agents']['Row']
  }
  project?: Database['public']['Tables']['projects']['Row']
}

type RelatedProperty = Database['public']['Tables']['properties']['Row']

// Mock property data for development
const mockProperty = {
  id: '1',
  title: 'Luxury Penthouse in Downtown Dubai',
  location: 'Downtown Dubai, Dubai',
  slug: 'luxury-penthouse-downtown-dubai',
  description: `Experience unparalleled luxury living in this stunning penthouse located in the heart of Downtown Dubai. This exquisite residence offers breathtaking views of the iconic Burj Khalifa and Dubai Fountain, combining modern elegance with world-class amenities.

The penthouse features an open-concept living space with floor-to-ceiling windows that flood the interior with natural light. The gourmet kitchen is equipped with top-of-the-line appliances and premium finishes. The master suite includes a walk-in closet and a spa-like ensuite bathroom.

Residents enjoy access to exclusive building amenities including a rooftop pool, fitness center, concierge services, and valet parking. Located in Dubai's premier business and entertainment district, you're just steps away from fine dining, shopping, and cultural attractions.`,
  type: 'apartment',
  status: 'sale',
  property_status: 'ready',
  price: 12500000,
  currency: 'AED',
  beds: 4,
  baths: 5,
  sqft: 4200,
  images: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&q=80',
  ],
  floorplans: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  ],
  features: [
    'Swimming Pool',
    'Gym & Fitness Center',
    'Concierge Service',
    'Valet Parking',
    'Rooftop Terrace',
    'Floor-to-Ceiling Windows',
    'Premium Appliances',
    'Walk-in Closets',
    'Smart Home System',
    '24/7 Security',
    'Balcony',
    'Built-in Wardrobes',
  ],
  address: 'Downtown Dubai, Dubai',
  city: 'Dubai',
  area: 'Downtown Dubai',
  coords: { lat: 25.1972, lng: 55.2744 },
  published: true,
  featured: true,
  views_count: 1250,
  created_at: '2024-11-15T10:00:00Z',
  updated_at: '2024-12-01T15:30:00Z',
  agent_id: 'agent-1',
  project_id: null,
  developer_id: null,
  // Additional required fields from database schema
  amenities: ['Pool', 'Gym', 'Security', 'Parking'],
  built_up_area: 4200,
  district: 'Downtown Dubai',
  expires_at: null,
  furnished: false,
  listing_type: 'exclusive',
  parking_spaces: 2,
  plot_area: null,
  price_per_sqft: 2976,
  property_age: 2,
  reference_no: 'RD-2024-001',
  rent_frequency: null,
  seo_description: 'Luxury penthouse with Burj Khalifa views in Downtown Dubai',
  seo_keywords: ['penthouse', 'luxury', 'Downtown Dubai', 'Burj Khalifa'],
  seo_title: 'Luxury Penthouse Downtown Dubai | Premium Property',
  sold_at: null,
  video_url: 'https://example.com/property-video.mp4',
  virtual_tour_url: 'https://example.com/virtual-tour',
  year_built: 2022,
  // Additional missing fields
  favorites_count: 45,
  floor_number: 45,
  furnishing: 'furnished',
  image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  inquiries_count: 23,
  landmark: 'Burj Khalifa',
  last_viewed: '2024-12-01T15:30:00Z',
  meta_data: { 'property_type': 'luxury', 'view_type': 'city' },
  neighborhood: 'Business Bay',
  original_price: 13500000,
  plot_size: null,
  premium: true,
  short_description: 'Stunning penthouse with Burj Khalifa views',
  total_floors: 50,
  urgent: false,
  verified: true,
}

const mockAgent = {
  id: 'agent-1',
  full_name: 'Sarah Ahmed',
  role: 'agent',
  email: 'sarah.ahmed@ragdol.ae',
  phone: '+971 50 123 4567',
  avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-12-01T15:30:00Z',
  // Additional required profile fields
  bio: 'With over 8 years of experience in Dubai\'s luxury real estate market, I specialize in helping clients find their dream properties in the most prestigious locations.',
  email_verified: true,
  last_login: '2024-12-01T15:30:00Z',
  location: 'Dubai, UAE',
  login_count: 245,
  phone_verified: true,
  preferences: { 'notifications': true, 'language': 'en' },
  social_links: {
    linkedin: 'https://linkedin.com/in/sarah-ahmed',
    instagram: '@sarah_realestate_dubai'
  },
  agent_details: {
    id: 'agent-1',
    profile_id: 'user-1',
    office: 'Dubai Downtown Office',
    license_no: '123456789',
    bio: 'With over 8 years of experience in Dubai\'s luxury real estate market, I specialize in helping clients find their dream properties in the most prestigious locations. My deep knowledge of the market and commitment to personalized service have helped hundreds of families find their perfect home.',
    areas: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Emirates Hills'],
    whatsapp: '+971501234567',
    social: {
      linkedin: 'https://linkedin.com/in/sarah-ahmed',
      instagram: '@sarah_realestate_dubai'
    },
    approved: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-01T15:30:00Z',
    // Additional required agent fields
    brokerage: 'RAGDOL Real Estate',
    certifications: ['RERA Certified', 'Luxury Property Specialist'],
    commission_rate: 2.5,
    experience_years: 8,
    languages: ['English', 'Arabic'],
    properties_sold: 156,
    rating: 4.8,
    reviews_count: 89,
    specializations: ['Luxury Properties', 'Investment Properties', 'Off-Plan'],
    total_sales: 450000000,
    website: 'https://sarah-ahmed.ragdol.ae'
  }
}

const mockRelatedProperties = [
  {
    id: '2',
    title: 'Modern Villa with Private Beach',
    price: 8900000,
    currency: 'AED',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    location: 'Palm Jumeirah, Dubai',
    beds: 5,
    baths: 6,
    sqft: 5500,
    type: 'villa',
    status: 'sale',
    featured: true,
    area: 'Palm Jumeirah',
    city: 'Dubai',
  },
  {
    id: '3',
    title: 'Contemporary Apartment Marina View',
    price: 3200000,
    currency: 'AED',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa00?w=800&q=80'],
    location: 'Dubai Marina, Dubai',
    beds: 3,
    baths: 3,
    sqft: 2100,
    type: 'apartment',
    status: 'sale',
    featured: false,
    area: 'Dubai Marina',
    city: 'Dubai',
  },
  {
    id: '4',
    title: 'Premium Luxury Townhouse',
    price: 6500000,
    currency: 'AED',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    location: 'Emirates Hills, Dubai',
    beds: 4,
    baths: 4,
    sqft: 3800,
    type: 'townhouse',
    status: 'sale',
    featured: false,
    area: 'Emirates Hills',
    city: 'Dubai',
  },
]

async function getProperty(id: string): Promise<Property | null> {
  // Always return mock data
  return { ...mockProperty, agent: mockAgent } as unknown as Property
}

async function getRelatedProperties(currentPropertyId: string): Promise<RelatedProperty[]> {
  // Always return mock data
  return mockRelatedProperties as unknown as RelatedProperty[]
}

interface PropertyPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { id } = use(params)

  // Form state
  const [showFloorPlanForm, setShowFloorPlanForm] = useState(false)
  const [showBrochureForm, setShowBrochureForm] = useState(false)

  // Mock property data (in real app, this would be fetched)
  const property = { ...mockProperty, agent: mockAgent }
  const relatedProperties = mockRelatedProperties

  const formatPrice = (price: number, currency: string = 'AED') => {
    return `${currency} ${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownloadInterest = async (data: DownloadInterestData, downloadType: 'floor_plan' | 'brochure') => {
    try {
      const response = await fetch('/api/download-interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          property_id: id,
          download_type: downloadType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // In a real app, you would trigger the actual download here
      alert(`${downloadType === 'floor_plan' ? 'Floor plan' : 'Brochure'} download link sent to your email!`)
    } catch (error) {
      console.error('Error submitting download interest:', error)
      alert('Failed to submit form. Please try again.')
    }
  }

  const handleFloorPlanSubmit = (data: DownloadInterestData) => {
    return handleDownloadInterest(data, 'floor_plan')
  }

  const handleBrochureSubmit = (data: DownloadInterestData) => {
    return handleDownloadInterest(data, 'brochure')
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50">
      {/* Breadcrumbs & Navigation */}
      <div className="bg-white border-b border-slate-100 sticky top-20 z-30">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-slate-200">/</span>
              <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
              <span className="text-slate-200">/</span>
              <span className="text-slate-900 truncate max-w-[200px]">{property.title}</span>
            </nav>
            
            <div className="flex items-center gap-3">
              <Link
                href="/properties"
                className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group text-xs font-bold uppercase tracking-widest"
              >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Search
              </Link>
              <div className="h-4 w-[1px] bg-slate-200 mx-2" />
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <ShareIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <HeartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Image Gallery */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
              <PropertyImageGallery
                images={property.images || []}
                title={property.title}
                status={property.status || 'sale'}
                property_status={property.property_status || 'ready'}
                featured={property.featured || false}
                video_url={property.video_url}
              />
            </div>

            {/* Property Details Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="space-y-10">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                        {property.type}
                      </span>
                      <span className="px-4 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                        {property.property_status?.replace('-', ' ')}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <MapPinIcon className="w-5 h-5 text-primary" />
                      <span>{property.address}, {property.city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Price</div>
                    <div className="text-4xl md:text-5xl font-black text-primary">
                      {formatPrice(property.price, property.currency || 'AED')}
                    </div>
                  </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bedrooms</div>
                    <div className="flex items-center gap-2">
                      <HomeIcon className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-black text-slate-900">{property.beds || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bathrooms</div>
                    <div className="flex items-center gap-2">
                      <Square3Stack3DIcon className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-black text-slate-900">{property.baths || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Area</div>
                    <div className="flex items-center gap-2">
                      <Square3Stack3DIcon className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-black text-slate-900">
                        {property.sqft?.toLocaleString() || 'N/A'}
                        <span className="text-xs font-bold text-slate-400 ml-1 uppercase">sqft</span>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</div>
                    <div className="flex items-center gap-2">
                      <EyeIcon className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-black text-slate-900">{property.views_count?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <DocumentTextIcon className="w-5 h-5" />
                    </span>
                    Description
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium">
                      {property.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="space-y-6 pt-10 border-t border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <SparklesIcon className="w-5 h-5" />
                      </span>
                      Features & Amenities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                          <CheckCircleIcon className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-slate-700 font-bold text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Details Table */}
                <div className="space-y-6 pt-10 border-t border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <ChartBarIcon className="w-5 h-5" />
                    </span>
                    Property Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {[
                      { label: 'Property Type', value: property.type, icon: HomeIcon },
                      { label: 'Status', value: property.property_status?.replace('-', ' '), icon: CheckCircleIcon },
                      { label: 'Area', value: property.area, icon: MapPinIcon },
                      { label: 'City', value: property.city, icon: MapPinIcon },
                      { label: 'Listed On', value: property.created_at ? formatDate(property.created_at) : 'N/A', icon: CalendarDaysIcon },
                      { label: 'Reference ID', value: property.id.slice(0, 8).toUpperCase(), icon: DocumentTextIcon },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900 capitalize">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Location */}
                <div className="space-y-6 pt-10 border-t border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <MapPinIcon className="w-5 h-5" />
                    </span>
                    Location Map
                  </h2>
                  <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
                    <LocationPicker 
                      lat={property.coords?.lat || 25.2048} 
                      lng={property.coords?.lng || 55.2708} 
                      onChange={() => {}} // Read-only on details page
                    />
                  </div>
                  <p className="text-sm font-bold text-slate-400 flex items-center gap-2 px-4">
                    <MapPinIcon className="w-4 h-4 text-primary" />
                    {property.address || property.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <DocumentTextIcon className="w-5 h-5" />
                  </span>
                  Download Resources
                </h2>
                <p className="text-slate-600 text-lg">
                  Get detailed information about this property. Fill out the form to download floor plans and brochures.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setShowFloorPlanForm(true)}
                    className="group p-6 bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary rounded-2xl transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-primary group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-white">Floor Plan</h3>
                        <p className="text-sm text-slate-600 group-hover:text-white/80">Detailed layout and dimensions</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowBrochureForm(true)}
                    className="group p-6 bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary rounded-2xl transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-primary group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-white">Brochure</h3>
                        <p className="text-sm text-slate-600 group-hover:text-white/80">Complete property information</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              {/* Agent Card */}
              {property.agent && (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                  <div className="text-center space-y-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-slate-50 shadow-lg">
                        <Image
                          src={property.agent.avatar_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0OCIiIGN5PSI0OCIiIHI9IjQ4IiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFnZW50PC90ZXh0Pjwvc3ZnPg=='}
                          alt={property.agent.full_name || 'Agent'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <StarSolidIcon className="h-3 w-3 text-yellow-400" />
                        <span className="text-[10px] font-black text-slate-900">4.9</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">
                        {property.agent.full_name}
                      </h3>
                      <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                        {property.agent.agent_details?.office || 'Senior Consultant'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                      <div className="text-center">
                        <div className="text-lg font-black text-slate-900">8+</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Years Exp.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-slate-900">150+</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Properties</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button className="btn-primary !w-full !rounded-2xl !py-4 flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
                        <PhoneIcon className="w-5 h-5" />
                        Call Agent
                      </button>
                      <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        WhatsApp
                      </button>
                      <Link
                        href={`/agents/${property.agent?.agent_details?.id || property.agent?.id}`}
                        className="w-full block text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Inquiry Form */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-2xl font-black tracking-tight">Interested?</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Fill out the form below and our team will contact you shortly.
                  </p>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                    />
                    <textarea
                      rows={3}
                      placeholder="Your Message"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium resize-none"
                    />
                    <button
                      type="submit"
                      className="btn-primary !w-full !rounded-2xl !py-4 shadow-xl shadow-primary/20"
                    >
                      Send Inquiry
                    </button>
                  </form>
                </div>
              </div>

              {/* Mortgage Calculator */}
              <MortgageCalculator defaultPrice={property.price} />
            </div>
          </aside>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <section className="mt-24 pt-24 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
                  Similar Options
                </h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  You Might Also Like
                </h3>
              </div>
              <Link href="/properties" className="btn-outline !rounded-full !px-8">
                View All Properties
              </Link>
            </div>
            <PropertySlider
              title=""
              properties={relatedProperties.map(prop => ({
                id: prop.id,
                title: prop.title,
                price: prop.price,
                priceLabel: prop.status === 'sale' ? 'total' : 'per_month',
                image: prop.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
                location: `${prop.area}, ${prop.city}`,
                beds: prop.beds || 0,
                baths: prop.baths || 0,
                sqft: prop.sqft || 0,
                type: prop.type || 'apartment',
                featured: prop.featured || false,
              }))}
              showCount={3}
            />
          </section>
        )}

        {/* Featured Agents Section */}
        <section className="mt-24">
          <PropertyAgents />
        </section>
      </div>

      {/* Download Interest Forms */}
      <DownloadInterestForm
        isOpen={showFloorPlanForm}
        onClose={() => setShowFloorPlanForm(false)}
        onSubmit={handleFloorPlanSubmit}
        downloadType="floor_plan"
        propertyTitle={property.title}
      />

      <DownloadInterestForm
        isOpen={showBrochureForm}
        onClose={() => setShowBrochureForm(false)}
        onSubmit={handleBrochureSubmit}
        downloadType="brochure"
        propertyTitle={property.title}
      />
    </div>
  )
}