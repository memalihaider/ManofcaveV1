'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  BuildingOfficeIcon,
  HomeModernIcon,
  HomeIcon,
  MapIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

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

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void> | void
  initialData?: Partial<CategoryFormData>
  mode?: 'create' | 'edit'
}

const availableIcons = [
  { name: 'BuildingOfficeIcon', component: BuildingOfficeIcon, label: 'Office Building' },
  { name: 'HomeModernIcon', component: HomeModernIcon, label: 'Modern Home' },
  { name: 'HomeIcon', component: HomeIcon, label: 'Home' },
  { name: 'MapIcon', component: MapIcon, label: 'Map' },
  { name: 'BuildingStorefrontIcon', component: BuildingStorefrontIcon, label: 'Storefront' },
  { name: 'SparklesIcon', component: SparklesIcon, label: 'Sparkles' },
  { name: 'CubeIcon', component: CubeIcon, label: 'Cube' },
  { name: 'WrenchScrewdriverIcon', component: WrenchScrewdriverIcon, label: 'Tools' },
  { name: 'TruckIcon', component: TruckIcon, label: 'Truck' },
  { name: 'ShoppingBagIcon', component: ShoppingBagIcon, label: 'Shopping' },
]

const categoryColors = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
]

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    icon: initialData?.icon || 'BuildingOfficeIcon',
    color: initialData?.color || 'blue',
    isActive: initialData?.isActive ?? true,
    parentId: initialData?.parentId,
    order: initialData?.order || 0,
    slug: initialData?.slug || '',
  })

  const [selectedIcon, setSelectedIcon] = useState(availableIcons.find(icon => icon.name === formData.icon) || availableIcons[0])
  const [selectedColor, setSelectedColor] = useState(categoryColors.find(color => color.value === formData.color) || categoryColors[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        icon: initialData.icon || 'BuildingOfficeIcon',
        color: initialData.color || 'blue',
        isActive: initialData.isActive ?? true,
        parentId: initialData.parentId,
        order: initialData.order || 0,
        slug: initialData.slug || '',
      })
      setSelectedIcon(availableIcons.find(icon => icon.name === initialData.icon) || availableIcons[0])
      setSelectedColor(categoryColors.find(color => color.value === initialData.color) || categoryColors[0])
    } else {
      // Reset form for new category
      setFormData({
        name: '',
        description: '',
        icon: 'BuildingOfficeIcon',
        color: 'blue',
        isActive: true,
        order: 0,
        slug: '',
      })
      setSelectedIcon(availableIcons[0])
      setSelectedColor(categoryColors[0])
      setError('')
    }
  }, [initialData, isOpen])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
      .trim()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({ 
      ...prev, 
      name,
      slug: generateSlug(name) // Auto-generate slug
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Category name is required')
      }

      if (!formData.slug?.trim()) {
        throw new Error('Slug is required')
      }

      // Prepare category data for Firebase
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        color: formData.color,
        isActive: Boolean(formData.isActive),
        order: Number(formData.order) || 0,
        slug: formData.slug.trim(),
        parentId: formData.parentId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      console.log('Saving category to Firebase:', categoryData)

      if (mode === 'edit' && initialData?.id) {
        // Update existing category in Firebase
        const categoryRef = doc(db, 'categories', initialData.id)
        await updateDoc(categoryRef, {
          ...categoryData,
          updatedAt: serverTimestamp(),
        })
        console.log('Category updated in Firebase')
      } else {
        // Add new category to Firebase
        const categoriesRef = collection(db, 'categories')
        const docRef = await addDoc(categoriesRef, {
          ...categoryData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        console.log('Category added to Firebase with ID:', docRef.id)
        
        // Add ID to form data for callback
        formData.id = docRef.id
      }

      // Call parent's onSubmit callback
      await onSubmit(formData)
      
      // Close modal on success
      onClose()

    } catch (error: any) {
      console.error('Error saving category:', error)
      setError(error.message || 'Failed to save category. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIconSelect = (icon: typeof availableIcons[0]) => {
    setSelectedIcon(icon)
    setFormData(prev => ({ ...prev, icon: icon.name }))
  }

  const handleColorSelect = (color: typeof categoryColors[0]) => {
    setSelectedColor(color)
    setFormData(prev => ({ ...prev, color: color.value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'edit' ? 'Edit Category' : 'Add New Category'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'edit' ? 'Update category details' : 'Create a new property category'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Luxury Apartments, Villas, Commercial"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., luxury-apartments, villas"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly version of name (auto-generated)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this category..."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Icon Selection</h3>
            <div className="grid grid-cols-5 gap-3">
              {availableIcons.map((icon) => {
                const IconComponent = icon.component
                const isSelected = selectedIcon.name === icon.name
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => handleIconSelect(icon)}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={isSubmitting}
                  >
                    <IconComponent className={`h-6 w-6 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <span className="text-xs mt-2 text-gray-600">{icon.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Color Selection</h3>
            <div className="grid grid-cols-4 gap-3">
              {categoryColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                    selectedColor.value === color.value
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full ${color.class} mb-2`}></div>
                    <span className="text-xs text-gray-700">{color.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  min="0"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <p className="text-sm text-gray-500">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="isActive"
                    className={`block h-6 w-12 rounded-full cursor-pointer transition-colors ${
                      formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                        formData.isActive ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                mode === 'edit' ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}