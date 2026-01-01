'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPinIcon, BuildingOfficeIcon, HomeIcon, CurrencyDollarIcon, MagnifyingGlassIcon, ArrowRightIcon, StarIcon } from '@heroicons/react/24/outline'

const dubaiAreas = [
  {
    name: 'Dubai Marina',
    description: 'Modern waterfront living with luxury apartments and yachts',
    avgPrice: 'AED 2.5M - 15M',
    highlights: ['Waterfront views', 'Marina lifestyle', 'Modern architecture'],
    image: '/api/placeholder/400/300',
    properties: 1250,
    rating: 4.8
  },
  {
    name: 'Palm Jumeirah',
    description: 'Iconic palm-shaped island with exclusive beachfront properties',
    avgPrice: 'AED 5M - 50M+',
    highlights: ['Beachfront', 'Exclusive location', 'Premium amenities'],
    image: '/api/placeholder/400/300',
    properties: 890,
    rating: 4.9
  },
  {
    name: 'Dubai Hills Estate',
    description: 'Master-planned community with villas and townhouses',
    avgPrice: 'AED 3M - 25M',
    highlights: ['Family-friendly', 'Golf course', 'Nature views'],
    image: '/api/placeholder/400/300',
    properties: 2100,
    rating: 4.7
  },
  {
    name: 'Jumeirah Village Circle',
    description: 'Affordable luxury living with excellent connectivity',
    avgPrice: 'AED 800K - 5M',
    highlights: ['Affordable luxury', 'Metro access', 'Community focus'],
    image: '/api/placeholder/400/300',
    properties: 3200,
    rating: 4.6
  },
  {
    name: 'Dubai Silicon Oasis',
    description: 'Tech hub with modern apartments and villas',
    avgPrice: 'AED 1.2M - 8M',
    highlights: ['Tech community', 'Business park', 'Modern living'],
    image: '/api/placeholder/400/300',
    properties: 1500,
    rating: 4.5
  },
  {
    name: 'Arabian Ranches',
    description: 'Equestrian community with luxury villas and equestrian facilities',
    avgPrice: 'AED 4M - 30M',
    highlights: ['Equestrian lifestyle', 'Spacious villas', 'Private community'],
    image: '/api/placeholder/400/300',
    properties: 980,
    rating: 4.8
  }
]

const areaCategories = [
  {
    title: 'Luxury Waterfront',
    icon: BuildingOfficeIcon,
    areas: ['Dubai Marina', 'Palm Jumeirah', 'Jumeirah Beach Residence'],
    description: 'Premium properties with stunning sea views and marina access'
  },
  {
    name: 'Family Communities',
    icon: HomeIcon,
    areas: ['Dubai Hills Estate', 'Arabian Ranches', 'Dubai Festival City'],
    description: 'Spacious villas and townhouses perfect for families'
  },
  {
    name: 'Affordable Luxury',
    icon: CurrencyDollarIcon,
    areas: ['Jumeirah Village Circle', 'Dubai Silicon Oasis', 'Dubai South'],
    description: 'Quality properties at competitive price points'
  }
]

export default function AreaGuidesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredAreas = dubaiAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || area.name.toLowerCase().includes(selectedCategory.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-slate-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-secondary mb-6 tracking-tight">
              <span className="text-secondary">Dubai Area</span> <span className="text-primary">Guides</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover the perfect neighborhood in Dubai. Explore detailed guides for every area,
              from luxury waterfront properties to family-friendly communities.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                <input
                  type="text"
                  placeholder="Search Dubai areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="All">All Categories</option>
                <option value="Marina">Waterfront</option>
                <option value="Palm">Palm Areas</option>
                <option value="Hills">Hill Communities</option>
                <option value="Village">Village Areas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Area Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {areaCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 shadow-sm">
              <category.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-3">{category.title}</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">{category.description}</p>
              <div className="space-y-2">
                {category.areas.map((area, idx) => (
                  <div key={idx} className="flex items-center text-sm text-slate-500">
                    <MapPinIcon className="h-4 w-4 text-primary mr-2" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAreas.map((area, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 shadow-sm group">
              <div className="h-48 bg-slate-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPinIcon className="h-16 w-16 text-primary" />
                </div>
                <div className="absolute top-4 right-4 bg-primary text-secondary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                  <StarIcon className="h-3 w-3" />
                  {area.rating}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">{area.name}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{area.description}</p>

                <div className="mb-4">
                  <div className="text-primary font-bold text-lg">{area.avgPrice}</div>
                  <div className="text-slate-500 text-sm">Average Property Price</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-slate-500 mb-2">Key Highlights:</div>
                  <div className="flex flex-wrap gap-2">
                    {area.highlights.map((highlight, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full border border-slate-200">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>{area.properties} properties available</span>
                </div>

                <Link
                  href={`/properties?location=${encodeURIComponent(area.name)}`}
                  className="w-full bg-primary hover:bg-primary/90 text-secondary font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  Explore Properties
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredAreas.length === 0 && (
          <div className="text-center py-12">
            <MapPinIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">No areas found</h3>
            <p className="text-slate-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

const featuredGuides = [
  {
    title: 'Ultimate Dubai Property Investment Guide 2025',
    description: 'Everything investors need to know about Dubai\'s property market in 2025.',
    category: 'Investment',
    readTime: '15 min read',
    difficulty: 'Advanced',
    featured: true
  },
  {
    title: 'First-Time Buyer\'s Complete Handbook',
    description: 'From choosing your property to moving in - a complete guide for new buyers.',
    category: 'Buying',
    readTime: '12 min read',
    difficulty: 'Beginner',
    featured: true
  }
]