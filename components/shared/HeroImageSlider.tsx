'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

interface HeroImage {
  url: string
  title: string
  description: string
}

const heroImages: HeroImage[] = [
  {
    url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'homepage.beachVillaLifestyle',
    description: 'homepage.exclusivePropertiesPalm'
  },
  {
    url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'homepage.marinaWaterfront',
    description: 'homepage.stunningApartmentsMarina'
  },
  {
    url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'homepage.emiratesHillsHomes',
    description: 'homepage.spaciousVillasCommunities'
  },
  {
    url: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'homepage.modernArchitecture',
    description: 'homepage.contemporaryDesignLuxury'
  }
]

export default function HeroImageSlider() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentIndex, autoPlay])

  const handleNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
      setIsTransitioning(false)
    }, 500)
  }

  const handlePrev = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <>
      <style>{`
        @keyframes zoomIn {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        .hero-zoom {
          animation: zoomIn 10s linear infinite alternate;
        }
      `}</style>

      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Image Container */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/90 z-10" />
            <img
              src={image.url}
              alt={image.title}
              className={`w-full h-full object-cover ${index === currentIndex ? 'hero-zoom' : ''}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-12 left-12 z-30 flex space-x-4">
        <button
          onClick={() => {
            handlePrev()
            setAutoPlay(false)
          }}
          className="p-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-primary hover:border-primary transition-all duration-300"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            handleNext()
            setAutoPlay(false)
          }}
          className="p-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-primary hover:border-primary transition-all duration-300"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-12 left-32 z-30 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setAutoPlay(false)
            }}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              index === currentIndex
                ? 'bg-primary w-12'
                : 'bg-white/30 w-4 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  )
}

