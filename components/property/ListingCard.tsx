'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/lib/database.types'
import { formatPrice } from '@/lib/utils'
import { MapPinIcon, HomeIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline'

type Property = Database['public']['Tables']['properties']['Row']

interface ListingCardProps {
  property: Property
}

export default function ListingCard({ property }: ListingCardProps) {
  const mainImage = property.images?.[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="card-custom overflow-hidden">
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-slate-100">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900 rounded-full shadow-sm">
              {property.status === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            {property.featured && (
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-white rounded-full shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-4 left-4">
            <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white rounded-xl font-bold text-lg shadow-lg">
              {formatPrice(property.price, property.currency || 'AED')}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
              {property.type} • {property.property_status}
            </div>
            <h3 className="text-slate-900 font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </div>

          {/* Location */}
          {(property.area || property.city) && (
            <div className="flex items-center text-sm text-slate-500">
              <MapPinIcon className="h-4 w-4 mr-1.5 text-primary shrink-0" />
              <span className="truncate font-medium">
                {property.area && property.city
                  ? `${property.area}, ${property.city}`
                  : property.area || property.city}
              </span>
            </div>
          )}

          {/* Specs */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              {property.beds && (
                <div className="flex items-center text-slate-600">
                  <HomeIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                  <span className="text-sm font-semibold">{property.beds}</span>
                </div>
              )}
              {property.baths && (
                <div className="flex items-center text-slate-600">
                  <span className="mr-1.5 text-slate-400">🚿</span>
                  <span className="text-sm font-semibold">{property.baths}</span>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center text-slate-600">
                  <Square3Stack3DIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                  <span className="text-sm font-semibold">{property.sqft}</span>
                </div>
              )}
            </div>
            
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
