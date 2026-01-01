'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
  status: string
  property_status: string
  featured: boolean
  video_url?: string | null
}

export default function PropertyImageGallery({
  images,
  title,
  status,
  property_status,
  featured,
  video_url
}: PropertyImageGalleryProps) {
  // Filter out invalid images and ensure we have valid sources - be very defensive
  const validImages = Array.isArray(images)
    ? images.filter(img => typeof img === 'string' && img.trim() !== '')
    : []

  // Create media array with video first, then images
  const mediaItems: Array<{ type: 'video' | 'image', url: string }> = []
  
  if (video_url && video_url.trim() !== '') {
    mediaItems.push({ type: 'video', url: video_url })
  }
  
  validImages.forEach(img => {
    mediaItems.push({ type: 'image', url: img })
  })

  // If no valid media, use a placeholder image
  const displayMedia = mediaItems.length > 0 ? mediaItems : [{ type: 'image' as const, url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIE1lZGlhPC90ZXh0Pjwvc3ZnPg==' }]

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  const selectedMedia = displayMedia[currentMediaIndex]

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % displayMedia.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + displayMedia.length) % displayMedia.length)
  }

  return (
    <div className="card-custom overflow-hidden">
      <div className="relative w-full">
        <div className="aspect-[16/10] md:aspect-[16/9] relative overflow-hidden bg-muted w-full">
          {selectedMedia.type === 'video' ? (
            <video
              src={selectedMedia.url}
              controls
              className="w-full h-full object-cover"
              poster={`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFZpZGVvPC90ZXh0Pjwvc3ZnPg==`}
              style={{ zIndex: 10 }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={selectedMedia.url}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Property Status Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20 max-w-[calc(100%-8rem)]">
          <span className="px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground rounded-full">
            {status === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          {featured && (
            <span className="px-3 py-1 text-sm font-semibold bg-accent text-accent-foreground rounded-full">
              Featured
            </span>
          )}
          <span className="px-3 py-1 text-sm font-semibold bg-secondary text-secondary-foreground rounded-full">
            {property_status?.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Media Count */}
        {displayMedia.length > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full flex items-center gap-1 z-20">
            <PhotoIcon className="w-4 h-4" />
            {currentMediaIndex + 1} / {displayMedia.length}
          </div>
        )}

        {/* Media Navigation */}
        {displayMedia.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-30 md:left-4"
              aria-label="Previous media"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-30 md:right-4"
              aria-label="Next media"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Media Thumbnails */}
      {displayMedia.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {displayMedia.map((media, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentMediaIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                    </svg>
                  </div>
                ) : (
                  <Image
                    src={media.url}
                    alt={`${title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}