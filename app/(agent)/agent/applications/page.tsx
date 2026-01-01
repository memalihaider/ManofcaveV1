'use client'

import { useState, useEffect } from 'react'
import {
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

interface Application {
  id: string
  name: string
  email: string
  phone: string
  message: string
  property_title: string
  property_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  responded_at?: string
}

export default function AgentApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [respondingId, setRespondingId] = useState<string | null>(null)
  const [responseMessage, setResponseMessage] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const query = filter === 'all' ? '' : `?status=${filter}`
      const res = await fetch(`/api/agent/applications${query}`)
      const data = await res.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (applicationId: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/agent/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'accept' ? 'accepted' : 'rejected',
          response_message: responseMessage
        })
      })

      if (res.ok) {
        setSelectedApp(null)
        setResponseMessage('')
        setRespondingId(null)
        fetchApplications()
      }
    } catch (error) {
      console.error('Error responding to application:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'accepted':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true
    return app.status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <ArrowPathIcon className="h-8 w-8 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <EnvelopeIcon className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Lead Management</span>
            </div>
            <h1 className="text-4xl font-serif text-secondary">
              Property <span className="text-primary italic">Inquiries</span>
            </h1>
            <p className="text-slate-500 mt-2">Manage and respond to property applications and leads</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-secondary">{applications.length}</div>
            <div className="text-sm text-slate-400">Total Applications</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit overflow-x-auto">
        {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-3 font-bold rounded-xl transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-secondary text-white shadow-md'
                : 'text-slate-400 hover:text-secondary hover:bg-slate-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-sm opacity-75">
              ({applications.filter(a => status === 'all' || a.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <EnvelopeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No applications yet</p>
          <p className="text-sm text-muted-foreground mt-2">When you receive applications, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedApp(app)}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Applicant Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{app.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{app.property_title}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {getStatusIcon(app.status)}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <EnvelopeIcon className="h-4 w-4" />
                      <a href={`mailto:${app.email}`} className="text-primary hover:underline">
                        {app.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <PhoneIcon className="h-4 w-4" />
                      <a href={`tel:${app.phone}`} className="text-primary hover:underline">
                        {app.phone}
                      </a>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{app.message}</p>

                  {/* Date */}
                  <p className="text-xs text-muted-foreground mt-3">
                    Applied: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Quick Actions */}
                {app.status === 'pending' && (
                  <div className="flex gap-2 md:flex-col md:w-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedApp(app)
                        setRespondingId(app.id)
                      }}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors font-medium text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedApp(app)
                        setRespondingId(app.id)
                      }}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-medium text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border sticky top-0 bg-card">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">{selectedApp.name}</h2>
                <button
                  onClick={() => {
                    setSelectedApp(null)
                    setRespondingId(null)
                    setResponseMessage('')
                  }}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Applicant Info */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
                    <a href={`mailto:${selectedApp.email}`} className="text-primary hover:underline">
                      {selectedApp.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                    <a href={`tel:${selectedApp.phone}`} className="text-primary hover:underline">
                      {selectedApp.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Property</h3>
                <p className="text-muted-foreground">{selectedApp.property_title}</p>
              </div>

              {/* Message */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Message</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedApp.message}</p>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Status</h3>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedApp.status
                  )}`}
                >
                  {getStatusIcon(selectedApp.status)}
                  {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                </span>
              </div>

              {/* Response Section */}
              {selectedApp.status === 'pending' && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Your Response</h3>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Write a message to the applicant..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    rows={4}
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleRespond(selectedApp.id, 'accept')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Accept Application
                    </button>
                    <button
                      onClick={() => handleRespond(selectedApp.id, 'reject')}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              )}

              {/* Close Button */}
              {selectedApp.status !== 'pending' && (
                <button
                  onClick={() => {
                    setSelectedApp(null)
                    setRespondingId(null)
                    setResponseMessage('')
                  }}
                  className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
