'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPinIcon, HomeIcon, Square3Stack3DIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export interface PropertyCardProperty {
  id: string
  title: string
  price: number
  priceLabel?: string
  image: string
  location?: string
  beds?: number
  baths?: number
  sqft?: number
  type?: string
  featured?: boolean
  currency?: string
  status?: string
  area?: string
  city?: string
  agent_id?: string | null
  video_url?: string | null
  agent?: {
    id: string
    title?: string
    brokerage?: string
    profile_image?: string | null
    whatsapp?: string | null
    profiles?: {
      full_name?: string
    } | null
  } | null
}

export interface PropertyCardProps {
  property: PropertyCardProperty
  isSaved?: boolean
  onSaveToggle?: (id: string) => void
}

export default function PropertyCard({ property, isSaved = false, onSaveToggle }: PropertyCardProps) {
  // Ensure we have a valid image source - be very defensive
  const getValidImageSrc = (image: any): string => {
    // If it's a valid string and not empty, use it
    if (typeof image === 'string' && image.trim() !== '') {
      return image
    }
    // If it's an array, take the first valid string
    if (Array.isArray(image)) {
      const firstValid = image.find(img => typeof img === 'string' && img.trim() !== '')
      if (firstValid) return firstValid
    }
    // Fallback
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
  }

  const imageSrc = getValidImageSrc(property.image)

  return (
    <Link href={`/properties/${property.id}`} className="group block h-full">
      <div className="card-custom overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col">
        {/* Image with Background */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
            style={{
              backgroundImage: `url(${getValidImageSrc(property.image)})`,
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Next Image for fallback */}
          <Image
            src={getValidImageSrc(property.image)}
            alt={property.title}
            fill
            className="object-cover opacity-0 group-hover:opacity-0 transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded animate-fade-in">
              {property.status === 'sale' ? 'For Sale' : property.status === 'rent' ? 'For Rent' : property.priceLabel === 'total' ? 'For Sale' : 'For Rent'}
            </span>
            {property.featured && (
              <span className="px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded animate-fade-in">
                Featured
              </span>
            )}
            {property.video_url && (
              <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded animate-fade-in flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
                Video
              </span>
            )}
          </div>

          {/* Save Button */}
          {onSaveToggle && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onSaveToggle(property.id)
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 z-10"
            >
              {isSaved ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 transition-all duration-300 flex flex-col flex-1">
          {/* Price */}
          <div className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300">
            {property.currency || 'AED'} {property.price.toLocaleString()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            <MapPinIcon className="h-4 w-4" />
            <span>{property.location || `${property.area}, ${property.city}`}</span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              <span>{property.beds || 0} bed{property.beds !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square3Stack3DIcon className="h-4 w-4" />
              <span>{property.baths || 0} bath{property.baths !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{property.sqft?.toLocaleString() || 0} sqft</span>
            </div>
          </div>

          {/* Type */}
          <div className="text-sm font-medium text-primary capitalize">
            {property.type || 'Property'}
          </div>

          {/* Agent Section */}
          {property.agent && (
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
                  {property.agent.profile_image ? (
                    <Image
                      src={property.agent.profile_image}
                      alt={property.agent.profiles?.full_name || 'Agent'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      {(property.agent.profiles?.full_name || 'A')[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {property.agent.profiles?.full_name || 'Agent'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {property.agent.title || property.agent.brokerage || 'Real Estate Agent'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}