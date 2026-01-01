'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Category {
  id: string
  name: string
  color: string
  description: string
  icon: string
  isActive: boolean
  order: number
  parentId: string | null
  slug: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  totalCategories: number
  totalProperties: number
  totalAgents: number
  totalValuations: number
  totalInquiries: number
  activeCategories: number
  activeProperties: number
  activeAgents: number
  pendingValuations: number
  pendingInquiries: number
}

export default function SinglePageDashboard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<Stats>({
    totalCategories: 0,
    totalProperties: 0,
    totalAgents: 0,
    totalValuations: 0,
    totalInquiries: 0,
    activeCategories: 0,
    activeProperties: 0,
    activeAgents: 0,
    pendingValuations: 0,
    pendingInquiries: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Categories
      const categoriesSnapshot = await getDocs(collection(db, 'categories'))
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[]
      setCategories(categoriesData)

      // 2. Fetch Properties
      const propertiesSnapshot = await getDocs(collection(db, 'properties'))
      const propertiesData = propertiesSnapshot.docs.map(doc => doc.data())
      
      // 3. Fetch Agents
      const agentsSnapshot = await getDocs(collection(db, 'agents'))
      const agentsData = agentsSnapshot.docs.map(doc => doc.data())
      
      // 4. Fetch Valuations (or inquiries for valuations)
      const valuationsSnapshot = await getDocs(collection(db, 'valuations'))
      const valuationsData = valuationsSnapshot.docs.map(doc => doc.data())
      
      // 5. Fetch Inquiries
      const inquiriesSnapshot = await getDocs(collection(db, 'inquiries'))
      const inquiriesData = inquiriesSnapshot.docs.map(doc => doc.data())

      // Calculate stats
      const newStats: Stats = {
        totalCategories: categoriesData.length,
        totalProperties: propertiesData.length,
        totalAgents: agentsData.length,
        totalValuations: valuationsData.length,
        totalInquiries: inquiriesData.length,
        activeCategories: categoriesData.filter(cat => cat.isActive).length,
        activeProperties: propertiesData.filter((prop: any) => prop.published === true).length,
        activeAgents: agentsData.filter((agent: any) => agent.approved === true).length,
        pendingValuations: valuationsData.filter((val: any) => val.status === 'pending').length,
        pendingInquiries: inquiriesData.filter((inq: any) => inq.status === 'pending').length
      }

      setStats(newStats)

      // Prepare recent activity
      const activities = [
        ...categoriesData.slice(0, 3).map(cat => ({
          type: 'category',
          name: cat.name,
          time: cat.createdAt,
          status: cat.isActive ? 'active' : 'inactive',
          color: cat.color
        })),
        ...propertiesData.slice(0, 2).map((prop: any) => ({
          type: 'property',
          name: prop.title || 'Unnamed Property',
          time: prop.created_at,
          status: prop.published ? 'published' : 'draft'
        })),
        ...agentsData.slice(0, 2).map((agent: any) => ({
          type: 'agent',
          name: agent.title || 'Unnamed Agent',
          time: agent.created_at,
          status: agent.approved ? 'approved' : 'pending'
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      
      setRecentActivity(activities)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Function to get icon component
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'TruckIcon': '🚚',
      'HomeIcon': '🏠',
      'BuildingIcon': '🏢',
      'CarIcon': '🚗',
      'BriefcaseIcon': '💼',
      'ShoppingCartIcon': '🛒',
      'StarIcon': '⭐',
      'HeartIcon': '❤️',
      'TagIcon': '🏷️',
      'CalendarIcon': '📅',
      'UsersIcon': '👥',
      'DollarIcon': '💰'
    }
    
    return iconMap[iconName] || '📂'
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'published': 'bg-green-100 text-green-800',
      'approved': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-orange-100 text-orange-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Real-time statistics and insights from your system</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={fetchAllData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔄 Refresh Data
          </button>
          <span className="text-sm text-gray-500 self-center">
            Auto-refreshes every 30 seconds
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Categories Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Categories</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCategories}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm px-2 py-1 rounded-full ${stats.activeCategories > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {stats.activeCategories} active
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📂</span>
            </div>
          </div>
        </div>

        {/* Properties Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProperties}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm px-2 py-1 rounded-full ${stats.activeProperties > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {stats.activeProperties} published
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🏠</span>
            </div>
          </div>
        </div>

        {/* Agents Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Agents</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAgents}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm px-2 py-1 rounded-full ${stats.activeAgents > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {stats.activeAgents} approved
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        {/* Inquiries & Valuations Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Customer Interactions</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.totalValuations}</p>
                  <p className="text-sm text-gray-500">Valuations</p>
                  {stats.pendingValuations > 0 && (
                    <p className="text-xs text-orange-600 mt-1">{stats.pendingValuations} pending</p>
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.totalInquiries}</p>
                  <p className="text-sm text-gray-500">Inquiries</p>
                  {stats.pendingInquiries > 0 && (
                    <p className="text-xs text-orange-600 mt-1">{stats.pendingInquiries} pending</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📞</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Categories ({categories.length})</h2>
              <p className="text-sm text-gray-500">All categories from your database</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <span className="text-lg">{getIcon(category.icon)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">{category.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {categories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📂</div>
                <p className="text-gray-500">No categories found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Active Categories</span>
                <span className="font-medium">{stats.activeCategories}/{stats.totalCategories}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Published Properties</span>
                <span className="font-medium">{stats.activeProperties}/{stats.totalProperties}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Approved Agents</span>
                <span className="font-medium">{stats.activeAgents}/{stats.totalAgents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Actions</span>
                <span className="font-medium text-orange-600">{stats.pendingInquiries + stats.pendingValuations}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-500">Latest updates in your system</p>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'category' ? 'bg-purple-100' :
                        activity.type === 'property' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        {activity.type === 'category' && '📂'}
                        {activity.type === 'property' && '🏠'}
                        {activity.type === 'agent' && '👥'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500 capitalize">
                            {activity.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

         
         
        </div>
      </div>

     
    </div>
  )
}