'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  DocumentTextIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'

interface DownloadInterest {
  id: string
  property_id: string
  download_type: string
  full_name: string
  email: string
  phone: string
  nationality?: string
  occupation?: string
  employer?: string
  monthly_income?: number
  interested_in_financing: boolean
  budget_range?: string
  timeline?: string
  additional_notes?: string
  ip_address: string
  user_agent: string
  status: string
  created_at: string
  updated_at?: string
  contacted_at?: string
  converted_at?: string
  properties?: {
    id: string
    title: string
    location: string
  }
}

export default function DownloadInterestsPage() {
  const [interests, setInterests] = useState<DownloadInterest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInterest, setSelectedInterest] = useState<DownloadInterest | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'converted'>('all')

  useEffect(() => {
    fetchInterests()
  }, [filter])

  const fetchInterests = async () => {
    try {
      const response = await fetch('/api/admin/download-interests')
      const data = await response.json()

      if (data.error) {
        console.error('Error fetching download interests:', data.error)
        setInterests([])
        return
      }

      let filteredData = data.download_interests || []

      if (filter !== 'all') {
        filteredData = filteredData.filter((interest: DownloadInterest) => interest.status === filter)
      }

      setInterests(filteredData)
    } catch (error) {
      console.error('Error fetching download interests:', error)
      setInterests([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/download-interests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      const data = await response.json()

      if (data.error) {
        console.error('Error updating status:', data.error)
        return
      }

      // Update local state
      setInterests(prev => prev.map(interest =>
        interest.id === id ? { ...interest, status, updated_at: new Date().toISOString() } : interest
      ))

      if (selectedInterest?.id === id) {
        setSelectedInterest(prev => prev ? { ...prev, status, updated_at: new Date().toISOString() } : null)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-purple-100 text-purple-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'not_interested': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'contacted': return <EyeIcon className="w-4 h-4" />
      case 'qualified': return <CheckCircleIcon className="w-4 h-4" />
      case 'converted': return <CheckCircleSolidIcon className="w-4 h-4" />
      case 'not_interested': return <XCircleIcon className="w-4 h-4" />
      default: return <DocumentTextIcon className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Download Interests</h1>
          <p className="text-gray-600 mt-1">Manage leads from floor plan and brochure downloads</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Interests</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: 'Total', value: interests.length, color: 'bg-blue-500' },
          { label: 'New', value: interests.filter(i => i.status === 'new').length, color: 'bg-yellow-500' },
          { label: 'Contacted', value: interests.filter(i => i.status === 'contacted').length, color: 'bg-purple-500' },
          { label: 'Qualified', value: interests.filter(i => i.status === 'qualified').length, color: 'bg-green-500' },
          { label: 'Converted', value: interests.filter(i => i.status === 'converted').length, color: 'bg-emerald-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interests.map((interest) => (
                <tr key={interest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{interest.full_name}</div>
                        <div className="text-sm text-gray-500">{interest.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {interest.properties?.title || 'Unknown Property'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {interest.properties?.location || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      interest.download_type === 'floor_plan'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {interest.download_type === 'floor_plan' ? 'Floor Plan' : 'Brochure'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interest.status)}`}>
                      {getStatusIcon(interest.status)}
                      <span className="ml-1 capitalize">{interest.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(interest.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedInterest(interest)}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      View Details
                    </button>
                    <select
                      value={interest.status}
                      onChange={(e) => updateStatus(interest.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="not_interested">Not Interested</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interest Details Modal */}
      {selectedInterest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Interest Details</h2>
                <button
                  onClick={() => setSelectedInterest(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedInterest.full_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedInterest.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedInterest.phone}</span>
                    </div>
                    {selectedInterest.nationality && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Nationality:</span>
                        <span className="text-gray-900">{selectedInterest.nationality}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Info</h3>
                  <div className="space-y-3">
                    {selectedInterest.occupation && (
                      <div className="flex items-center gap-3">
                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedInterest.occupation}</span>
                      </div>
                    )}
                    {selectedInterest.employer && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Employer:</span>
                        <span className="text-gray-900">{selectedInterest.employer}</span>
                      </div>
                    )}
                    {selectedInterest.monthly_income && (
                      <div className="flex items-center gap-3">
                        <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">AED {selectedInterest.monthly_income.toLocaleString()}/month</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Interest */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Interest</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Download Type:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">
                        {selectedInterest.download_type.replace('_', ' ')}
                      </span>
                    </div>
                    {selectedInterest.budget_range && (
                      <div>
                        <span className="text-sm text-gray-500">Budget Range:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedInterest.budget_range}</span>
                      </div>
                    )}
                    {selectedInterest.timeline && (
                      <div>
                        <span className="text-sm text-gray-500">Timeline:</span>
                        <span className="ml-2 font-medium text-gray-900 capitalize">
                          {selectedInterest.timeline.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Financing Interest:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedInterest.interested_in_financing ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Property:</span>
                    <div className="mt-1">
                      <p className="font-medium text-gray-900">
                        {selectedInterest.properties?.title || 'Unknown Property'}
                      </p>
                      {selectedInterest.properties && (
                        <p className="text-sm text-gray-500">
                          {selectedInterest.properties.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedInterest.additional_notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedInterest.additional_notes}
                  </p>
                </div>
              )}

              {/* Status and Dates */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInterest.status)}`}>
                        {getStatusIcon(selectedInterest.status)}
                        <span className="ml-1 capitalize">{selectedInterest.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Submitted:</span>
                    <div className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedInterest.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>

                  {selectedInterest.contacted_at && (
                    <div>
                      <span className="text-sm text-gray-500">Contacted:</span>
                      <div className="mt-1 text-sm text-gray-900">
                        {format(new Date(selectedInterest.contacted_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}