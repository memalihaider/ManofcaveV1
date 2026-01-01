'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  PlusIcon,
  ClockIcon,
  XCircleIcon,
  XMarkIcon,
  PhotoIcon,
  MapPinIcon,
  CloudArrowUpIcon,
  ComputerDesktopIcon,
  LinkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
  DocumentTextIcon,
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  FireIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline'

// Firebase imports
import { db, storage } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  onSnapshot,
  Timestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

interface AgentProperty {
  id: string
  title: string
  price: number
  currency: string
  images: string[]
  beds: number
  baths: number
  sqft: number
  area: string
  city: string
  type: string
  published: boolean
  review_status: 'pending_review' | 'approved' | 'rejected' | 'draft'
  submitted_at?: string
  created_at: string
  address: string
  description: string
  features: string[]
  status: 'sale' | 'rent'
  property_status: 'ready' | 'off-plan' | 'under-construction'
  furnished?: boolean
  parking?: string
}

interface PropertyFormData {
  id?: string
  title: string
  price: number
  currency: string
  images: string[]
  beds: number
  baths: number
  sqft: number
  area: string
  city: string
  type: string
  description: string
  address: string
  features: string[]
  status: 'sale' | 'rent'
  property_status: 'ready' | 'off-plan' | 'under-construction'
  furnished: boolean
  parking: string
  published: boolean
}

// Image Slider Modal Interface
interface ImageSliderModalProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

// STATS INTERFACE
interface PropertyStats {
  total: number
  published: number
  pendingReview: number
  approved: number
  rejected: number
  sale: number
  rent: number
  last7Days: number
  totalValue: number
  avgPrice: number
}

// Time Period Stats Interface
interface TimePeriodStats {
  today: PropertyStats
  weekly: PropertyStats
  monthly: PropertyStats
  yearly: PropertyStats
  allTime: PropertyStats
}

// Stats Cards Component
const StatsCards = ({ stats, filter, setFilter }: { 
  stats: PropertyStats, 
  filter: string,
  setFilter: (filter: 'all' | 'published' | 'pending_review' | 'approved' | 'rejected') => void 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Properties Card */}
      <div 
        className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          filter === 'all' ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
        }`}
        onClick={() => setFilter('all')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Properties</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            
          </div>
          <div className="bg-blue-400/30 p-3 rounded-xl">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-400/30">
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">For Sale: {stats.sale}</span>
            <span className="text-blue-200">For Rent: {stats.rent}</span>
          </div>
        </div>
      </div>

      {/* Published Properties Card */}
      <div 
        className={`bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          filter === 'published' ? 'ring-4 ring-emerald-300 ring-opacity-50' : ''
        }`}
        onClick={() => setFilter('published')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Published</p>
            <p className="text-3xl font-bold text-white">{stats.published}</p>
            <div className="flex items-center mt-2">
              <CheckCircleIcon className="h-4 w-4 text-emerald-200 mr-1" />
              <span className="text-emerald-200 text-sm">Live on site</span>
            </div>
          </div>
          <div className="bg-emerald-400/30 p-3 rounded-xl">
            <HomeIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-emerald-400/30">
          <div className="text-sm">
            <span className="text-emerald-200">Total Value: {stats.totalValue.toLocaleString()} AED</span>
          </div>
        </div>
      </div>

      {/* Under Review Card */}
      <div 
        className={`bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          filter === 'pending_review' ? 'ring-4 ring-amber-300 ring-opacity-50' : ''
        }`}
        onClick={() => setFilter('pending_review')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm font-medium mb-1">Under Review</p>
            <p className="text-3xl font-bold text-white">{stats.pendingReview}</p>
            <div className="flex items-center mt-2">
              <ClockIcon className="h-4 w-4 text-amber-200 mr-1" />
              <span className="text-amber-200 text-sm">Awaiting approval</span>
            </div>
          </div>
          <div className="bg-amber-400/30 p-3 rounded-xl">
            <DocumentTextIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-amber-400/30">
         
        </div>
      </div>

      {/* Approved & Rejected Card */}
      <div className="grid grid-cols-2 gap-4">
        {/* Approved Card */}
        <div 
          className={`bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            filter === 'approved' ? 'ring-4 ring-sky-300 ring-opacity-50' : ''
          }`}
          onClick={() => setFilter('approved')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sky-100 text-xs font-medium">Approved</p>
              <p className="text-xl font-bold text-white">{stats.approved}</p>
            </div>
            <div className="bg-sky-400/30 p-2 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-sky-400/30">
            <span className="text-sky-200 text-xs">Ready to publish</span>
          </div>
        </div>

        {/* Rejected Card */}
        <div 
          className={`bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            filter === 'rejected' ? 'ring-4 ring-rose-300 ring-opacity-50' : ''
          }`}
          onClick={() => setFilter('rejected')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-xs font-medium">Rejected</p>
              <p className="text-xl font-bold text-white">{stats.rejected}</p>
            </div>
            <div className="bg-rose-400/30 p-2 rounded-lg">
              <XCircleIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-rose-400/30">
            <span className="text-rose-200 text-xs">Needs revision</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Image Slider Modal Component
const ImageSliderModal = ({ images, isOpen, onClose, initialIndex = 0 }: ImageSliderModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch(e.key) {
        case 'ArrowLeft':
          goToPrev()
          break
        case 'ArrowRight':
          goToNext()
          break
        case 'Escape':
          onClose()
          break
        case ' ':
          e.preventDefault()
          setIsZoomed(!isZoomed)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isZoomed])

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setIsZoomed(false)
    }
  }, [isOpen, initialIndex])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handleImageClick = (e: React.MouseEvent) => {
    if (isZoomed) {
      setIsZoomed(false)
    } else {
      const rect = (e.target as HTMLImageElement).getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Check if click is on left or right side for navigation
      if (x < rect.width / 3) {
        goToPrev()
      } else if (x > (rect.width / 3) * 2) {
        goToNext()
      } else {
        setIsZoomed(true)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="relative w-full max-w-6xl max-h-[90vh] bg-black rounded-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 left-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <ArrowsPointingOutIcon className="h-6 w-6" />
        </button>

        {/* Main Image Container */}
        <div className="relative h-[70vh] flex items-center justify-center">
          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 z-20 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          )}

          {/* Main Image */}
          <div className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}>
            <img
              ref={imageRef}
              src={images[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              onClick={handleImageClick}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 z-20 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="absolute bottom-4 right-4 text-white/60 text-sm hidden md:block">
            <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd> / <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd> Navigate
            <span className="mx-2">•</span>
            <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> Zoom
            <span className="mx-2">•</span>
            <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> Close
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="h-[20vh] bg-black/50 flex items-center justify-center px-4">
            <div className="flex gap-2 overflow-x-auto py-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentIndex === index 
                      ? 'border-blue-500 scale-105' 
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {currentIndex === index && (
                    <div className="absolute inset-0 bg-blue-500/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Property Card Component with Image Slider
const PropertyCard = ({ 
  property, 
  onEdit, 
  onDelete 
}: { 
  property: AgentProperty
  onEdit: (property: AgentProperty) => void
  onDelete: (id: string) => void
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageSlider, setShowImageSlider] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && property.images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex(prev => 
          prev === property.images.length - 1 ? 0 : prev + 1
        )
      }, 3000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, property.images.length])

  const goToPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const getImageSrc = () => {
    if (!property.images || property.images.length === 0) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
    }
    return property.images[currentImageIndex]
  }

  return (
    <>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
        {/* Image Section with Slider */}
        <div 
          className="relative h-56 w-full bg-slate-100 overflow-hidden cursor-pointer flex-shrink-0"
          onClick={() => setShowImageSlider(true)}
          onMouseEnter={() => property.images.length > 1 && setAutoPlay(true)}
          onMouseLeave={() => {
            setAutoPlay(false)
            if (autoPlayRef.current) {
              clearInterval(autoPlayRef.current)
            }
          }}
        >
          {/* Main Image */}
          <img
            src={getImageSrc()}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Image Navigation Arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              {/* Auto-play Indicator */}
              {autoPlay && (
                <div className="absolute top-4 left-4 px-2 py-1 bg-blue-500/80 text-white text-xs rounded-full">
                  Auto
                </div>
              )}

              {/* View All Images Button */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-3 py-1 bg-white/90 text-slate-800 text-xs font-medium rounded-full flex items-center gap-1 hover:bg-white">
                  <EyeIcon className="h-3 w-3" />
                  View {property.images.length} Photos
                </button>
              </div>
            </>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 right-4 flex gap-2">
            {property.published && (
              <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <CheckCircleIcon className="h-3 w-3" />
                Published
              </span>
            )}
            {property.review_status === 'pending_review' && (
              <span className="bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <ClockIcon className="h-3 w-3" />
                Under Review
              </span>
            )}
            {property.review_status === 'approved' && !property.published && (
              <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <CheckCircleIcon className="h-3 w-3" />
                Approved
              </span>
            )}
            {property.review_status === 'rejected' && (
              <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <XCircleIcon className="h-3 w-3" />
                Rejected
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-grow">
          <div className="mb-3">
            <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              <MapPinIcon className="h-3 w-3" />
              {property.area}, {property.city}
            </p>
          </div>

          <div className="text-2xl font-bold text-slate-800 mb-3">
            {property.currency} {property.price.toLocaleString()}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className="font-bold text-slate-800">{property.beds}</div>
              <div className="text-xs text-slate-500">Beds</div>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className="font-bold text-slate-800">{property.baths}</div>
              <div className="text-xs text-slate-500">Baths</div>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className="font-bold text-slate-800">{property.sqft.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Sqft</div>
            </div>
          </div>

          {/* Status Display */}
          <div className="mb-4">
            {property.review_status === 'pending_review' && (
              <div className="py-2 px-3 bg-amber-100 text-amber-700 rounded-lg font-medium text-sm text-center">
                ⏳ Awaiting Review
              </div>
            )}
            {property.review_status === 'approved' && !property.published && (
              <div className="py-2 px-3 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm text-center">
                ✅ Approved
              </div>
            )}
            {property.review_status === 'rejected' && (
              <div className="py-2 px-3 bg-red-100 text-red-700 rounded-lg font-medium text-sm text-center">
                ❌ Rejected
              </div>
            )}
            {property.published && (
              <div className="py-2 px-3 bg-emerald-100 text-emerald-700 rounded-lg font-medium text-sm text-center">
                🚀 Live on Site
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons at Bottom */}
        <div className="px-4 pb-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex gap-2">
          {/* View Button */}
          <button
            onClick={() => setShowImageSlider(true)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-sm"
          >
            <EyeIcon className="h-4 w-4" />
            <span>View</span>
          </button>

          {/* Edit Button */}
          <button 
            onClick={() => onEdit(property)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all text-sm"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button 
            onClick={() => onDelete(property.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all text-sm"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Image Slider Modal */}
      <ImageSliderModal
        images={property.images}
        isOpen={showImageSlider}
        onClose={() => setShowImageSlider(false)}
        initialIndex={currentImageIndex}
      />
    </>
  )
}

// Property Form Modal with enhanced image management
const PropertyFormModal = ({ 
  formData, 
  setFormData, 
  newImageUrl, 
  setNewImageUrl, 
  newFeature, 
  setNewFeature,
  activeTab,
  setActiveTab,
  imageUploadMethod,
  setImageUploadMethod,
  uploadingImages,
  setUploadingImages,
  uploadProgress,
  setUploadProgress,
  dragOver,
  setDragOver,
  fileInputRef,
  formLoading,
  isEditing,
  handleFormSubmit,
  resetForm,
  handleTitleChange,
  addImage,
  removeImage,
  addFeature,
  addCommonFeature,
  removeFeature,
  handleFileSelect,
  handleDragOver,
  handleDragLeave,
  handleDrop
}: any) => {
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)
    }
  }, [])

  // Images Tab Component with enhanced preview
  const ImagesTabContent = () => (
    <div className="space-y-6">
      {/* Upload Method Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setImageUploadMethod('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            imageUploadMethod === 'url'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <LinkIcon className="h-5 w-5" />
          Image URL
        </button>
        <button
          type="button"
          onClick={() => setImageUploadMethod('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            imageUploadMethod === 'gallery'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          Upload Images
        </button>
      </div>

      {/* URL Upload Method */}
      {imageUploadMethod === 'url' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Add Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                disabled={!newImageUrl.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Upload Method */}
      {imageUploadMethod === 'gallery' && (
        <div className="space-y-4">
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-blue-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CloudArrowUpIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-slate-700">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-sm text-slate-500">
                Supports JPG, PNG, WebP up to 5MB each
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={uploadingImages}
            >
              {uploadingImages ? 'Uploading...' : 'Choose Files'}
            </button>
          </div>

          {/* Upload Progress */}
          {uploadingImages && uploadProgress > 0 && (
            <div className="bg-slate-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Uploading...</span>
                <span className="text-sm text-slate-600">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-slate-300 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* File Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ComputerDesktopIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Upload Guidelines</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Maximum file size: 5MB per image</li>
                  <li>• Supported formats: JPG, PNG, WebP</li>
                  <li>• Recommended resolution: 1200x800 pixels</li>
                  <li>• First image will be the main/cover image</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Preview with slider preview */}
      {formData.images.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-slate-700">
              {formData.images.length} Image{formData.images.length !== 1 ? 's' : ''} Added
            </label>
            <div className="flex gap-2">
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    // Preview all images in slider
                    const event = new CustomEvent('previewImages', { 
                      detail: { images: formData.images } 
                    })
                    window.dispatchEvent(event)
                  }}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Preview All
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Remove all images?')) {
                    setFormData((prev: any) => ({ ...prev, images: [] }))
                  }
                }}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Remove All
              </button>
            </div>
          </div>

          {/* Image Grid with Mini Slider Preview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((image: string, index: number) => (
              <div key={index} className="relative group">
                <div className="aspect-square w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Image Number Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {index + 1}
                </div>
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                
                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Cover
                  </div>
                )}
                
                {/* Set as Main Button */}
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...formData.images]
                      const [selectedImage] = newImages.splice(index, 1)
                      newImages.unshift(selectedImage)
                      setFormData((prev: any) => ({ ...prev, images: newImages }))
                    }}
                    className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 text-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Set as cover image"
                  >
                    Set Cover
                  </button>
                )}
                
                {/* Navigation Arrows (for multiple images) */}
                {formData.images.length > 1 && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          const newImages = [...formData.images]
                          if (index > 0) {
                            [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]]
                            setFormData((prev: any) => ({ ...prev, images: newImages }))
                          }
                        }}
                        className="p-1 bg-white/80 text-slate-800 rounded-full"
                        title="Move left"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          const newImages = [...formData.images]
                          if (index < newImages.length - 1) {
                            [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
                            setFormData((prev: any) => ({ ...prev, images: newImages }))
                          }
                        }}
                        className="p-1 bg-white/80 text-slate-800 rounded-full"
                        title="Move right"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Images State */}
      {formData.images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
          <PhotoIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No images added yet</p>
          <p className="text-sm text-slate-400 mt-1">
            {imageUploadMethod === 'url' 
              ? 'Add image URLs above to preview them here' 
              : 'Upload images or add URLs to see them here'}
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h2>
              <p className="text-blue-100">
                {isEditing ? 'Update the property details below' : 'Fill in the details below to list your property'}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex px-6 overflow-x-auto">
            {(['details', 'location', 'features', 'images'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'images' && formData.images.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {formData.images.length}
                  </span>
                )}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            
            {/* DETAILS TAB */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter property title"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="plot">Plot</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Property Status
                    </label>
                    <select
                      value={formData.property_status}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, property_status: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ready">Ready</option>
                      <option value="off-plan">Off Plan</option>
                      <option value="under-construction">Under Construction</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, currency: e.target.value }))}
                        className="px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="AED">AED</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, price: Number(e.target.value) }))}
                        className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={formData.beds || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, beds: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={formData.baths || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, baths: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Area (sqft)
                    </label>
                    <input
                      type="number"
                      value={formData.sqft || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, sqft: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Furnished
                    </label>
                    <select
                      value={formData.furnished ? 'true' : 'false'}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, furnished: e.target.value === 'true' }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="false">Not Furnished</option>
                      <option value="true">Furnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Parking
                    </label>
                    <select
                      value={formData.parking}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, parking: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="not-specified">Not Specified</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="covered">Covered</option>
                      <option value="open">Open</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Describe your property..."
                  />
                </div>
              </div>
            )}

            {/* LOCATION TAB */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Area *
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, area: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter area/community"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FEATURES TAB */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                      Add Custom Feature
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Private Elevator"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Common Features
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
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
                      'Parking',
                      'Garden',
                      'Sea View',
                      'City View'
                    ].map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => addCommonFeature(feature)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.features.includes(feature)
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.features.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Selected Features ({formData.features.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature: string) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="hover:text-blue-900"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* IMAGES TAB */}
            {activeTab === 'images' && <ImagesTabContent />}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publish"
                  checked={formData.published}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, published: e.target.checked }))}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="publish" className="text-sm font-medium text-slate-700">
                  {formData.published ? 'Published' : 'Publish immediately'}
                </label>
              </div>

              <div className="flex items-center gap-4">
                {activeTab !== 'details' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(
                      activeTab === 'location' ? 'details' : 
                      activeTab === 'features' ? 'location' : 'features'
                    )}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                  >
                    Previous
                  </button>
                )}
                
                {activeTab !== 'images' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab(
                      activeTab === 'details' ? 'location' : 
                      activeTab === 'location' ? 'features' : 'images'
                    )}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {formLoading ? (
                      <span className="flex items-center gap-2">
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        {isEditing ? 'Updating...' : 'Submitting...'}
                      </span>
                    ) : (
                      isEditing ? 'Update Property' : 'Submit Property'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Search Bar Component
const SearchBar = ({ searchQuery, setSearchQuery }: { 
  searchQuery: string, 
  setSearchQuery: (query: string) => void 
}) => {
  return (
    <div className="relative w-full max-w-md">
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search properties by title, city, area, type..."
        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

// Time Period Stats Dropdown Component
const TimePeriodStatsDropdown = ({ 
  selectedPeriod, 
  setSelectedPeriod, 
  timePeriodStats 
}: { 
  selectedPeriod: 'today' | 'weekly' | 'monthly' | 'yearly' | 'allTime'
  setSelectedPeriod: (period: 'today' | 'weekly' | 'monthly' | 'yearly' | 'allTime') => void
  timePeriodStats: TimePeriodStats
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const periods = [
    { id: 'today', label: 'Today', icon: CalendarIcon, color: 'from-blue-500 to-blue-600' },
    { id: 'weekly', label: 'Weekly', icon: ChartPieIcon, color: 'from-purple-500 to-purple-600' },
    { id: 'monthly', label: 'Monthly', icon: ChartBarIcon, color: 'from-emerald-500 to-emerald-600' },
    { id: 'yearly', label: 'Yearly', icon: BuildingOfficeIcon, color: 'from-amber-500 to-amber-600' },
    { id: 'allTime', label: 'All Time', icon: FireIcon, color: 'from-rose-500 to-rose-600' }
  ]

  const getStats = () => {
    return timePeriodStats[selectedPeriod]
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 bg-gradient-to-r ${periods.find(p => p.id === selectedPeriod)?.color} text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg`}
      >
        {(() => {
          const Icon = periods.find(p => p.id === selectedPeriod)?.icon || CalendarIcon
          return <Icon className="h-5 w-5" />
        })()}
        <span>{periods.find(p => p.id === selectedPeriod)?.label} Stats</span>
        <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Stats Period</h3>
            <p className="text-sm text-slate-500">Select time period to view stats</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {periods.map((period) => {
              const Icon = period.icon
              const stats = timePeriodStats[period.id as keyof TimePeriodStats]
              return (
                <button
                  key={period.id}
                  onClick={() => {
                    setSelectedPeriod(period.id as any)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                    selectedPeriod === period.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${period.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-800">{period.label}</p>
                      <p className="text-sm text-slate-500">{stats.total} properties</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{stats.totalValue.toLocaleString()} AED</p>
                    <p className="text-sm text-slate-500">{stats.published} published</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats Summary Badge */}
      <div className="absolute -top-2 -right-2 bg-white border border-slate-300 rounded-full px-2 py-1 text-xs font-bold text-slate-700 shadow-md">
        {getStats().total}
      </div>
    </div>
  )
}

export default function AgentProperties() {
  const [properties, setProperties] = useState<AgentProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'pending_review' | 'approved' | 'rejected'>('all')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPropertyId, setCurrentPropertyId] = useState<string | null>(null)
  const [stats, setStats] = useState<PropertyStats>({
    total: 0,
    published: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    sale: 0,
    rent: 0,
    last7Days: 0,
    totalValue: 0,
    avgPrice: 0
  })
  
  // NEW STATES FOR SEARCH AND TIME PERIODS
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'weekly' | 'monthly' | 'yearly' | 'allTime'>('allTime')
  const [timePeriodStats, setTimePeriodStats] = useState<TimePeriodStats>({
    today: {
      total: 0,
      published: 0,
      pendingReview: 0,
      approved: 0,
      rejected: 0,
      sale: 0,
      rent: 0,
      last7Days: 0,
      totalValue: 0,
      avgPrice: 0
    },
    weekly: {
      total: 0,
      published: 0,
      pendingReview: 0,
      approved: 0,
      rejected: 0,
      sale: 0,
      rent: 0,
      last7Days: 0,
      totalValue: 0,
      avgPrice: 0
    },
    monthly: {
      total: 0,
      published: 0,
      pendingReview: 0,
      approved: 0,
      rejected: 0,
      sale: 0,
      rent: 0,
      last7Days: 0,
      totalValue: 0,
      avgPrice: 0
    },
    yearly: {
      total: 0,
      published: 0,
      pendingReview: 0,
      approved: 0,
      rejected: 0,
      sale: 0,
      rent: 0,
      last7Days: 0,
      totalValue: 0,
      avgPrice: 0
    },
    allTime: {
      total: 0,
      published: 0,
      pendingReview: 0,
      approved: 0,
      rejected: 0,
      sale: 0,
      rent: 0,
      last7Days: 0,
      totalValue: 0,
      avgPrice: 0
    }
  })
  
  const searchParams = useSearchParams()
  
  // Form state
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    price: 0,
    currency: 'AED',
    images: [],
    beds: 0,
    baths: 0,
    sqft: 0,
    area: '',
    city: 'Dubai',
    type: 'apartment',
    description: '',
    address: '',
    features: [],
    status: 'sale',
    property_status: 'ready',
    furnished: false,
    parking: 'not-specified',
    published: false
  })

  const [newImageUrl, setNewImageUrl] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [activeTab, setActiveTab] = useState<'details' | 'location' | 'features' | 'images'>('details')
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'gallery'>('url')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setupRealTimeListener()
    
    if (searchParams.get('submitted') === 'true') {
      setShowSuccessMessage(true)
      window.history.replaceState({}, '', '/agent/properties')
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
  }, [searchParams])

  // Calculate stats function
  const calculateStats = (propertiesData: AgentProperty[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    
    // Filter properties for different time periods
    const todayProperties = propertiesData.filter(p => {
      const createdDate = new Date(p.created_at)
      return createdDate >= today
    })
    
    const weeklyProperties = propertiesData.filter(p => {
      const createdDate = new Date(p.created_at)
      return createdDate >= sevenDaysAgo
    })
    
    const monthlyProperties = propertiesData.filter(p => {
      const createdDate = new Date(p.created_at)
      return createdDate >= thirtyDaysAgo
    })
    
    const yearlyProperties = propertiesData.filter(p => {
      const createdDate = new Date(p.created_at)
      return createdDate >= oneYearAgo
    })
    
    const calculatePeriodStats = (filteredProperties: AgentProperty[]) => ({
      total: filteredProperties.length,
      published: filteredProperties.filter(p => p.published).length,
      pendingReview: filteredProperties.filter(p => p.review_status === 'pending_review').length,
      approved: filteredProperties.filter(p => p.review_status === 'approved').length,
      rejected: filteredProperties.filter(p => p.review_status === 'rejected').length,
      sale: filteredProperties.filter(p => p.status === 'sale').length,
      rent: filteredProperties.filter(p => p.status === 'rent').length,
      last7Days: filteredProperties.filter(p => {
        const createdDate = new Date(p.created_at)
        return createdDate >= sevenDaysAgo
      }).length,
      totalValue: filteredProperties.reduce((sum, p) => sum + p.price, 0),
      avgPrice: filteredProperties.length > 0 
        ? Math.round(filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length)
        : 0
    })
    
    return {
      today: calculatePeriodStats(todayProperties),
      weekly: calculatePeriodStats(weeklyProperties),
      monthly: calculatePeriodStats(monthlyProperties),
      yearly: calculatePeriodStats(yearlyProperties),
      allTime: calculatePeriodStats(propertiesData)
    }
  }

  // Firebase Real-time Listener
  const setupRealTimeListener = () => {
    try {
      const propertiesRef = collection(db, 'agent_properties')
      let q = query(propertiesRef, orderBy('created_at', 'desc'))
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const propertiesData: AgentProperty[] = []
        
        snapshot.forEach((doc) => {
          const data = doc.data()
          propertiesData.push({
            id: doc.id,
            title: data.title || '',
            price: data.price || 0,
            currency: data.currency || 'AED',
            images: data.images || [],
            beds: data.beds || 0,
            baths: data.baths || 0,
            sqft: data.sqft || 0,
            area: data.area || '',
            city: data.city || 'Dubai',
            type: data.type || 'apartment',
            published: data.published || false,
            review_status: data.review_status || 'draft',
            submitted_at: data.submitted_at,
            created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at || new Date().toISOString(),
            address: data.address || '',
            description: data.description || '',
            features: data.features || [],
            status: data.status || 'sale',
            property_status: data.property_status || 'ready',
            furnished: data.furnished || false,
            parking: data.parking || 'not-specified'
          })
        })
        
        setProperties(propertiesData)
        const periodStats = calculateStats(propertiesData)
        setTimePeriodStats(periodStats)
        setStats(periodStats[selectedPeriod])
        setLoading(false)
      }, (error) => {
        console.error('Real-time listener error:', error)
        setLoading(false)
      })
      
      return unsubscribe
    } catch (error) {
      console.error('Error setting up listener:', error)
      setLoading(false)
    }
  }

  // Update stats when selected period changes
  useEffect(() => {
    if (properties.length > 0) {
      setStats(timePeriodStats[selectedPeriod])
    }
  }, [selectedPeriod, timePeriodStats, properties])

  // EDIT PROPERTY FUNCTION
  const handleEditProperty = (property: AgentProperty) => {
    setIsEditing(true)
    setCurrentPropertyId(property.id)
    
    // Form ko existing data se fill karein
    setFormData({
      title: property.title,
      price: property.price,
      currency: property.currency,
      images: property.images,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft,
      area: property.area,
      city: property.city,
      type: property.type,
      description: property.description,
      address: property.address,
      features: property.features,
      status: property.status,
      property_status: property.property_status,
      furnished: property.furnished || false,
      parking: property.parking || 'not-specified',
      published: property.published
    })
    
    // Modal open karein
    setShowPropertyForm(true)
    setActiveTab('details')
  }

  // FORM SUBMIT HANDLER
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    
    try {
      if (!formData.title.trim()) {
        alert('Property title is required')
        return
      }
      
      if (formData.price <= 0) {
        alert('Valid price is required')
        return
      }
      
      const propertyData = {
        title: formData.title.trim(),
        price: formData.price,
        currency: formData.currency,
        images: formData.images,
        beds: formData.beds,
        baths: formData.baths,
        sqft: formData.sqft,
        area: formData.area.trim(),
        city: formData.city.trim(),
        type: formData.type,
        description: formData.description.trim(),
        address: formData.address.trim(),
        features: formData.features,
        status: formData.status,
        property_status: formData.property_status,
        furnished: formData.furnished,
        parking: formData.parking,
        published: formData.published,
        review_status: formData.published ? 'approved' : 'pending_review' as const,
        updated_at: new Date().toISOString(),
        agent_id: 'current_agent_id',
        agent_name: 'Current Agent'
      }
      
      if (isEditing && currentPropertyId) {
        await updateDoc(doc(db, 'agent_properties', currentPropertyId), propertyData)
        console.log('Property updated with ID:', currentPropertyId)
      } else {
        const completePropertyData = {
          ...propertyData,
          submitted_at: new Date().toISOString(),
          created_at: Timestamp.now(),
          review_status: 'pending_review' as const
        }
        
        const docRef = await addDoc(collection(db, 'agent_properties'), completePropertyData)
        console.log('Property created with ID:', docRef.id)
      }
      
      resetForm()
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000)
      
    } catch (error) {
      console.error('Error saving property:', error)
      alert(isEditing ? 'Failed to update property. Please try again.' : 'Failed to add property. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  // RESET FORM FUNCTION
  const resetForm = () => {
    setFormData({
      title: '',
      price: 0,
      currency: 'AED',
      images: [],
      beds: 0,
      baths: 0,
      sqft: 0,
      area: '',
      city: 'Dubai',
      type: 'apartment',
      description: '',
      address: '',
      features: [],
      status: 'sale',
      property_status: 'ready',
      furnished: false,
      parking: 'not-specified',
      published: false
    })
    setNewImageUrl('')
    setNewFeature('')
    setIsEditing(false)
    setCurrentPropertyId(null)
    setShowPropertyForm(false)
    setActiveTab('details')
    setImageUploadMethod('url')
  }

  // FIXED: Title change handler
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }))
  }

  // IMAGE URL HANDLERS
  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // FEATURE HANDLERS
  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const addCommonFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  // FIREBASE STORAGE UPLOAD FUNCTIONS
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    await uploadFiles(Array.from(files))
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const uploadFiles = async (files: File[]) => {
    setUploadingImages(true)
    setUploadProgress(0)
    
    try {
      const uploadedUrls: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        if (file.size > 5 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 5MB.`)
          continue
        }
        
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" is not an image.`)
          continue
        }
        
        try {
          const timestamp = Date.now()
          const fileName = `property_${timestamp}_${file.name.replace(/\s+/g, '_')}`
          
          const storageRef = ref(storage, `property-images/${fileName}`)
          await uploadBytes(storageRef, file)
          
          const downloadURL = await getDownloadURL(storageRef)
          uploadedUrls.push(downloadURL)
          
          setUploadProgress(((i + 1) / files.length) * 100)
          
        } catch (error) {
          console.error('Error uploading file:', error)
          alert(`Failed to upload "${file.name}". Please try again.`)
        }
      }
      
      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }))
      }
      
    } catch (error) {
      console.error('Error in upload process:', error)
      alert('Error uploading images. Please try again.')
    } finally {
      setUploadingImages(false)
      setUploadProgress(0)
    }
  }

  // DELETE PROPERTY FUNCTION
  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    
    try {
      await deleteDoc(doc(db, 'agent_properties', propertyId))
      alert('Property deleted successfully!')
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Failed to delete property')
    }
  }

  // Filter properties based on search query and selected period
  const filteredProperties = properties.filter((prop) => {
    // Apply search filter
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Apply status filter
    let matchesFilter = true
    if (filter === 'all') matchesFilter = true
    else if (filter === 'published') matchesFilter = prop.published
    else matchesFilter = prop.review_status === filter
    
    // Apply time period filter
    let matchesTimePeriod = true
    if (selectedPeriod !== 'allTime') {
      const propDate = new Date(prop.created_at)
      const now = new Date()
      
      if (selectedPeriod === 'today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        matchesTimePeriod = propDate >= today
      } else if (selectedPeriod === 'weekly') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesTimePeriod = propDate >= sevenDaysAgo
      } else if (selectedPeriod === 'monthly') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesTimePeriod = propDate >= thirtyDaysAgo
      } else if (selectedPeriod === 'yearly') {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        matchesTimePeriod = propDate >= oneYearAgo
      }
    }
    
    return matchesSearch && matchesFilter && matchesTimePeriod
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <ArrowPathIcon className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <BuildingOfficeIcon className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Property Management</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              Your <span className="text-blue-600">Properties</span>
            </h1>
            <p className="text-slate-500 mt-1">Manage, publish, and track your property portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-sm text-slate-400">Total Properties</div>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowPropertyForm(true)
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <PlusIcon className="h-5 w-5" />
              Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar and Time Period Dropdown Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          {searchQuery && (
            <p className="text-sm text-slate-500 mt-2 ml-1">
              Found {filteredProperties.length} properties matching "{searchQuery}"
            </p>
          )}
        </div>
        <div>
          <TimePeriodStatsDropdown 
            selectedPeriod={selectedPeriod} 
            setSelectedPeriod={setSelectedPeriod}
            timePeriodStats={timePeriodStats}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} filter={filter} setFilter={setFilter} />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <CheckCircleIcon className="h-6 w-6 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-emerald-800 font-medium">
              {isEditing ? 'Property Updated Successfully!' : 'Property Submitted Successfully!'}
            </p>
            <p className="text-emerald-600 text-sm">
              {isEditing ? 'Your property has been updated.' : 'Your property has been submitted for admin review.'}
            </p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="ml-auto text-emerald-600 hover:text-emerald-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Properties Grid with Image Slider */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <BuildingOfficeIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">No properties found</p>
          <p className="text-slate-400 text-sm mb-6">
            {searchQuery 
              ? `No properties found for "${searchQuery}"`
              : filter !== 'all' 
                ? `No ${filter.replace('_', ' ')} properties for ${selectedPeriod} period`
                : `Start by adding your first property for ${selectedPeriod} period`
            }
          </p>
          <button
            onClick={() => {
              resetForm()
              setShowPropertyForm(true)
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Create your first property
          </button>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {filteredProperties.length} Properties
              </h3>
              <p className="text-slate-500 text-sm">
                Showing {filter === 'all' ? 'all' : filter.replace('_', ' ')} properties for {selectedPeriod} period
              </p>
            </div>
            <div className="text-sm text-slate-600">
              Total Value: <span className="font-bold">{stats.totalValue.toLocaleString()} AED</span>
             
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
              />
            ))}
          </div>
        </>
      )}

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyFormModal
          formData={formData}
          setFormData={setFormData}
          newImageUrl={newImageUrl}
          setNewImageUrl={setNewImageUrl}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          imageUploadMethod={imageUploadMethod}
          setImageUploadMethod={setImageUploadMethod}
          uploadingImages={uploadingImages}
          setUploadingImages={setUploadingImages}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
          dragOver={dragOver}
          setDragOver={setDragOver}
          fileInputRef={fileInputRef}
          formLoading={formLoading}
          isEditing={isEditing}
          handleFormSubmit={handleFormSubmit}
          resetForm={resetForm}
          handleTitleChange={handleTitleChange}
          addImage={addImage}
          removeImage={removeImage}
          addFeature={addFeature}
          addCommonFeature={addCommonFeature}
          removeFeature={removeFeature}
          handleFileSelect={handleFileSelect}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
        />
      )}
    </div>
  )
}