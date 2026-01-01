'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface NavItemFormData {
  id?: string
  label: string
  type: 'link' | 'dropdown'
  href?: string
}

interface NavItemFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NavItemFormData) => void
  initialData?: Partial<NavItemFormData>
  mode?: 'create' | 'edit'
}

export default function NavItemForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}: NavItemFormProps) {
  const [formData, setFormData] = useState<NavItemFormData>({
    label: initialData?.label || '',
    type: initialData?.type || 'link',
    href: initialData?.href || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        label: initialData.label || '',
        type: initialData.type || 'link',
        href: initialData.href || '',
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        id: initialData?.id || `nav-${Date.now()}`,
      }

      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Error submitting navigation item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleLabelChange = (label: string) => {
    setFormData(prev => ({
      ...prev,
      label,
      href: prev.type === 'link' && !prev.href ? `/${generateSlug(label)}` : prev.href
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {mode === 'create' ? 'Add Navigation Item' : 'Edit Navigation Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
              placeholder="e.g., Properties"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                type: e.target.value as 'link' | 'dropdown',
                href: e.target.value === 'dropdown' ? undefined : prev.href
              }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
            >
              <option value="link">Single Link</option>
              <option value="dropdown">Dropdown Menu</option>
            </select>
          </div>

          {formData.type === 'link' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL/Href *
              </label>
              <input
                type="text"
                value={formData.href}
                onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                required
                placeholder="e.g., /properties"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use absolute paths starting with / or full URLs
              </p>
            </div>
          )}

          {formData.type === 'dropdown' && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Dropdown menus will be created with categories and subcategories.
                You can add them after creating this navigation item.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Item' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}