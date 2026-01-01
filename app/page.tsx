'use client'

import Link from 'next/link'
import { Database } from '@/lib/database.types'
import ListingCard from '@/components/property/ListingCard'
import PropertySlider from '@/components/property/PropertySlider'
import HeroSearch from '@/components/shared/HeroSearch'
import HeroImageSlider from '@/components/shared/HeroImageSlider'
import AgentSlider from '@/components/agent/AgentSlider'
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'
import {
  BuildingOffice2Icon,
  HomeIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon,
  NewspaperIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
// Database types already imported above

type Property = Database['public']['Tables']['properties']['Row']

// Mock featured properties for slider
const mockFeaturedProperties = [
  {
    id: '1',
    title: 'Luxury Penthouse in Downtown Dubai',
    price: 12500000,
    priceLabel: 'total',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Downtown Dubai, Dubai',
    beds: 4,
    baths: 5,
    sqft: 4200,
    type: 'Penthouse',
    featured: true,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Modern Villa with Private Beach',
    price: 8900000,
    priceLabel: 'total',
    image: 'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Palm Jumeirah, Dubai',
    beds: 5,
    baths: 6,
    sqft: 5500,
    type: 'Villa',
    featured: true,
  },
  {
    id: '3',
    title: 'Contemporary Apartment Marina View',
    price: 3200000,
    priceLabel: 'total',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Dubai Marina, Dubai',
    beds: 3,
    baths: 3,
    sqft: 2100,
    type: 'Apartment',
    featured: true,
  },
  {
    id: '4',
    title: 'Studio Apartment Downtown Perfect Investment',
    price: 950000,
    priceLabel: 'total',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Downtown Dubai, Dubai',
    beds: 1,
    baths: 1,
    sqft: 580,
    type: 'Studio',
    featured: true,
  },
  {
    id: '5',
    title: 'Spacious 2BR Apartment with Terrace',
    price: 2100000,
    priceLabel: 'total',
    image: 'https://images.pexels.com/photos/1396074/pexels-photo-1396074.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'JBR Beach, Dubai',
    beds: 2,
    baths: 2,
    sqft: 1350,
    type: 'Apartment',
    featured: true,
  },
  {
    id: '6',
    title: 'Premium Luxury Townhouse',
    price: 6500000,
    priceLabel: 'total',
    image: 'https://images.pexels.com/photos/1396124/pexels-photo-1396124.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Emirates Hills, Dubai',
    beds: 4,
    baths: 4,
    sqft: 3800,
    type: 'Townhouse',
    featured: true,
  },
]

// Mock rental properties
const mockRentalProperties = [
  {
    id: 'r1',
    title: 'Furnished Studio with Utilities Included',
    price: 4500,
    priceLabel: 'per_month',
    image: 'https://images.pexels.com/photos/1396126/pexels-photo-1396126.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Downtown Dubai, Dubai',
    beds: 1,
    baths: 1,
    sqft: 450,
    type: 'Studio',
    featured: false,
  },
  {
    id: 'r2',
    title: 'Modern 2BR Apartment - Furnished',
    price: 8500,
    priceLabel: 'per_month',
    image: 'https://images.pexels.com/photos/1396128/pexels-photo-1396128.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Dubai Marina, Dubai',
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: 'Apartment',
    featured: false,
  },
  {
    id: 'r3',
    title: 'Luxury Villa with Private Pool',
    price: 18000,
    priceLabel: 'per_month',
    image: 'https://images.pexels.com/photos/1396130/pexels-photo-1396130.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Arabian Ranches, Dubai',
    beds: 4,
    baths: 4,
    sqft: 4000,
    type: 'Villa',
    featured: false,
  },
  {
    id: 'r4',
    title: 'Cozy 1BR Apartment - Great Location',
    price: 5500,
    priceLabel: 'per_month',
    image: 'https://images.pexels.com/photos/1396129/pexels-photo-1396129.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'JBR Beach, Dubai',
    beds: 1,
    baths: 1,
    sqft: 700,
    type: 'Apartment',
    featured: false,
  },
]

// Type helpers
type AgentRow = Database['public']['Tables']['agents']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type AgentWithProfile = AgentRow & { profiles?: ProfileRow | null }

// Interface for UI properties
interface UIProperty {
  id: string
  title: string
  price: number
  priceLabel: string
  image: string
  location: string
  beds: number
  baths: number
  sqft: number
  type: string
  featured: boolean
}

// Transform database property to UI property
function transformProperty(dbProperty: Property, isRental: boolean = false): UIProperty {
  return {
    id: dbProperty.id || '',
    title: dbProperty.title || 'Untitled Property',
    price: dbProperty.price || 0,
    priceLabel: isRental ? 'per_month' : 'total',
    image: (dbProperty.images && Array.isArray(dbProperty.images) && dbProperty.images[0]) ? dbProperty.images[0] : '/api/placeholder/400/300',
    location: dbProperty.address ? `${dbProperty.address}${dbProperty.area ? ', ' + dbProperty.area : ''}` : 'Dubai',
    beds: dbProperty.beds || 0,
    baths: dbProperty.baths || 0,
    sqft: dbProperty.built_up_area || dbProperty.sqft || 0,
    type: dbProperty.type || 'Property',
    featured: dbProperty.featured || false,
  }
}

// Fetch featured properties (sale status)
function getFeaturedProperties(limit = 6): UIProperty[] {
  return mockFeaturedProperties.slice(0, limit)
}

// Fetch rental properties (rent status)
function getRentalProperties(limit = 4): UIProperty[] {
  return mockRentalProperties.slice(0, limit)
}

// Fetch new projects
function getNewProjects(limit = 4) {
  
  const mockProjects = [
    {
      id: 'p1',
      name: 'The Royal Atlantis Residences',
      location: 'Palm Jumeirah, Dubai',
      starting_price: 7500000,
      hero_image_url: 'https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'Under Construction',
      developer: 'Kerzner International'
    },
    {
      id: 'p2',
      name: 'One Za\'abeel',
      location: 'Zabeel, Dubai',
      starting_price: 3900000,
      hero_image_url: 'https://images.pexels.com/photos/1396136/pexels-photo-1396136.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'Near Completion',
      developer: 'Ithra Dubai'
    },
    {
      id: 'p3',
      name: 'Cavalli Tower',
      location: 'Dubai Marina, Dubai',
      starting_price: 2100000,
      hero_image_url: 'https://images.pexels.com/photos/1396138/pexels-photo-1396138.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'New Launch',
      developer: 'DAMAC Properties'
    },
    {
      id: 'p4',
      name: 'District One West',
      location: 'MBR City, Dubai',
      starting_price: 12000000,
      hero_image_url: 'https://images.pexels.com/photos/1396140/pexels-photo-1396140.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'Under Construction',
      developer: 'Meydan'
    }
  ]
  return mockProjects.slice(0, limit)
}

// Fetch top agents by rating
function getTopAgents(limit = 4): AgentWithProfile[] {
  const mockAgents: AgentWithProfile[] = [
    {
      id: 'agent-1',
      title: 'Senior Real Estate Agent',
      bio: 'Specializing in luxury properties',
      experience_years: 8,
      rating: 4.8,
      review_count: 89,
      total_sales: 450000000,
      profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      office: 'Dubai Downtown',
      license_no: '123456789',
      approved: true,
      social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
      brokerage: 'RAGDOL',
      certifications: ['RERA', 'Certified'],
      commission_rate: 2.5,
      languages: ['English', 'Arabic'],
      areas: ['Downtown', 'Marina'],
      verified: true,
      user_id: 'user-1',
      whatsapp: '+971501234567',
      linkedin_url: 'https://linkedin.com',
      instagram_handle: '@agent',
      website_url: 'https://agent.ragdol.ae',
      location: 'Dubai',
      profile_images: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80'],
      specializations: ['Luxury Properties', 'Investment'],
      telegram: null,
      profiles: {
        id: 'user-1',
        full_name: 'Sarah Ahmed',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
        phone: '+971501234567',
        role: 'agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        phone_verified: true,
        last_login: new Date().toISOString(),
        login_count: 245,
        location: 'Dubai',
        bio: 'Real estate agent',
        preferences: { notifications: true, language: 'en' },
        social_links: { linkedin: 'https://linkedin.com' }
      }
    },
    {
      id: 'agent-2',
      title: 'Luxury Property Specialist',
      bio: 'Expert in Palm Jumeirah',
      experience_years: 10,
      rating: 4.9,
      review_count: 120,
      total_sales: 625000000,
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      office: 'Palm Jumeirah',
      license_no: '987654321',
      approved: true,
      social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
      brokerage: 'RAGDOL',
      certifications: ['RERA', 'Certified'],
      commission_rate: 2.75,
      languages: ['English', 'Arabic', 'French'],
      areas: ['Palm', 'Emirates Hills'],
      verified: true,
      user_id: 'user-2',
      whatsapp: '+971501234568',
      linkedin_url: 'https://linkedin.com',
      instagram_handle: '@agent',
      website_url: 'https://agent2.ragdol.ae',
      location: 'Dubai',
      profile_images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'],
      specializations: ['Luxury Villas', 'Waterfront'],
      telegram: null,
      profiles: {
        id: 'user-2',
        full_name: 'Ahmed Hassan',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        phone: '+971502345678',
        role: 'agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        phone_verified: true,
        last_login: new Date().toISOString(),
        login_count: 312,
        location: 'Dubai',
        bio: 'Luxury specialist',
        preferences: { notifications: true, language: 'en' },
        social_links: { linkedin: 'https://linkedin.com' }
      }
    },
    {
      id: 'agent-3',
      title: 'Commercial Broker',
      bio: 'Commercial spaces specialist',
      experience_years: 9,
      rating: 4.7,
      review_count: 76,
      total_sales: 380000000,
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      office: 'Business Bay',
      license_no: '456789123',
      approved: true,
      social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
      brokerage: 'RAGDOL',
      certifications: ['RERA', 'Certified'],
      commission_rate: 3.0,
      languages: ['English', 'Arabic', 'Urdu'],
      areas: ['Business Bay', 'Marina'],
      verified: true,
      user_id: 'user-3',
      whatsapp: '+971501234569',
      linkedin_url: 'https://linkedin.com',
      instagram_handle: '@agent',
      website_url: 'https://agent3.ragdol.ae',
      location: 'Dubai',
      profile_images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'],
      specializations: ['Commercial', 'Investment'],
      telegram: null,
      profiles: {
        id: 'user-3',
        full_name: 'Fatima Khan',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        phone: '+971503456789',
        role: 'agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        phone_verified: true,
        last_login: new Date().toISOString(),
        login_count: 198,
        location: 'Dubai',
        bio: 'Commercial broker',
        preferences: { notifications: true, language: 'en' },
        social_links: { linkedin: 'https://linkedin.com' }
      }
    },
    {
      id: 'agent-4',
      title: 'Investment Advisor',
      bio: 'Property investment specialist',
      experience_years: 7,
      rating: 4.6,
      review_count: 95,
      total_sales: 320000000,
      profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      office: 'Jumeirah Village Circle',
      license_no: '789123456',
      approved: true,
      social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
      brokerage: 'RAGDOL',
      certifications: ['RERA', 'Certified'],
      commission_rate: 2.25,
      languages: ['English', 'Arabic', 'Hindi'],
      areas: ['JVC', 'Dubai Silicon Oasis'],
      verified: true,
      user_id: 'user-4',
      whatsapp: '+971501234570',
      linkedin_url: 'https://linkedin.com',
      instagram_handle: '@agent',
      website_url: 'https://agent4.ragdol.ae',
      location: 'Dubai',
      profile_images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80'],
      specializations: ['Investment', 'Residential'],
      telegram: null,
      profiles: {
        id: 'user-4',
        full_name: 'Maria Rodriguez',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
        phone: '+971504567890',
        role: 'agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        phone_verified: true,
        last_login: new Date().toISOString(),
        login_count: 167,
        location: 'Dubai',
        bio: 'Investment advisor',
        preferences: { notifications: true, language: 'en' },
        social_links: { linkedin: 'https://linkedin.com' }
      }
    },
    {
      id: 'agent-5',
      title: 'Off-Plan Specialist',
      bio: 'New developments expert',
      experience_years: 6,
      rating: 4.8,
      review_count: 82,
      total_sales: 280000000,
      profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      office: 'Dubai Festival City',
      license_no: '321654987',
      approved: true,
      social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
      brokerage: 'RAGDOL',
      certifications: ['RERA', 'Certified'],
      commission_rate: 2.5,
      languages: ['English', 'Arabic'],
      areas: ['Festival City', 'Al Barsha'],
      verified: true,
      user_id: 'user-5',
      whatsapp: '+971501234571',
      linkedin_url: 'https://linkedin.com',
      instagram_handle: '@agent',
      website_url: 'https://agent5.ragdol.ae',
      location: 'Dubai',
      profile_images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'],
      specializations: ['Off-Plan', 'New Developments'],
      telegram: null,
      profiles: {
        id: 'user-5',
        full_name: 'David Chen',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
        phone: '+971505678901',
        role: 'agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        phone_verified: true,
        last_login: new Date().toISOString(),
        login_count: 134,
        location: 'Dubai',
        bio: 'Off-plan specialist',
        preferences: { notifications: true, language: 'en' },
        social_links: { linkedin: 'https://linkedin.com' }
      }
    },
    {
      id: 'agent-6',
      title: 'Rental Specialist',
      bio: 'Long-term rental expert',
      experience_years: 11,
      rating: 4.9,
      review_count: 156,
      total_sales: 420000000,
      profile_image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      office: 'Dubai Marina',
      license_no: '654987321',
      approved: true,
      social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
      brokerage: 'RAGDOL',
      certifications: ['RERA', 'Certified'],
      commission_rate: 1.5,
      languages: ['English', 'Arabic', 'Russian'],
      areas: ['Marina', 'JBR'],
      verified: true,
      user_id: 'user-6',
      whatsapp: '+971501234572',
      linkedin_url: 'https://linkedin.com',
      instagram_handle: '@agent',
      website_url: 'https://agent6.ragdol.ae',
      location: 'Dubai',
      profile_images: ['https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80'],
      specializations: ['Rentals', 'Long-term'],
      telegram: null,
      profiles: {
        id: 'user-6',
        full_name: 'Elena Petrova',
        avatar_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
        phone: '+971506789012',
        role: 'agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        phone_verified: true,
        last_login: new Date().toISOString(),
        login_count: 289,
        location: 'Dubai',
        bio: 'Rental specialist',
        preferences: { notifications: true, language: 'en' },
        social_links: { linkedin: 'https://linkedin.com' }
      }
    },
    {
      id: 'agent-7',
      title: 'Luxury Villa Specialist',
      bio: 'Exclusive villa properties expert',
      experience_years: 12,
      rating: 4.9,
      review_count: 178,
      total_sales: 890000000,
      profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      office: 'Emirates Hills',
      license_no: '987321654',
      approved: true,
      social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
      brokerage: 'RAGDOL',
      certifications: ['RERA', 'Certified', 'Luxury Specialist'],
      commission_rate: 3.0,
      languages: ['English', 'Arabic', 'French', 'Italian'],
      areas: ['Emirates Hills', 'Palm', 'Jumeirah'],
      verified: true,
      user_id: 'user-7',
      whatsapp: '+971501234573',
      linkedin_url: 'https://linkedin.com',
      instagram_handle: '@agent',
      website_url: 'https://agent7.ragdol.ae',
      location: 'Dubai',
      profile_images: ['https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'],
      specializations: ['Luxury Villas', 'Exclusive Properties'],
      telegram: null,
      profiles: {
        id: 'user-7',
        full_name: 'Isabella Rossi',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        phone: '+971507890123',
        role: 'agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        phone_verified: true,
        last_login: new Date().toISOString(),
        login_count: 345,
        location: 'Dubai',
        bio: 'Luxury villa specialist',
        preferences: { notifications: true, language: 'en' },
        social_links: { linkedin: 'https://linkedin.com' }
      }
    },
    {
      id: 'agent-8',
      title: 'Commercial Property Broker',
      bio: 'Office and retail space specialist',
      experience_years: 9,
      rating: 4.7,
      review_count: 134,
      total_sales: 560000000,
      profile_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      office: 'Business Bay',
      license_no: '456123789',
      approved: true,
      social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
      brokerage: 'RAGDOL',
      certifications: ['RERA', 'Certified', 'Commercial Broker'],
      commission_rate: 2.75,
      languages: ['English', 'Arabic', 'Urdu'],
      areas: ['Business Bay', 'DIFC', 'Dubai Media City'],
      verified: true,
      user_id: 'user-8',
      whatsapp: '+971501234574',
      linkedin_url: 'https://linkedin.com',
      instagram_handle: '@agent',
      website_url: 'https://agent8.ragdol.ae',
      location: 'Dubai',
      profile_images: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'],
      specializations: ['Commercial', 'Office Spaces', 'Retail'],
      telegram: null,
      profiles: {
        id: 'user-8',
        full_name: 'Ahmed Al-Mansoori',
        avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        phone: '+971508901234',
        role: 'agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        phone_verified: true,
        last_login: new Date().toISOString(),
        login_count: 223,
        location: 'Dubai',
        bio: 'Commercial property broker',
        preferences: { notifications: true, language: 'en' },
        social_links: { linkedin: 'https://linkedin.com' }
      }
    }
  ]
  return mockAgents.slice(0, limit)
}

export default function HomePage() {
  const { t } = useTranslation()
  const topAgents = getTopAgents(8)
  const featuredProperties = getFeaturedProperties()
  const rentalProperties = getRentalProperties()
  const newProjects = getNewProjects()

  // Video controls state
  const [videoStates, setVideoStates] = useState<{[key: number]: {isPlaying: boolean, isMuted: boolean}}>({
    0: { isPlaying: true, isMuted: true },
    1: { isPlaying: true, isMuted: true },
    2: { isPlaying: true, isMuted: true },
    3: { isPlaying: true, isMuted: true }
  })

  // Video refs
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null, null])

  const togglePlayPause = (index: number) => {
    setVideoStates(prev => ({
      ...prev,
      [index]: { ...prev[index], isPlaying: !prev[index].isPlaying }
    }))
  }

  const toggleMute = (index: number) => {
    setVideoStates(prev => ({
      ...prev,
      [index]: { ...prev[index], isMuted: !prev[index].isMuted }
    }))
  }

  // Effect to handle video playback
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (videoStates[index]?.isPlaying) {
          video.play().catch(() => {
            // Handle play promise rejection (e.g., user interaction required)
          })
        } else {
          video.pause()
        }
      }
    })
  }, [videoStates])

  // Initial autoplay effect
  useEffect(() => {
    const timer = setTimeout(() => {
      videoRefs.current.forEach((video, index) => {
        if (video && videoStates[index]?.isPlaying) {
          video.play().catch(() => {
            // Handle autoplay restrictions
          })
        }
      })
    }, 1000) // Small delay to ensure videos are loaded

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Landing Section with Image Slider */}
      <section className="relative w-full h-[95vh] min-h-[700px] overflow-hidden">
        {/* Image Slider Background */}
        <HeroImageSlider />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
          <div className="container-custom w-full pt-20">
            <div className="text-center max-w-6xl mx-auto space-y-10">
              {/* Main Heading */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-primary font-bold tracking-[0.4em] uppercase text-xs sm:text-sm drop-shadow-md">
                  {t('homepage.premiumRealEstate')}
                </h2>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-2xl leading-tight">
                  Find Your <span className="text-primary">Dream Home</span>
                </h1>
                <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg px-4 sm:px-0">
                  {t('homepage.discoverExclusiveProperties')}
                </p>
              </div>

              {/* Search Component */}
              <div className="max-w-4xl mx-auto animate-slide-up [animation-delay:200ms]">
                <HeroSearch />
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 pt-8 sm:pt-12 max-w-3xl mx-auto animate-fade-in [animation-delay:400ms] px-4 sm:px-0">
                <div className="text-center group">
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1 group-hover:text-primary transition-colors">2500+</div>
                  <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{t('homepage.properties')}</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1 group-hover:text-primary transition-colors">500+</div>
                  <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{t('homepage.happyClients')}</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1 group-hover:text-primary transition-colors">150+</div>
                  <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{t('homepage.expertAgents')}</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1 group-hover:text-primary transition-colors">15+</div>
                  <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{t('homepage.yearsExperience')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 px-4 sm:px-0">
            <div className="max-w-2xl">
              <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
                {t('homepage.visualExperience')}
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary tracking-tight">
                Property <span className="text-primary">Showcase</span>
              </h3>
            </div>
            <p className="text-slate-500 font-medium max-w-md text-sm sm:text-base">
              {t('homepage.exploreStunningProperties')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-0">
            {[
              { title: 'Luxury Penthouse', loc: 'Downtown Dubai', vid: 'v1764843424/WhatsApp_Video_2025-11-29_at_12.14.53_udvkvk.mp4' },
              { title: 'Beachfront Villa', loc: 'Palm Jumeirah', vid: 'v1764843423/WhatsApp_Video_2025-11-29_at_12.13.39_n3dwhm.mp4' },
              { title: 'Marina View', loc: 'Dubai Marina', vid: 'v1764843481/WhatsApp_Video_2025-11-29_at_12.19.32_jm5ups.mp4' },
              { title: 'Modern Townhouse', loc: 'Emirates Hills', vid: 'v1764843447/WhatsApp_Video_2025-11-29_at_12.18.06_e0j4gz.mp4' }
            ].map((reel, i) => (
              <div key={i} className="relative aspect-9/16 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group cursor-pointer animate-slide-up" style={{ animationDelay: `${i * 100}ms` }} onClick={() => togglePlayPause(i)}>
                <video
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  autoPlay={false}
                  muted={videoStates[i]?.isMuted}
                  loop={false}
                  playsInline
                  ref={(el) => {
                    videoRefs.current[i] = el
                  }}
                >
                  <source src={`https://res.cloudinary.com/thenprogrammer/video/upload/${reel.vid}`} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-transparent to-transparent p-4 sm:p-6 flex flex-col justify-end">
                  <h4 className="text-white font-bold text-base sm:text-lg">{reel.title}</h4>
                  <p className="text-white/70 text-sm font-medium">{reel.loc}</p>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => togglePlayPause(i)}
                    className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-colors"
                  >
                    {videoStates[i]?.isPlaying ? (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => toggleMute(i)}
                    className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-colors"
                  >
                    {videoStates[i]?.isMuted ? (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                    {videoStates[i]?.isPlaying ? (
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary tracking-tight mb-4 sm:mb-6">
              <span className="text-secondary">Trusted</span> <span className="text-primary">Partners</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              {t('homepage.collaborateWithDevelopers')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-12 px-4 sm:px-0">
            {[
              {
                name: 'Emaar',
                logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
              },
              {
                name: 'Sobha',
                logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
              },
              {
                name: 'Damac',
                logo: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
              },
              {
                name: 'Binghati',
                logo: 'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
              },
              {
                name: 'Aldar',
                logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
              },
              {
                name: 'Azizi',
                logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
              }
            ].map((partner, index) => (
              <div
                key={index}
                className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} Logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-secondary group-hover:text-primary transition-colors text-center">
                  {partner.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">Properties</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16 px-4 sm:px-0">
            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {t('homepage.joinThousandsClients')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                <span>{t('homepage.trustedDevelopers')}</span>
              </div>
              <div className="flex items-center gap-2">
                <BuildingOffice2Icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span>{t('homepage.premiumProperties')}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span>{t('homepage.expertGuidance')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Slider (Buy) */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
              {t('homepage.exclusiveSelection')}
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">
              {t('homepage.propertiesFor')} <span className="text-primary">{t('homepage.buyText')}</span>
            </h3>
          </div>
          <PropertySlider 
            title=""
            properties={featuredProperties.length > 0 ? featuredProperties : mockFeaturedProperties}
            showCount={4}
          />
        </div>
      </section>

      {/* Properties for Rent */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
              {t('homepage.rentalCollection')}
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">
              {t('homepage.propertiesFor')} <span className="text-primary">{t('homepage.rentText')}</span>
            </h3>
          </div>
          <PropertySlider 
            title=""
            properties={rentalProperties.length > 0 ? rentalProperties : mockRentalProperties}
            showCount={4}
          />
        </div>
      </section>

      {/* New Projects Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
                {t('homepage.futureLiving')}
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">
                {t('homepage.newText')} <span className="text-primary">{t('homepage.projectsText')}</span>
              </h3>
            </div>
            <Link href="/projects" className="btn-outline">
              {t('homepage.viewAllProjects')}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-lg">
                  <img 
                    src={project.hero_image_url} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-secondary text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">{project.name}</h4>
                <p className="text-slate-500 font-medium text-sm mb-2">{project.location}</p>
                <div className="text-primary font-bold text-sm">
                  Starting from <span className="text-lg">AED {project.starting_price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Areas Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
              Prime Locations
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">
              Explore <span className="text-primary">Popular Areas</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Dubai Marina', count: '1,240', image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { name: 'Downtown Dubai', count: '850', image: 'https://images.pexels.com/photos/1396074/pexels-photo-1396074.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { name: 'Palm Jumeirah', count: '420', image: 'https://images.pexels.com/photos/1396124/pexels-photo-1396124.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { name: 'Business Bay', count: '960', image: 'https://images.pexels.com/photos/1396126/pexels-photo-1396126.jpeg?auto=compress&cs=tinysrgb&w=800' }
            ].map((area, i) => (
              <Link key={i} href={`/properties?area=${area.name}`} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl">
                <img 
                  src={area.image} 
                  alt={area.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h4 className="text-2xl font-black text-white mb-1">{area.name}</h4>
                  <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">{area.count} Properties</p>
                </div>
                <div className="absolute top-6 right-6 h-12 w-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <ArrowRightIcon className="h-5 w-5" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/explore" className="btn-outline rounded-full! px-10!">
              Explore All Areas
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-[120px]" />
              <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="https://images.pexels.com/photos/1396128/pexels-photo-1396128.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Luxury Real Estate" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 bg-white p-6 sm:p-10 rounded-3xl sm:rounded-4xl shadow-2xl max-w-xs animate-slide-up">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="h-10 w-10 sm:h-14 sm:w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <SparklesIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div className="font-black text-slate-900 text-lg sm:text-xl">Premium Quality</div>
                </div>
                <p className="text-slate-500 leading-relaxed font-medium text-sm sm:text-base">
                  We only list properties that meet our high standards of luxury and quality.
                </p>
              </div>
            </div>
            
            <div className="space-y-6 sm:space-y-10">
              <div>
                <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
                  Our Excellence
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-secondary tracking-tight mb-6 sm:mb-8">
                  Why Choose <span className="text-primary">RAGDOL?</span>
                </h3>
                <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-medium">
                  We combine deep market knowledge with a personalized approach to help you find the perfect property in Dubai's competitive market.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                <div className="space-y-3 sm:space-y-4 group">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/5 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h4 className="font-bold text-lg sm:text-xl">Market Analysis</h4>
                  <p className="text-slate-400 font-medium text-sm sm:text-base">Real-time data and insights to make informed investment decisions.</p>
                </div>
                <div className="space-y-3 sm:space-y-4 group">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/5 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h4 className="font-bold text-lg sm:text-xl">Expert Guidance</h4>
                  <p className="text-slate-400 font-medium text-sm sm:text-base">Dedicated agents with years of experience in the Dubai market.</p>
                </div>
              </div>
              
              <button className="btn-primary rounded-full! px-8 sm:px-10! py-3 sm:py-4! text-sm sm:text-base! shadow-2xl shadow-primary/30">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Top Agents Section */}
      <section className="py-24 bg-white">
        <AgentSlider agents={topAgents} showCount={4} />
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-slate-50 overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
              {t('homepage.clientStories')}
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary tracking-tight">
              What Our <span className="text-primary">Clients Say</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            {[
              {
                name: 'James Wilson',
                role: 'Property Investor',
                content: 'RAGDOL provided exceptional service in helping me find a high-yield investment property in Downtown Dubai. Their market insights are unmatched.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
              },
              {
                name: 'Elena Rodriguez',
                role: 'Home Owner',
                content: 'The team at RAGDOL made the process of buying our first home in Palm Jumeirah so smooth. They handled everything with professionalism and care.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
              },
              {
                name: 'Michael Chen',
                role: 'Business Owner',
                content: 'Finding commercial space in Business Bay was a breeze with RAGDOL. They understood our requirements perfectly and delivered beyond expectations.',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 relative group">
                <div className="absolute -top-4 sm:-top-6 left-6 sm:left-10 h-10 w-10 sm:h-12 sm:w-12 bg-primary rounded-2xl flex items-center justify-center text-secondary shadow-lg shadow-primary/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.56929 13 5.017 13H3.017V21H5.017Z"/></svg>
                </div>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
                Market Insights
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">
                Latest <span className="text-primary">News & Articles</span>
              </h3>
            </div>
            <Link href="/blog" className="btn-outline">
              View All Articles
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Dubai Real Estate Market Trends 2024',
                date: 'Dec 15, 2023',
                category: 'Market Update',
                image: 'https://images.pexels.com/photos/1396130/pexels-photo-1396130.jpeg?auto=compress&cs=tinysrgb&w=800'
              },
              {
                title: 'Top 5 Areas for Property Investment in Dubai',
                date: 'Dec 10, 2023',
                category: 'Investment',
                image: 'https://images.pexels.com/photos/1396129/pexels-photo-1396129.jpeg?auto=compress&cs=tinysrgb&w=800'
              },
              {
                title: 'The Ultimate Guide to Buying Off-Plan',
                date: 'Dec 05, 2023',
                category: 'Guides',
                image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'
              }
            ].map((post, i) => (
              <Link key={i} href="/blog" className="group">
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-6 shadow-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">{post.date}</div>
                <h4 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="relative rounded-[3rem] sm:rounded-[4rem] overflow-hidden bg-slate-900 py-16 sm:py-24 px-6 sm:px-8 md:px-16 text-center">
            <div className="absolute inset-0 opacity-40">
              <img 
                src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                alt="Dubai Skyline" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/80" />
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 sm:mb-8 tracking-tight leading-tight">
                {t('homepage.readyToFindPerfectSpace')}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-12 font-medium leading-relaxed">
                {t('homepage.joinThousandsHomeowners')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Link href="/properties" className="btn-primary rounded-full! px-8 sm:px-12! py-4 sm:py-5! text-base sm:text-lg! shadow-2xl shadow-primary/30">
                  {t('homepage.browseProperties')}
                </Link>
                <Link href="/contact" className="btn-outline border-white! text-white! hover:bg-white! hover:text-slate-900! rounded-full! px-8 sm:px-12! py-4 sm:py-5! text-base sm:text-lg! backdrop-blur-md">
                  {t('homepage.contactUs')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
