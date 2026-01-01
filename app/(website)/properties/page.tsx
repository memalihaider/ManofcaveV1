import { mockProperties } from '@/lib/mock-data'
import { Database } from '@/lib/database.types'

type Property = Database['public']['Tables']['properties']['Row']
type NormalizedProperty = Property & {
  image: string
  price: number
  priceLabel?: string
  area?: string | null
  city?: string | null
  location: string
  beds: number
  baths: number
  sqft: number
  type: string
  featured: boolean
  developer?: string | null
  description?: string | null
  category?: string | null
  parking?: string | null
  furnished?: boolean | null
  propertyAge?: string | null
  completion?: string | null
  subtype?: string | null
  features?: string[] | null
}
import PropertyCard, { PropertyCardProperty } from '@/components/property/PropertyCard'
import PropertyAgents from '@/components/property/PropertyAgents'
import {
  ViewColumnsIcon,
  QueueListIcon,
  MagnifyingGlassIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'

export async function generateMetadata({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) || {}
  const action = (params.action as string) || 'buy'
  const area = params.area as string | undefined
  const category = params.category as string | undefined
  const type = params.type as string | undefined
  const search = params.search as string | undefined

  // Build page title
  let title = ''
  if (category === 'luxe') title += 'Luxury '
  if (type) {
    const typeLabels: Record<string, string> = {
      apartment: 'Apartments',
      villa: 'Villas',
      townhouse: 'Townhouses',
      penthouse: 'Penthouses',
      studio: 'Studios',
      plot: 'Plots',
      commercial: 'Commercial Properties'
    }
    title += typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1) + 's'
  } else if (category === 'luxe') {
    title += 'Properties'
  } else {
    title += 'Properties'
  }
  title += action === 'rent' ? ' for Rent' : ' for Sale'
  title += area ? ` in ${area}` : ' in Dubai'

  // Description
  let desc = ''
  if (category === 'luxe') desc += 'Discover exclusive luxury '
  else desc += 'Find '
  desc += type ? type + ' properties' : 'properties'
  desc += action === 'rent' ? ' for rent' : ' for sale'
  desc += area ? ` in ${area}, Dubai` : ' in Dubai'
  desc += '. Browse our curated selection with detailed information and high-quality images.'

  return {
    title: `RAGDOL - ${title}${search ? ` - ${search}` : ''}`,
    description: desc,
  }
}

export default async function PropertiesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) || {}
  const viewMode = (params.view as string) === 'list' ? 'list' : 'grid'
  const sortBy = (params.sortBy as string) || 'featured'
  const action = (params.action as string) || 'buy'
  const category = params.category as string | undefined
  const type = params.type as string | undefined
  const area = params.area as string | undefined
  const developer = params.developer as string | undefined
  const minPrice = params.minPrice as string | undefined
  const maxPrice = params.maxPrice as string | undefined
  const beds = params.beds as string | undefined
  const baths = params.baths as string | undefined
  const minSqft = params.minSqft as string | undefined
  const maxSqft = params.maxSqft as string | undefined
  const furnished = (params.furnished as string) === 'true'
  const parking = params.parking as string | undefined
  const propertyAge = params.propertyAge as string | undefined
  const completion = params.completion as string | undefined
  const features = params.features as string | undefined
  const subtype = params.subtype as string | undefined
  const page = parseInt((params.page as string) || '1', 10)
  const limit = parseInt((params.limit as string) || '20', 10)
  const search = (params.search as string) || undefined
  const hasVideo = params.hasVideo as string | undefined

  // Convert searchParams to simple string map for building query strings
  const buildQuery = (p: Record<string, unknown>) => {
    const result: Record<string, string> = {}
    Object.entries(p).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return
      if (Array.isArray(v)) result[k] = v.join(',')
      else result[k] = String(v)
    })
    return result
  }

  // Generate dynamic title and description based on filters
  const getPageTitle = () => {
    let title = ''

    if (category === 'luxe') {
      title += 'Luxury '
    }

    if (type) {
      const typeLabels: Record<string, string> = {
        apartment: 'Apartments',
        villa: 'Villas',
        townhouse: 'Townhouses',
        penthouse: 'Penthouses',
        studio: 'Studios',
        plot: 'Plots',
        commercial: 'Commercial Properties'
      }
      title += typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1) + 's'
    } else if (category === 'luxe') {
      title += 'Properties'
    } else {
      title += 'Properties'
    }

    if (action === 'rent') {
      title += ' for Rent'
    } else {
      title += ' for Sale'
    }

    if (area) {
      title += ` in ${area}`
    } else {
      title += ' in Dubai'
    }

    return title
  }

  const getPageDescription = () => {
    let desc = ''

    if (category === 'luxe') {
      desc += 'Discover exclusive luxury '
    } else {
      desc += 'Find '
    }

    if (type) {
      const typeLabels: Record<string, string> = {
        apartment: 'apartments',
        villa: 'villas',
        townhouse: 'townhouses',
        penthouse: 'penthouses',
        studio: 'studios',
        plot: 'plots',
        commercial: 'commercial properties'
      }
      desc += typeLabels[type] || type + 's'
    } else {
      desc += 'properties'
    }

    if (action === 'rent') {
      desc += ' for rent'
    } else {
      desc += ' for sale'
    }

    if (area) {
      desc += ` in ${area}, Dubai`
    } else {
      desc += ' in Dubai'
    }

    desc += '. Browse our curated selection with detailed information and high-quality images.'

    return desc
  }

  // Page title and meta are generated via generateMetadata

  // Enhanced mock properties with more variety (fallback only)
  const mockProperties = [
    // Luxury Properties
    {
      id: 'lux-1',
      title: 'Emirates Hills Luxury Mansion',
      price: 55000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      location: 'Emirates Hills, Dubai',
      beds: 7,
      baths: 9,
      sqft: 12000,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'sale',
      category: 'luxe',
      developer: 'Emaar',
      area: 'Emirates Hills',
      features: ['private_pool', 'golf_course'],
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready',
      video_url: 'https://example.com/luxury-mansion-video.mp4'
    },
    {
      id: 'lux-2',
      title: 'Palm Jumeirah Beachfront Estate',
      price: 42000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      location: 'Palm Jumeirah, Dubai',
      beds: 6,
      baths: 7,
      sqft: 9500,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'sale',
      category: 'luxe',
      developer: 'Nakheel',
      area: 'Palm Jumeirah',
      features: ['beachfront', 'marina_view'],
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready',
      video_url: 'https://example.com/beachfront-estate-video.mp4'
    },
    {
      id: 'lux-4',
      title: 'Ultra Luxury Penthouse - Burj Khalifa',
      price: 75000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Downtown Dubai, Dubai',
      beds: 5,
      baths: 6,
      sqft: 8500,
      type: 'Penthouse',
      featured: true,
      currency: 'AED',
      status: 'sale',
      category: 'ultra-luxe',
      developer: 'Emaar',
      area: 'Downtown Dubai',
      features: ['burj_khalifa_view'],
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready',
      video_url: 'https://example.com/ultra-luxury-penthouse-video.mp4'
    },
    {
      id: 'lux-5',
      title: 'Branded Residence - Armani Hotel Suite',
      price: 25000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Burj Khalifa, Dubai',
      beds: 3,
      baths: 4,
      sqft: 3200,
      type: 'Apartment',
      featured: true,
      currency: 'AED',
      status: 'sale',
      category: 'branded',
      developer: 'Armani',
      area: 'Burj Khalifa',
      features: ['burj_khalifa_view'],
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    // Commercial Properties
    {
      id: 'comm-1',
      title: 'Premium Office Space - Business Bay',
      price: 5000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      location: 'Business Bay, Dubai',
      beds: 0,
      baths: 2,
      sqft: 2500,
      type: 'Office',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Business Bay',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: 'comm-2',
      title: 'Retail Shop - Dubai Mall',
      price: 15000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      location: 'Downtown Dubai, Dubai',
      beds: 0,
      baths: 1,
      sqft: 1200,
      type: 'Shop',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Downtown Dubai',
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: 'comm-3',
      title: 'Warehouse - Dubai South',
      price: 3000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
      location: 'Dubai South, Dubai',
      beds: 0,
      baths: 1,
      sqft: 5000,
      type: 'Warehouse',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai South',
      parking: 'yes',
      propertyAge: '5-10',
      completion: 'ready'
    },
    // Off-Plan Properties
    {
      id: 'off-1',
      title: 'Off-Plan Luxury Apartment - Dubai Creek Harbour',
      price: 2500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Dubai Creek Harbour, Dubai',
      beds: 2,
      baths: 3,
      sqft: 1200,
      type: 'Apartment',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai Creek Harbour',
      completion: 'off-plan',
      propertyAge: 'new'
    },
    // Furnished Properties
    {
      id: 'furn-1',
      title: 'Fully Furnished Studio - Dubai Marina',
      price: 85000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Dubai Marina, Dubai',
      beds: 0,
      baths: 1,
      sqft: 450,
      type: 'Studio',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Dubai Marina',
      furnished: true,
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    // More Rental Properties
    {
      id: 'rent-1',
      title: 'Modern 1BR Apartment for Rent - Jumeirah',
      price: 120000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Jumeirah, Dubai',
      beds: 1,
      baths: 2,
      sqft: 850,
      type: 'Apartment',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Jumeirah',
      furnished: false,
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: 'rent-2',
      title: 'Luxury Villa for Rent - Arabian Ranches',
      price: 450000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      location: 'Arabian Ranches, Dubai',
      beds: 5,
      baths: 6,
      sqft: 6500,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'rent',
      category: 'luxe',
      area: 'Arabian Ranches',
      furnished: true,
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready',
      features: ['private_pool', 'golf_course']
    },
    {
      id: 'rent-3',
      title: 'Townhouse for Rent - Dubai Hills Estate',
      price: 220000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Dubai Hills Estate, Dubai',
      beds: 4,
      baths: 5,
      sqft: 3200,
      type: 'Townhouse',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Dubai Hills Estate',
      furnished: false,
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    // Commercial Rentals
    {
      id: 'comm-rent-1',
      title: 'Office Space for Rent - Dubai Silicon Oasis',
      price: 180000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      location: 'Dubai Silicon Oasis, Dubai',
      beds: 0,
      baths: 3,
      sqft: 3000,
      type: 'Office',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Dubai Silicon Oasis',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: 'comm-rent-2',
      title: 'Retail Shop for Rent - Al Barsha',
      price: 350000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      location: 'Al Barsha, Dubai',
      beds: 0,
      baths: 1,
      sqft: 800,
      type: 'Shop',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Al Barsha',
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    // Missing Property Types
    {
      id: 'type-1',
      title: 'Modern Townhouse - Jumeirah Beach Residence',
      price: 8500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Jumeirah Beach Residence, Dubai',
      beds: 4,
      baths: 4,
      sqft: 2800,
      type: 'Townhouse',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Jumeirah Beach Residence',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: 'type-2',
      title: 'Commercial Plot - Dubai South',
      price: 20000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
      location: 'Dubai South, Dubai',
      beds: 0,
      baths: 0,
      sqft: 10000,
      type: 'Plot',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai South',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: 'type-3',
      title: 'Commercial Building - Deira',
      price: 45000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      location: 'Deira, Dubai',
      beds: 0,
      baths: 4,
      sqft: 15000,
      type: 'Building',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Deira',
      parking: 'yes',
      propertyAge: '5-10',
      completion: 'ready'
    },
    // Properties in Missing Areas
    {
      id: 'area-1',
      title: 'Luxury Apartment - Dubai Islands',
      price: 6500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
      location: 'Dubai Islands, Dubai',
      beds: 3,
      baths: 4,
      sqft: 1800,
      type: 'Apartment',
      featured: false,
      currency: 'AED',
      status: 'sale',
      category: 'luxe',
      area: 'Dubai Islands',
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: 'area-2',
      title: 'Modern Villa - Emirates Hills',
      price: 28000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Emirates Hills, Dubai',
      beds: 6,
      baths: 7,
      sqft: 8000,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'sale',
      category: 'ultra-luxe',
      area: 'Emirates Hills',
      features: ['golf_course'],
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    // More Off-Plan Properties
    {
      id: 'off-2',
      title: 'Off-Plan Penthouse - Dubai Creek Harbour',
      price: 8500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Dubai Creek Harbour, Dubai',
      beds: 3,
      baths: 4,
      sqft: 2200,
      type: 'Penthouse',
      featured: false,
      currency: 'AED',
      status: 'sale',
      category: 'luxe',
      area: 'Dubai Creek Harbour',
      completion: 'off-plan',
      propertyAge: 'new'
    },
    {
      id: 'off-3',
      title: 'Off-Plan Studio - Dubai South',
      price: 450000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Dubai South, Dubai',
      beds: 0,
      baths: 1,
      sqft: 400,
      type: 'Studio',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai South',
      completion: 'off-plan',
      propertyAge: 'new'
    },
    // More Furnished Properties
    {
      id: 'furn-2',
      title: 'Furnished 2BR Apartment - Business Bay',
      price: 160000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Business Bay, Dubai',
      beds: 2,
      baths: 3,
      sqft: 1200,
      type: 'Apartment',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Business Bay',
      furnished: true,
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: 'furn-3',
      title: 'Furnished Townhouse - Palm Jumeirah',
      price: 380000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Palm Jumeirah, Dubai',
      beds: 4,
      baths: 5,
      sqft: 3500,
      type: 'Townhouse',
      featured: false,
      currency: 'AED',
      status: 'rent',
      category: 'luxe',
      area: 'Palm Jumeirah',
      furnished: true,
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready',
      features: ['beachfront']
    },
    // Unfurnished Properties (explicitly false)
    {
      id: 'unfurn-1',
      title: 'Unfurnished Apartment - Al Barsha',
      price: 95000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Al Barsha, Dubai',
      beds: 1,
      baths: 2,
      sqft: 750,
      type: 'Apartment',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Al Barsha',
      furnished: false,
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: 'unfurn-2',
      title: 'Unfurnished Villa - Arabian Ranches',
      price: 180000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      location: 'Arabian Ranches, Dubai',
      beds: 4,
      baths: 5,
      sqft: 4500,
      type: 'Villa',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Arabian Ranches',
      furnished: false,
      parking: 'yes',
      propertyAge: '5-10',
      completion: 'ready'
    },
    // More Commercial Properties
    {
      id: 'comm-4',
      title: 'Warehouse for Sale - Dubai Silicon Oasis',
      price: 8000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
      location: 'Dubai Silicon Oasis, Dubai',
      beds: 0,
      baths: 2,
      sqft: 8000,
      type: 'Warehouse',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai Silicon Oasis',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: 'comm-5',
      title: 'Commercial Building - Jumeirah',
      price: 35000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      location: 'Jumeirah, Dubai',
      beds: 0,
      baths: 6,
      sqft: 12000,
      type: 'Building',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Jumeirah',
      parking: 'yes',
      propertyAge: '10+',
      completion: 'ready'
    },
    // Regular Properties
    {
      id: '1',
      title: 'Luxury Penthouse in Downtown Dubai',
      price: 12500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Downtown Dubai, Dubai',
      beds: 4,
      baths: 5,
      sqft: 4200,
      type: 'Penthouse',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Downtown Dubai',
      parking: 'yes',
      propertyAge: '5-10',
      completion: 'ready'
    },
    {
      id: '1',
      title: 'Luxury Penthouse in Downtown Dubai',
      price: 12500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Downtown Dubai, Dubai',
      beds: 4,
      baths: 5,
      sqft: 4200,
      type: 'Penthouse',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Downtown Dubai',
      parking: 'yes',
      propertyAge: '5-10',
      completion: 'ready'
    },
    {
      id: '2',
      title: 'Modern Villa with Private Beach',
      price: 8900000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Palm Jumeirah, Dubai',
      beds: 5,
      baths: 6,
      sqft: 5500,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Palm Jumeirah',
      features: ['beachfront'],
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: '3',
      title: 'Contemporary Apartment Marina View',
      price: 3200000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      location: 'Dubai Marina, Dubai',
      beds: 3,
      baths: 3,
      sqft: 2100,
      type: 'Apartment',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai Marina',
      features: ['marina_view'],
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: '4',
      title: 'Studio Apartment Downtown Perfect Investment',
      price: 950000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      location: 'Downtown Dubai, Dubai',
      beds: 0,
      baths: 1,
      sqft: 580,
      type: 'Studio',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Downtown Dubai',
      parking: 'no',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: '5',
      title: 'Spacious 2BR Apartment with Terrace',
      price: 2100000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      location: 'Jumeirah Beach Residence, Dubai',
      beds: 2,
      baths: 2,
      sqft: 1350,
      type: 'Apartment',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Jumeirah Beach Residence',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: '6',
      title: 'Premium Luxury Townhouse',
      price: 6500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Emirates Hills, Dubai',
      beds: 4,
      baths: 4,
      sqft: 3800,
      type: 'Townhouse',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Emirates Hills',
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    // Rental Properties
    {
      id: 'rent-1',
      title: 'Furnished 2BR Marina View',
      price: 165000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      location: 'Dubai Marina, Dubai',
      beds: 2,
      baths: 2,
      sqft: 1400,
      type: 'Apartment',
      featured: true,
      currency: 'AED',
      status: 'rent',
      area: 'Dubai Marina',
      furnished: true,
      features: ['marina_view', 'furnished'],
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: 'rent-2',
      title: 'Luxury 3BR Villa with Pool',
      price: 450000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Dubai Hills Estate, Dubai',
      beds: 3,
      baths: 4,
      sqft: 3200,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'rent',
      area: 'Dubai Hills Estate',
      furnished: true,
      features: ['private_pool', 'furnished'],
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    // Commercial Properties
    {
      id: 'comm-1',
      title: 'Prime Office Space Business Bay',
      price: 180000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      location: 'Business Bay, Dubai',
      beds: undefined,
      baths: undefined,
      sqft: 1500,
      type: 'Commercial',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Business Bay',
      subtype: 'office',
      parking: 'yes',
      propertyAge: '5-10',
      completion: 'ready'
    },
    // Plots
    {
      id: 'plot-1',
      title: 'Residential Plot Dubai Hills',
      price: 3500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      location: 'Dubai Hills Estate, Dubai',
      beds: undefined,
      baths: undefined,
      sqft: 5000,
      type: 'Plot',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai Hills Estate',
      parking: 'no',
      propertyAge: 'new',
      completion: 'ready'
    },
    // Off-plan Properties
    {
      id: 'off-plan-1',
      title: 'Dubai Creek Harbour - Off Plan Apartments',
      price: 2800000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      location: 'Dubai Creek Harbour, Dubai',
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: 'Apartment',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai Creek Harbour',
      developer: 'Emaar',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'off-plan'
    },
    {
      id: 'off-plan-2',
      title: 'Dubai South - Under Construction Villas',
      price: 5200000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Dubai South, Dubai',
      beds: 4,
      baths: 5,
      sqft: 3500,
      type: 'Villa',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai South',
      developer: 'DAMAC',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'under-construction'
    },
    // Older Properties
    {
      id: 'old-1',
      title: 'Classic Jumeirah Villa - 15 Years Old',
      price: 8500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      location: 'Jumeirah, Dubai',
      beds: 5,
      baths: 4,
      sqft: 4800,
      type: 'Villa',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Jumeirah',
      parking: 'yes',
      propertyAge: '10+',
      completion: 'ready'
    }
  ]

  // Use mock data only
  const offset = (Math.max(page, 1) - 1) * limit

  // (properties will be filtered and sorted on client-side)

  // Prepare properties and pagination
  let properties: NormalizedProperty[] = []
  let total = 0
  let totalPages = 1

  // Use mock data directly
  const rawProps: Property[] = mockProperties as unknown as Property[]

  // Normalize properties for UI
  properties = rawProps.map((p: any) => ({
    ...p,
    image: p.image || p.image_url || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='),
    price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price ?? 0),
    area: p.area || p.location || p.neighborhood || p.district || null,
    city: p.city || 'Dubai',
    location: p.location || p.area || p.city || '',
    beds: p.beds ?? 0,
    baths: p.baths ?? 0,
    sqft: p.sqft ?? 0,
    type: p.type || p.subtype || '',
    developer: p.developer || (p.developers?.name ? p.developers.name : null) || p.developer_id || null,
    featured: Boolean(p.featured),
    category: p.category || null,
    parking: p.parking || null,
    propertyAge: p.property_age || null,
    completion: p.completion || null,
    subtype: p.subtype || null,
    description: p.description || null,
    features: Array.isArray(p.features) ? p.features : (typeof (p.features as unknown) === 'string' ? (p.features as unknown as string).split(',').map((f: string) => f.trim()) : null)
  })) as NormalizedProperty[];

  // Apply features filter if provided
  const featuresList: string[] = Array.isArray(features)
    ? (features as string[])
    : (features ? (features as string).split(',').map(f => f.trim()).filter(Boolean) : [])
  if (featuresList.length > 0) { 
    properties = properties.filter((p: NormalizedProperty) => {
      if (!p.features || !Array.isArray(p.features)) return false
      return featuresList.every(f => (p.features || []).includes(f))
    })
  }

  // Filter by action (buy/rent)
  if (action === 'buy') {
    properties = properties.filter(p => p.status === 'sale')
  } else if (action === 'rent') {
    properties = properties.filter(p => p.status === 'rent')
  }

  // Filter by category
  if (category) {
    properties = properties.filter(p => p.category === category)
  }

  // Filter by type
  if (type) {
    properties = properties.filter(p => p.type?.toLowerCase() === type.toLowerCase())
  }

  // Filter by area
  if (area) {
    properties = properties.filter(p => p.area?.toLowerCase().includes(area.toLowerCase()))
  }

  // Filter by developer
  if (developer) {
    properties = properties.filter(p => p.developer?.toLowerCase().includes(developer.toLowerCase()))
  }

  // Filter by price
  if (minPrice) {
    properties = properties.filter(p => p.price >= parseInt(minPrice))
  }
  if (maxPrice) {
    properties = properties.filter(p => p.price <= parseInt(maxPrice))
  }

  // Filter by beds
  if (beds) {
    properties = properties.filter(p => p.beds === parseInt(beds))
  }

  // Filter by baths
  if (baths) {
    properties = properties.filter(p => p.baths === parseInt(baths))
  }

  // Filter by sqft
  if (minSqft) {
    properties = properties.filter(p => p.sqft >= parseInt(minSqft))
  }
  if (maxSqft) {
    properties = properties.filter(p => p.sqft <= parseInt(maxSqft))
  }

  // Filter by furnished
  if (furnished !== undefined) {
    if (furnished === true) {
      properties = properties.filter(p => p.furnished === true)
    } else if (furnished === false) {
      properties = properties.filter(p => p.furnished === false || p.furnished === null)
    }
  }

  // Filter by parking
  if (parking) {
    properties = properties.filter(p => p.parking?.toLowerCase() === parking.toLowerCase())
  }

  // Filter by property age
  if (propertyAge) {
    properties = properties.filter(p => p.propertyAge === propertyAge)
  }

  // Filter by completion
  if (completion) {
    properties = properties.filter(p => p.completion === completion)
  }

  // Filter by video availability
  if (hasVideo === 'true') {
    properties = properties.filter(p => p.video_url && p.video_url.trim() !== '')
  }

  // Search filtering
  if (search && search.trim() !== '') {
    const sLower = search.toLowerCase()
    properties = properties.filter(p => {
      const inTitle = p.title?.toLowerCase().includes(sLower)
      const inLocation = p.location?.toLowerCase().includes(sLower)
      const inArea = (p.area || '').toLowerCase().includes(sLower)
      const inDesc = (p.description || '').toLowerCase().includes(sLower)
      const inDeveloper = ((p.developer || '') as string).toLowerCase().includes(sLower)
      return inTitle || inLocation || inArea || inDesc || inDeveloper
    })
  }

  // Sorting
  switch (sortBy) {
    case 'price-low':
      properties.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      properties.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      properties.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      break
    case 'featured':
    default:
      properties.sort((a, b) => {
        if (Boolean(b.featured) !== Boolean(a.featured)) {
          return Number(b.featured) - Number(a.featured)
        }
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      })
      break
  }

  // Get total and pagination info
  total = properties.length
  totalPages = Math.max(1, Math.ceil(total / limit))

  // Apply pagination
  const paginatedProperties = properties.slice(offset, offset + limit)

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm animate-slide-up">
              Premium Listings
            </h2>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight animate-slide-up [animation-delay:100ms]">
              {getPageTitle()}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium animate-slide-up [animation-delay:200ms]">
              {getPageDescription()}
            </p>

            {/* Property Stats */}
            <div className="flex flex-wrap justify-center gap-3 pt-4 animate-slide-up [animation-delay:300ms]">
              <span className="px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/10 text-sm font-bold">
                {total} Properties Found
              </span>
              {search && (
                <span className="px-6 py-2 bg-primary/20 backdrop-blur-md text-primary rounded-full border border-primary/30 text-sm font-bold">
                  🔎 &ldquo;{search}&rdquo;
                </span>
              )}
              {area && (
                <span className="px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/10 text-sm font-bold">
                  📍 {area}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-8 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24 space-y-6 lg:space-y-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 p-4 sm:p-8 border border-slate-100">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">Filters</h3>
                  <button type="reset" form="filter-form" className="text-xs font-bold text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">
                    Reset All
                  </button>
                </div>

                <form id="filter-form" method="get" action="/properties" className="space-y-8">
                  <input type="hidden" name="view" value={viewMode} />
                  <input type="hidden" name="sortBy" value={sortBy} />
                  
                  {/* Search */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Keywords</label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input 
                        name="search" 
                        type="text" 
                        defaultValue={search || ''} 
                        placeholder="Search properties..." 
                        className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                      />
                    </div>
                  </div>

                  {/* Action Type */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Action</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="relative cursor-pointer group">
                        <input 
                          type="radio" 
                          name="action" 
                          value="buy" 
                          defaultChecked={action === 'buy'}
                          className="peer sr-only" 
                        />
                        <div className="flex items-center justify-center py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm peer-checked:bg-primary peer-checked:text-white group-hover:bg-slate-100 transition-all">
                          Buy
                        </div>
                      </label>
                      <label className="relative cursor-pointer group">
                        <input 
                          type="radio" 
                          name="action" 
                          value="rent" 
                          defaultChecked={action === 'rent'}
                          className="peer sr-only" 
                        />
                        <div className="flex items-center justify-center py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm peer-checked:bg-primary peer-checked:text-white group-hover:bg-slate-100 transition-all">
                          Rent
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Property Category */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'All Properties' },
                        { value: 'luxe', label: 'Luxury' },
                        { value: 'ultra-luxe', label: 'Ultra Luxury' },
                        { value: 'branded', label: 'Branded Residences' }
                      ].map((cat) => (
                        <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="category" 
                            value={cat.value}
                            defaultChecked={category === cat.value}
                            className="w-4 h-4 text-primary bg-slate-50 border-slate-300 rounded focus:ring-primary/20 focus:ring-2 cursor-pointer" 
                          />
                          <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                            {cat.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Property Type</label>
                    <select name="type" defaultValue={type || ''}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">All Types</option>
                      <option value="apartment">Apartments</option>
                      <option value="villa">Villas</option>
                      <option value="townhouse">Townhouses</option>
                      <option value="penthouse">Penthouses</option>
                      <option value="studio">Studios</option>
                      <option value="plot">Plots</option>
                      <option value="office">Offices</option>
                      <option value="shop">Shops</option>
                      <option value="warehouse">Warehouses</option>
                      <option value="building">Commercial Buildings</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</label>
                    <select name="area" defaultValue={area || ''}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">All Areas</option>
                      <option value="Dubai Marina">Dubai Marina</option>
                      <option value="Downtown Dubai">Downtown Dubai</option>
                      <option value="Palm Jumeirah">Palm Jumeirah</option>
                      <option value="Business Bay">Business Bay</option>
                      <option value="Jumeirah">Jumeirah</option>
                      <option value="Dubai Hills Estate">Dubai Hills Estate</option>
                      <option value="Dubai Creek Harbour">Dubai Creek Harbour</option>
                      <option value="Emirates Hills">Emirates Hills</option>
                      <option value="Arabian Ranches">Arabian Ranches</option>
                      <option value="Dubai South">Dubai South</option>
                      <option value="Al Barsha">Al Barsha</option>
                      <option value="Dubai Silicon Oasis">Dubai Silicon Oasis</option>
                      <option value="Deira">Deira</option>
                      <option value="Jumeirah Beach Residence">Jumeirah Beach Residence</option>
                      <option value="Dubai Islands">Dubai Islands</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Price Range (AED)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        name="minPrice"
                        type="number"
                        placeholder="Min"
                        defaultValue={minPrice || ''}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                      <input
                        name="maxPrice"
                        type="number"
                        placeholder="Max"
                        defaultValue={maxPrice || ''}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bedrooms</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['0', '1', '2', '3', '4', '5+'].map((val) => (
                        <label key={val} className="relative cursor-pointer group">
                          <input 
                            type="radio" 
                            name="beds" 
                            value={val === '5+' ? '5' : val} 
                            defaultChecked={beds === (val === '5+' ? '5' : val)}
                            className="peer sr-only" 
                          />
                          <div className="flex items-center justify-center py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm peer-checked:bg-primary peer-checked:text-white group-hover:bg-slate-100 transition-all">
                            {val === '0' ? 'ST' : val}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Completion Status */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Completion Status</label>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'All Properties' },
                        { value: 'ready', label: 'Ready to Move' },
                        { value: 'off-plan', label: 'Off-Plan' }
                      ].map((status) => (
                        <label key={status.value} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="completion" 
                            value={status.value}
                            defaultChecked={completion === status.value}
                            className="w-4 h-4 text-primary bg-slate-50 border-slate-300 rounded focus:ring-primary/20 focus:ring-2 cursor-pointer" 
                          />
                          <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                            {status.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Furnished Status */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Furnished</label>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'Any' },
                        { value: 'true', label: 'Furnished' },
                        { value: 'false', label: 'Unfurnished' }
                      ].map((furnish) => (
                        <label key={furnish.value} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="furnished" 
                            value={furnish.value}
                            defaultChecked={furnished === (furnish.value === 'true')}
                            className="w-4 h-4 text-primary bg-slate-50 border-slate-300 rounded focus:ring-primary/20 focus:ring-2 cursor-pointer" 
                          />
                          <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                            {furnish.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Property Features */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Property Features</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name="hasVideo" 
                          value="true"
                          defaultChecked={hasVideo === 'true'}
                          className="w-5 h-5 text-primary bg-slate-50 border-slate-300 rounded focus:ring-primary/20 focus:ring-2 cursor-pointer" 
                        />
                        <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                          Properties with Video Tours
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Special Features */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Special Features</label>
                    <div className="space-y-2">
                      {[
                        { value: 'beachfront', label: 'Beachfront', icon: '🏖️' },
                        { value: 'marina_view', label: 'Marina View', icon: '⛵' },
                        { value: 'golf_course', label: 'Golf Course', icon: '⛳' },
                        { value: 'private_pool', label: 'Private Pool', icon: '🏊' },
                        { value: 'burj_khalifa_view', label: 'Burj Khalifa View', icon: '🏙️' },
                        { value: 'penthouse', label: 'Penthouse', icon: '🏢' },
                        { value: 'duplex', label: 'Duplex', icon: '🏠' },
                        { value: 'townhouse', label: 'Townhouse', icon: '🏘️' }
                      ].map((feature) => (
                        <label key={feature.value} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            name="features"
                            value={feature.value}
                            defaultChecked={featuresList.includes(feature.value)}
                            className="peer sr-only"
                          />
                          <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-50 text-slate-600 font-medium text-sm peer-checked:bg-primary peer-checked:text-white group-hover:bg-slate-100 transition-all flex-1">
                            <span className="text-lg">{feature.icon}</span>
                            <span>{feature.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn-primary !w-full !rounded-2xl !py-4 shadow-xl shadow-primary/20">
                    Apply Filters
                  </button>
                </form>
              </div>

              {/* Help Card */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
                <div className="relative z-10">
                  <h4 className="text-xl font-black mb-4">Need Help?</h4>
                  <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                    Our expert agents are ready to help you find your perfect property.
                  </p>
                  <button className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 group/btn">
                    Contact Us
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4 sm:gap-6 bg-white p-4 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 pl-4">
                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                  {total} Results
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">Sort By:</label>
                  <form method="get" action="/properties" className="flex items-center gap-2">
                    <input type="hidden" name="action" value={action} />
                    <input type="hidden" name="type" value={type || ''} />
                    <input type="hidden" name="area" value={area || ''} />
                    <select 
                      name="sortBy" 
                      defaultValue={sortBy} 
                      className="bg-slate-50 border-none rounded-xl px-3 sm:px-4 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[140px]"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </form>
                </div>

                <div className="h-8 w-[1px] bg-slate-100 hidden sm:block mx-2" />

                <div className="flex bg-slate-50 p-1 rounded-xl">
                  <a 
                    href={`/properties?${new URLSearchParams({ ...buildQuery(params), view: 'grid' }).toString()}`} 
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <ViewColumnsIcon className="h-5 w-5" />
                  </a>
                  <a 
                    href={`/properties?${new URLSearchParams({ ...buildQuery(params), view: 'list' }).toString()}`} 
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <QueueListIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            {properties.length > 0 ? (
              <div className={`grid gap-8 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {paginatedProperties.map((property, i) => (
                  <div key={property.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <PropertyCard
                      property={((): PropertyCardProperty => ({
                        id: String(property.id),
                        title: property.title || 'Untitled property',
                        price: (property.price as number) ?? 0,
                        priceLabel: property.priceLabel || 'total',
                        image: (property.image as string) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
                        location: property.location || `${property.area || ''}${property.city ? ', ' + property.city : ''}`,
                        beds: (property.beds as number) ?? 0,
                        baths: (property.baths as number) ?? 0,
                        sqft: (property.sqft as number) ?? 0,
                        type: property.type || '',
                        featured: Boolean(property.featured),
                        currency: property.currency || 'AED',
                        status: property.status || 'sale',
                        area: property.area || undefined,
                        city: property.city || undefined,
                        video_url: (property.video_url as string) || undefined,
                      }))()}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HomeIcon className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">
                  We couldn't find any properties matching your current filters.
                </p>
                <a 
                  href="/properties"
                  className="mt-8 btn-outline !rounded-full !px-8 inline-block text-center"
                >
                  Clear All Filters
                </a>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                {page > 1 && (
                  <a
                    href={`/properties?${new URLSearchParams({ ...buildQuery(params), page: String(page - 1) }).toString()}`}
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all font-bold shadow-sm"
                  >
                    ←
                  </a>
                )}

                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  // Simple pagination logic: show current, first, last, and neighbors
                  if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <a
                        key={p}
                        href={`/properties?${new URLSearchParams({ ...buildQuery(params), page: String(p) }).toString()}`}
                        className={`h-12 w-12 flex items-center justify-center rounded-xl font-bold transition-all shadow-sm ${
                          page === p 
                            ? 'bg-primary text-white shadow-primary/20' 
                            : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </a>
                    );
                  }
                  if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="text-slate-300">...</span>;
                  }
                  return null;
                })}

                {page < totalPages && (
                  <a
                    href={`/properties?${new URLSearchParams({ ...buildQuery(params), page: String(page + 1) }).toString()}`}
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all font-bold shadow-sm"
                  >
                    →
                  </a>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Featured Agents Section */}
      <section className="bg-white py-24 border-t border-slate-100">
        <PropertyAgents />
      </section>
    </div>
  )
}

// The page component above is the server-side `export default`.
