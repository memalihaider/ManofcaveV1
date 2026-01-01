'use client'

import { useState, useEffect } from 'react'
import { 
  Calculator, Search, Filter, Download, 
  MapPin, Home, DollarSign, Calendar, 
  MoreVertical, Eye, Trash2, CheckCircle,
  MessageSquare, Send, ChevronDown, ChevronUp
} from 'lucide-react'
import { collection, query, getDocs, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Valuation {
  id: string
  user_name?: string
  user_email: string
  property_type: string
  location: string
  bedrooms: string
  bathrooms: string
  size: string
  condition: string
  year_built: string
  urgency: string
  contact_method: string
  phoneNumber: string
  additional_features: string
  estimated_value: string
  status: 'pending' | 'completed' | 'contacted'
  created_at: string
  completed_at: string | null
  currency: string
}

interface ValuationReply {
  id?: string
  valuation_id: string
  admin_id: string
  admin_name: string
  message: string
  created_at: string
}

export default function ValuationsPage() {
  const [valuations, setValuations] = useState<Valuation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedValuation, setSelectedValuation] = useState<Valuation | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [sendingResponse, setSendingResponse] = useState(false)
  const [expandedValuations, setExpandedValuations] = useState<string[]>([])
  const [adminUser] = useState({
    id: 'admin123',
    name: 'Admin User'
  })

  useEffect(() => {
    fetchValuations()
  }, [])

  // Firebase se valuations fetch karna
  const fetchValuations = async () => {
    try {
      setLoading(true)
      const valuationsRef = collection(db, 'valuations')
      const q = query(valuationsRef)
      const querySnapshot = await getDocs(q)
      
      const valuationsData: Valuation[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        valuationsData.push({
          id: doc.id,
          user_name: data.user_name || 'N/A',
          user_email: data.user_email || '',
          property_type: data.property_type || 'Not specified',
          location: data.location || 'Not specified',
          bedrooms: data.bedrooms || 'N/A',
          bathrooms: data.bathrooms || 'N/A',
          size: data.size || 'N/A',
          condition: data.condition || 'N/A',
          year_built: data.year_built || 'N/A',
          urgency: data.urgency || 'low',
          contact_method: data.contact_method || 'email',
          phoneNumber: data.phoneNumber || 'N/A',
          additional_features: data.additional_features || 'N/A',
          estimated_value: data.estimated_value || '0',
          status: data.status || 'pending',
          created_at: data.created_at || new Date().toISOString(),
          completed_at: data.completed_at || null,
          currency: data.currency || 'AED'
        })
      })
      
      // Sort by date (newest first)
      valuationsData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setValuations(valuationsData)
    } catch (error) {
      console.error('Error fetching valuations from Firebase:', error)
      
      // Fallback mock data
      setValuations([
        { 
          id: '1', 
          user_name: 'John Doe', 
          user_email: 'john@example.com', 
          property_type: 'Villa',
          location: 'Palm Jumeirah',
          bedrooms: '5',
          bathrooms: '4',
          size: '3500',
          condition: 'excellent',
          year_built: '2020',
          urgency: 'medium',
          contact_method: 'email',
          phoneNumber: '0501234567',
          additional_features: 'Swimming pool, garden, garage',
          estimated_value: '12500000',
          status: 'pending',
          created_at: '2024-05-18T11:00:00Z',
          completed_at: null,
          currency: 'AED'
        },
        { 
          id: '2', 
          user_name: 'Jane Smith', 
          user_email: 'jane@example.com', 
          property_type: 'Apartment',
          location: 'Dubai Marina',
          bedrooms: '2',
          bathrooms: '2',
          size: '1200',
          condition: 'good',
          year_built: '2018',
          urgency: 'low',
          contact_method: 'phone',
          phoneNumber: '0509876543',
          additional_features: 'Sea view, balcony, gym access',
          estimated_value: '2100000',
          status: 'pending',
          created_at: '2024-05-21T15:30:00Z',
          completed_at: null,
          currency: 'AED'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Send Response button click handler
  const handleSendResponse = (valuation: Valuation) => {
    setSelectedValuation(valuation)
    setShowResponseModal(true)
    setResponseMessage('')
  }

  // Response submit handler
  const handleSubmitResponse = async () => {
    if (!selectedValuation || !responseMessage.trim()) return
    
    setSendingResponse(true)
    
    try {
      // 1. Save reply to valuation_responses collection
      const repliesRef = collection(db, 'valuation_responses')
      const replyData: ValuationReply = {
        valuation_id: selectedValuation.id,
        admin_id: adminUser.id,
        admin_name: adminUser.name,
        message: responseMessage.trim(),
        created_at: new Date().toISOString()
      }
      
      await addDoc(repliesRef, replyData)
      
      // 2. Update valuation status to 'completed'
      const valuationRef = doc(db, 'valuations', selectedValuation.id)
      await updateDoc(valuationRef, {
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      
      // 3. Update local state
      setValuations(prev => prev.map(v => 
        v.id === selectedValuation.id 
          ? { ...v, status: 'completed', completed_at: new Date().toISOString() }
          : v
      ))
      
      // 4. Reset and close modal
      setShowResponseModal(false)
      setResponseMessage('')
      setSelectedValuation(null)
      
      alert('Response sent successfully!')
      
    } catch (error) {
      console.error('Error sending response:', error)
      alert('Error sending response. Please try again.')
    } finally {
      setSendingResponse(false)
    }
  }

  // Eye icon click handler - Toggle details view
  const handleViewDetails = (valuationId: string) => {
    if (expandedValuations.includes(valuationId)) {
      // If already expanded, hide it
      setExpandedValuations(prev => prev.filter(id => id !== valuationId))
    } else {
      // If not expanded, show it
      setExpandedValuations(prev => [...prev, valuationId])
    }
  }

  // Check if valuation details are expanded
  const isValuationExpanded = (valuationId: string) => {
    return expandedValuations.includes(valuationId)
  }

  // Delete Valuation function
  const handleDeleteValuation = async (valuationId: string) => {
    if (window.confirm('Are you sure you want to delete this valuation?')) {
      try {
        // Implement delete functionality here
        // await deleteDoc(doc(db, 'valuations', valuationId))
        setValuations(prev => prev.filter(v => v.id !== valuationId))
        // Also remove from expanded list if it's expanded
        setExpandedValuations(prev => prev.filter(id => id !== valuationId))
        alert('Valuation deleted successfully!')
      } catch (error) {
        console.error('Error deleting valuation:', error)
        alert('Error deleting valuation. Please try again.')
      }
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Response Modal */}
      {showResponseModal && selectedValuation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Send Response</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-1">To: {selectedValuation.user_name}</p>
              <p className="text-sm text-gray-600">Email: {selectedValuation.user_email}</p>
              <p className="text-sm text-gray-600 mt-1">
                Property: {selectedValuation.property_type} in {selectedValuation.location}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Response *</label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Write your response here..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowResponseModal(false)
                  setSelectedValuation(null)
                }}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={!responseMessage.trim() || sendingResponse}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sendingResponse ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Response
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Valuations</h1>
          <p className="text-muted-foreground">Review and manage property valuation requests from users.</p>
        </div>
        <button 
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          onClick={fetchValuations}
        >
          <Download className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
          <p className="text-2xl font-bold">{valuations.length}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{valuations.filter(v => v.status === 'pending').length}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{valuations.filter(v => v.status === 'completed').length}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Avg. Valuation</p>
          <p className="text-2xl font-bold">AED {
            valuations.length > 0 
              ? (valuations.reduce((sum, v) => sum + parseInt(v.estimated_value || '0'), 0) / valuations.length).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
              : '0'
          }</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Property Details</th>
                <th className="px-6 py-4">Estimated Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading valuations...</p>
                  </td>
                </tr>
              ) : valuations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    No valuation requests found.
                  </td>
                </tr>
              ) : (
                valuations.map((v) => (
                  <>
                    <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{v.user_name || 'Unnamed User'}</p>
                          <p className="text-xs text-muted-foreground">{v.user_email}</p>
                          <p className="text-xs text-muted-foreground mt-1">{v.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs font-medium">
                            <Home className="h-3 w-3" /> {v.property_type}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {v.location}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {v.bedrooms} BR • {v.bathrooms} Bath • {v.size} sq.ft
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center font-semibold text-primary">
                          <DollarSign className="h-3 w-3" />
                          {parseInt(v.estimated_value || '0').toLocaleString()} {v.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {formatDate(v.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleViewDetails(v.id)}
                            className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                            title={isValuationExpanded(v.id) ? "Hide Details" : "View Details"}
                          >
                            {isValuationExpanded(v.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleSendResponse(v)}
                            className="p-2 hover:bg-green-50 rounded-md transition-colors text-green-600 hover:text-green-700 hover:bg-green-100"
                            title="Send Response"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {isValuationExpanded(v.id) && (
                      <tr key={`${v.id}-details`} className="bg-muted/20 border-t">
                        <td colSpan={6} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3 text-primary flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Property Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Type:</span>
                                  <span className="font-medium">{v.property_type}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Location:</span>
                                  <span className="font-medium">{v.location}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Size:</span>
                                  <span className="font-medium">{v.size} sq.ft</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Bedrooms:</span>
                                  <span className="font-medium">{v.bedrooms}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Bathrooms:</span>
                                  <span className="font-medium">{v.bathrooms}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Year Built:</span>
                                  <span className="font-medium">{v.year_built}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Condition:</span>
                                  <span className="font-medium capitalize">{v.condition}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Urgency:</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    v.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                    v.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {v.urgency}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3 text-primary flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Customer Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Name:</span>
                                  <span className="font-medium">{v.user_name || 'N/A'}</span>
                                </div>
                               
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Phone:</span>
                                  <span className="font-medium">{v.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Contact Method:</span>
                                  <span className="font-medium capitalize">{v.contact_method}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Requested Date:</span>
                                  <span className="font-medium">{formatDate(v.created_at)}</span>
                                </div>
                                {v.completed_at && (
                                  <div className="flex justify-between py-1 border-b border-gray-100">
                                    <span className="text-muted-foreground">Completed Date:</span>
                                    <span className="font-medium">{formatDate(v.completed_at)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(v.status)}`}>
                                    {v.status}
                                  </span>
                                </div>
                              </div>
                              
                              {v.additional_features && (
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2 text-primary">Additional Features</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded-lg border">
                                    {v.additional_features}
                                  </p>
                                </div>
                              )}
                              
                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={() => handleSendResponse(v)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Send Response
                                </button>
                                <button
                                  onClick={() => handleViewDetails(v.id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 border text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                  Hide Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}