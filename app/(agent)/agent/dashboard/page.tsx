'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  FireIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  PlusIcon,
  CalendarIcon,
  ChartPieIcon,
  DocumentTextIcon,
  MapPinIcon,
  PhotoIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { collection, onSnapshot, query, orderBy, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

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
  review_status: 'pending_review' | 'approved' | 'rejected' | 'draft' | 'published'
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

interface DashboardStats {
  totalProperties: number
  published: number
  pendingReview: number
  approved: number
  rejected: number
  draft: number
  totalValue: number
  avgPrice: number
  saleCount: number
  rentCount: number
  last7DaysCount: number
  last30DaysCount: number
}

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  trend,
  trendText 
}: { 
  title: string
  value: number
  icon: any
  color: string
  bgColor: string
  trend?: 'up' | 'down' | 'neutral'
  trendText?: string
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-xl`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
            trend === 'down' ? 'bg-rose-50 text-rose-600' :
            'bg-slate-50 text-slate-600'
          }`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            <span>{trendText}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-800 mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-slate-500 font-medium">{title}</div>
    </div>
  )
}

// Property Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'published':
        return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircleIcon, label: 'Published' }
      case 'pending_review':
        return { color: 'bg-amber-100 text-amber-700', icon: ClockIcon, label: 'Under Review' }
      case 'approved':
        return { color: 'bg-blue-100 text-blue-700', icon: CheckCircleIcon, label: 'Approved' }
      case 'rejected':
        return { color: 'bg-rose-100 text-rose-700', icon: XCircleIcon, label: 'Rejected' }
      case 'draft':
        return { color: 'bg-slate-100 text-slate-700', icon: DocumentTextIcon, label: 'Draft' }
      default:
        return { color: 'bg-slate-100 text-slate-700', icon: DocumentTextIcon, label: 'Draft' }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

// Recent Property Card Component
const RecentPropertyCard = ({ property }: { property: AgentProperty }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all">
      {/* Property Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PhotoIcon className="h-8 w-8 text-slate-300" />
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-bold text-slate-800 text-sm truncate">{property.title}</h4>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPinIcon className="h-3 w-3" />
              <span className="truncate">{property.area}, {property.city}</span>
            </p>
          </div>
          <StatusBadge status={property.review_status || 'draft'} />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm font-bold text-slate-800">
            {property.currency} {property.price?.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{property.beds} bed</span>
            <span>•</span>
            <span>{property.baths} bath</span>
            <span>•</span>
            <span>{property.sqft?.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AgentDashboard() {
  const [properties, setProperties] = useState<AgentProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    published: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
    totalValue: 0,
    avgPrice: 0,
    saleCount: 0,
    rentCount: 0,
    last7DaysCount: 0,
    last30DaysCount: 0
  })

  // Fetch real-time data from Firebase
  useEffect(() => {
    const fetchRealTimeData = () => {
      try {
        const propertiesRef = collection(db, 'agent_properties')
        const q = query(propertiesRef, orderBy('created_at', 'desc'))
        
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
          calculateStats(propertiesData)
          setLoading(false)
        }, (error) => {
          console.error('Error fetching real-time data:', error)
          setLoading(false)
        })
        
        return unsubscribe
      } catch (error) {
        console.error('Error setting up real-time listener:', error)
        setLoading(false)
      }
    }

    fetchRealTimeData()
  }, [])

  // Calculate dashboard statistics
  const calculateStats = (propertiesData: AgentProperty[]) => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    // Filter properties for time periods
    const last7DaysProperties = propertiesData.filter(p => {
      const createdDate = new Date(p.created_at)
      return createdDate >= sevenDaysAgo
    })
    
    const last30DaysProperties = propertiesData.filter(p => {
      const createdDate = new Date(p.created_at)
      return createdDate >= thirtyDaysAgo
    })
    
    // Calculate counts
    const publishedCount = propertiesData.filter(p => p.published).length
    const pendingReviewCount = propertiesData.filter(p => p.review_status === 'pending_review').length
    const approvedCount = propertiesData.filter(p => p.review_status === 'approved').length
    const rejectedCount = propertiesData.filter(p => p.review_status === 'rejected').length
    const draftCount = propertiesData.filter(p => p.review_status === 'draft').length
    const saleCount = propertiesData.filter(p => p.status === 'sale').length
    const rentCount = propertiesData.filter(p => p.status === 'rent').length
    
    // Calculate values
    const totalValue = propertiesData.reduce((sum, p) => sum + (p.price || 0), 0)
    const avgPrice = propertiesData.length > 0 ? Math.round(totalValue / propertiesData.length) : 0
    
    setStats({
      totalProperties: propertiesData.length,
      published: publishedCount,
      pendingReview: pendingReviewCount,
      approved: approvedCount,
      rejected: rejectedCount,
      draft: draftCount,
      totalValue: totalValue,
      avgPrice: avgPrice,
      saleCount: saleCount,
      rentCount: rentCount,
      last7DaysCount: last7DaysProperties.length,
      last30DaysCount: last30DaysProperties.length
    })
  }

  // Get recent properties (last 5)
  const recentProperties = properties.slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
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
              <SparklesIcon className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Agent Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              Property <span className="text-blue-600">Overview</span>
            </h1>
            <p className="text-slate-500 mt-1">Real-time insights from your property portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xl font-bold text-slate-800">{stats.totalProperties}</div>
              <div className="text-sm text-slate-400">Total Properties</div>
            </div>
            <Link
              href="/agent/properties/new"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <PlusIcon className="h-5 w-5" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Portfolio Value</p>
              <p className="text-3xl font-bold">{stats.totalValue.toLocaleString()} AED</p>
              <div className="flex items-center mt-2">
                <CurrencyDollarIcon className="h-4 w-4 text-blue-200 mr-1" />
                <span className="text-blue-200 text-sm">Average: {stats.avgPrice.toLocaleString()} AED</span>
              </div>
            </div>
            <div className="bg-blue-400/30 p-3 rounded-xl">
              <ChartBarIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Properties Live</p>
              <p className="text-3xl font-bold">{stats.published}</p>
              <div className="flex items-center mt-2">
                <EyeIcon className="h-4 w-4 text-emerald-200 mr-1" />
                <span className="text-emerald-200 text-sm">{stats.last7DaysCount} added last 7 days</span>
              </div>
            </div>
            <div className="bg-emerald-400/30 p-3 rounded-xl">
              <BuildingOfficeIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium mb-1">Under Review</p>
              <p className="text-3xl font-bold">{stats.pendingReview}</p>
              <div className="flex items-center mt-2">
                <ClockIcon className="h-4 w-4 text-amber-200 mr-1" />
                <span className="text-amber-200 text-sm">Awaiting approval</span>
              </div>
            </div>
            <div className="bg-amber-400/30 p-3 rounded-xl">
              <DocumentTextIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Recent Activity</p>
              <p className="text-3xl font-bold">{stats.last30DaysCount}</p>
              <div className="flex items-center mt-2">
                <CalendarIcon className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-sm">Last 30 days</span>
              </div>
            </div>
            <div className="bg-purple-400/30 p-3 rounded-xl">
              <FireIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Status Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Property Status Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Total Properties"
                value={stats.totalProperties}
                icon={BuildingOfficeIcon}
                color="text-blue-600"
                bgColor="bg-blue-50"
                trend="up"
                trendText={`+${stats.last7DaysCount} new`}
              />
              <StatsCard
                title="Published"
                value={stats.published}
                icon={CheckCircleIcon}
                color="text-emerald-600"
                bgColor="bg-emerald-50"
              />
              <StatsCard
                title="Under Review"
                value={stats.pendingReview}
                icon={ClockIcon}
                color="text-amber-600"
                bgColor="bg-amber-50"
              />
              <StatsCard
                title="Approved"
                value={stats.approved}
                icon={CheckCircleIcon}
                color="text-blue-600"
                bgColor="bg-blue-50"
              />
              <StatsCard
                title="Rejected"
                value={stats.rejected}
                icon={XCircleIcon}
                color="text-rose-600"
                bgColor="bg-rose-50"
              />
              <StatsCard
                title="Drafts"
                value={stats.draft}
                icon={DocumentTextIcon}
                color="text-slate-600"
                bgColor="bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Quick Insights */}
        <div className="space-y-6">
          {/* Sale vs Rent */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Sale vs Rent</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>For Sale</span>
                  <span className="font-bold">{stats.saleCount}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${stats.totalProperties > 0 ? (stats.saleCount / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>For Rent</span>
                  <span className="font-bold">{stats.rentCount}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${stats.totalProperties > 0 ? (stats.rentCount / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Type Distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Property Types</h3>
            <div className="space-y-3">
              {['apartment', 'villa', 'townhouse', 'commercial', 'plot'].map((type) => {
                const count = properties.filter(p => p.type === type).length
                const percentage = stats.totalProperties > 0 ? (count / stats.totalProperties) * 100 : 0
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span className="capitalize">{type}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Properties & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Properties */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Recent Properties</h2>
              <Link 
                href="/agent/properties"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                View All
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            
            {recentProperties.length > 0 ? (
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <RecentPropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BuildingOfficeIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No properties yet</p>
                <Link 
                  href="/agent/properties/new"
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                >
                  Add your first property
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link
                href="/agent/properties/new"
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <PlusIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Add New Property</p>
                  <p className="text-sm text-blue-100">Create listing</p>
                </div>
              </Link>
              <Link
                href="/agent/properties"
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <BuildingOfficeIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Manage Properties</p>
                  <p className="text-sm text-blue-100">View all listings</p>
                </div>
              </Link>
              <Link
                href="/agent/properties?filter=pending_review"
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Review Status</p>
                  <p className="text-sm text-blue-100">Check approvals</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Listing Completion</div>
                <div className="text-lg font-bold text-slate-800">
                  {stats.totalProperties > 0 ? Math.round((stats.published / stats.totalProperties) * 100) : 0}%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Approval Rate</div>
                <div className="text-lg font-bold text-slate-800">
                  {stats.totalProperties > 0 ? Math.round(((stats.published + stats.approved) / stats.totalProperties) * 100) : 0}%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Portfolio Growth</div>
                <div className="text-lg font-bold text-emerald-600">
                  +{stats.last30DaysCount} properties
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Properties Added</p>
              <p className="text-2xl font-bold text-slate-800">{stats.last7DaysCount} in 7 days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <ArrowTrendingUpIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Listings</p>
              <p className="text-2xl font-bold text-slate-800">{stats.published} live</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <ChartPieIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Cities</p>
              <p className="text-2xl font-bold text-slate-800">
                {Array.from(new Set(properties.map(p => p.city))).length} cities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

