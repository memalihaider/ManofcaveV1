'use client'

import { useState } from 'react'
import PropertyCard from './PropertyCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Property {
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
  video_url?: string | null
}

interface PropertySliderProps {
  title: string
  properties: Property[]
  showCount?: number
}

export default function PropertySlider({ title, properties, showCount = 3 }: PropertySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) =>
      prevIndex + showCount >= properties.length ? 0 : prevIndex + showCount
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) =>
      prevIndex - showCount < 0 ? Math.max(0, properties.length - showCount) : prevIndex - showCount
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const visibleProperties = properties.slice(currentIndex, currentIndex + showCount)

  return (
    <div className="container-custom">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }
        
        .slide-item {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        .slide-item.transitioning {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 rounded-full border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex + showCount >= properties.length}
            className="p-2 rounded-full border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-hidden auto-rows-max">
        {visibleProperties.map((property, idx) => (
          <div
            key={property.id}
            className={`slide-item h-full`}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  )
}