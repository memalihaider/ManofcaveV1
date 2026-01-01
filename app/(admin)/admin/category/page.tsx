'use client';

import { useState, useEffect } from 'react'
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  ArrowPathIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import CategoryForm from '@/components/forms/CategoryForm'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

interface Category {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  isActive?: boolean
  parentId?: string
  order?: number
  slug?: string
  createdAt?: any
  updatedAt?: any
}

interface CategoryFormData {
  id?: string
  name: string
  description: string
  icon: string
  color: string
  isActive: boolean
  parentId?: string
  order: number
  slug?: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    try {
      setLoading(true)
      console.log('Fetching categories from Firebase...')
      
      const categoriesRef = collection(db, 'categories')
      const snapshot = await getDocs(categoriesRef)
      
      const categoriesData: Category[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        categoriesData.push({
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          icon: data.icon || 'BuildingOfficeIcon',
          color: data.color || 'blue',
          isActive: data.isActive ?? true,
          parentId: data.parentId,
          order: data.order || 0,
          slug: data.slug || '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
      })
      
      // Sort by order, then by name
      categoriesData.sort((a, b) => {
        const orderA = a.order || 0
        const orderB = b.order || 0
        if (orderA !== orderB) return orderA - orderB
        return a.name.localeCompare(b.name)
      })
      
      console.log(`Fetched ${categoriesData.length} categories`)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchCategories()
  }, [])

  // Calculate stats
  const totalCategories = categories.length
  const activeCategories = categories.filter(c => c.isActive).length
  const inactiveCategories = categories.filter(c => !c.isActive).length
  const latestCategories = categories
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0)
      const dateB = b.createdAt?.toDate?.() || new Date(0)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)

  // Handle adding category
  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      console.log('Category added, refreshing list...')
      await fetchCategories()
      setShowAddCategory(false)
    } catch (error) {
      console.error('Error handling add category:', error)
    }
  }

  // Handle editing category
  const handleEditCategory = async (data: CategoryFormData) => {
    try {
      console.log('Category updated, refreshing list...')
      await fetchCategories()
      setEditingCategory(null)
    } catch (error) {
      console.error('Error handling edit category:', error)
    }
  }

  // Handle deleting category from Firebase
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return
    
    try {
      console.log('Deleting category:', id)
      const categoryRef = doc(db, 'categories', id)
      await deleteDoc(categoryRef)
      
      console.log('Category deleted successfully')
      setCategories(categories.filter(cat => cat.id !== id))
      alert('Category deleted successfully!')
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category. Please try again.')
    }
  }

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return 'N/A'
    }
  }

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Categories',
      value: totalCategories,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      percentage: 0,
      trend: '',
     
      trendColor: 'text-emerald-600'
    },
    {
      title: 'Active Categories',
      value: activeCategories,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      description: 'Currently active categories',
      percentage: totalCategories > 0 ? Math.round((activeCategories / totalCategories) * 100) : 0,
      trend: '',
     
      trendColor: 'text-emerald-600'
    },
    {
      title: 'Inactive Categories',
      value: inactiveCategories,
      icon: XCircleIcon,
      color: 'bg-rose-500',
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50',
      description: 'Currently hidden categories',
      percentage: totalCategories > 0 ? Math.round((inactiveCategories / totalCategories) * 100) : 0,
      trend: '',
    
      trendColor: 'text-rose-600'
    },
    {
      title: 'Latest Added',
      value: latestCategories.length,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Recently created categories',
      percentage: 0,
      trend: '',
     
      trendColor: 'text-purple-600'
    }
  ]

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 mt-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Loading dashboard...</p>
          </div>
          <div className="animate-pulse h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
        
        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-3" />
            <div className="text-gray-500">Loading categories...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all property categories in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Beautiful Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <div className="flex items-end gap-2 mt-2">
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    {(stat.title === 'Active Categories' || stat.title === 'Inactive Categories') && stat.percentage > 0 && (
                      <span className="text-sm font-medium text-gray-500">
                        ({stat.percentage}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">{stat.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${stat.trendColor}`}>
                  {stat.trend}
                </span>
                {stat.title === 'Active Categories' && activeCategories > 0 && (
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(activeCategories / totalCategories) * 100}%` }}
                    ></div>
                  </div>
                )}
                {stat.title === 'Inactive Categories' && inactiveCategories > 0 && (
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(inactiveCategories / totalCategories) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

     

      {/* All Categories Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage all property categories ({totalCategories} total)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-600">Active: {activeCategories}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                <span className="text-xs text-gray-600">Inactive: {inactiveCategories}</span>
              </div>
            </div>
          </div>
        </div>
        
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first property category.</p>
            <button
              onClick={() => setShowAddCategory(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <PlusIcon className="h-5 w-5" />
              Add Your First Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name & Icon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => {
                  const iconName = category.icon || 'BuildingOfficeIcon'
                  const IconComponent = require('@heroicons/react/24/outline')[iconName] || BuildingOfficeIcon

                  return (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-10 w-10 flex items-center justify-center rounded-lg"
                            style={{ backgroundColor: category.color ? `${category.color}20` : '#f3f4f6' }}
                          >
                            {IconComponent && (
                              <IconComponent 
                                className="h-5 w-5"
                                style={{ color: category.color || '#6b7280' }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            {category.slug && (
                              <div className="text-xs text-gray-500 mt-1">
                                Slug: {category.slug}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md">
                          {category.description || (
                            <span className="text-gray-400 italic">No description</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                              category.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {category.order !== undefined && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                Order: {category.order}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {formatDate(category.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <CategoryForm
          isOpen={showAddCategory}
          onClose={() => setShowAddCategory(false)}
          onSubmit={handleAddCategory}
          mode="create"
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <CategoryForm
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onSubmit={handleEditCategory}
          initialData={editingCategory}
          mode="edit"
        />
      )}
    </div>
  )
}