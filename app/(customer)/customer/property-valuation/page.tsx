'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  
} from '@heroicons/react/24/outline'
import { MessageCircleIcon,AlertCircleIcon } from 'lucide-react'
import { db } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore'

interface Valuation {
  id: string
  user_name: string
  userEmail: string
  phoneNumber: string
  property_type: string
  location: string
  size: string
  bedrooms: string
  bathrooms: string
  year_built: string
  condition: string
  additional_features: string
  urgency: string
  contact_method: string
  status: string
  estimated_value?: string
  currency?: string
  created_at: string
  completed_at?: string
}

interface ValuationResponse {
  id: string
  valuation_id: string
  admin_id: string
  admin_name: string
  message: string
  created_at: string
}

export default function PropertyValuation() {
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('history')
  const [valuations, setValuations] = useState<Valuation[]>([])
  const [valuationResponses, setValuationResponses] = useState<ValuationResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingValuations, setLoadingValuations] = useState(true)
  const [loadingResponses, setLoadingResponses] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    propertyType: '',
    location: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    condition: '',
    additionalFeatures: '',
    urgency: '',
    contactMethod: 'email',
    phoneNumber: ''
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { user } = useAuth()
  const router = useRouter()

  // Fetch valuations from Firebase
  useEffect(() => {
    const fetchValuations = async () => {
      try {
        if (!user?.email) {
          setLoadingValuations(false)
          return
        }
        
        const valuationsRef = collection(db, 'valuations')
        const q = query(
          valuationsRef, 
          where('userEmail', '==', user.email)
        )
        
        const querySnapshot = await getDocs(q)
        const valuationsData = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            user_name: data.user_name || '',
            userEmail: data.userEmail || '',
            phoneNumber: data.phoneNumber || '',
            property_type: data.property_type || '',
            location: data.location || '',
            size: data.size || '',
            bedrooms: data.bedrooms || '',
            bathrooms: data.bathrooms || '',
            year_built: data.year_built || '',
            condition: data.condition || '',
            additional_features: data.additional_features || '',
            urgency: data.urgency || '',
            contact_method: data.contact_method || '',
            status: data.status || 'pending',
            estimated_value: data.estimated_value || '',
            currency: data.currency || 'AED',
            created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString(),
            completed_at: data.completed_at ? new Date(data.completed_at).toISOString() : undefined
          }
        }) as Valuation[]
        
        // Sort manually in JavaScript
        valuationsData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        
        setValuations(valuationsData)
        
        // Fetch responses after valuations are loaded
        fetchValuationResponses(valuationsData.map(v => v.id))
      } catch (error) {
        console.error('Error fetching valuations:', error)
        setError('Failed to load valuations. Please try again.')
      } finally {
        setLoadingValuations(false)
      }
    }

    if (user) {
      fetchValuations()
    } else {
      setLoadingValuations(false)
    }
  }, [user])

  // Fetch valuation responses from Firebase
  const fetchValuationResponses = async (valuationIds: string[]) => {
    if (valuationIds.length === 0) {
      setValuationResponses([])
      return
    }

    try {
      setLoadingResponses(true)
      const responsesRef = collection(db, 'valuation_responses')
      
      // Fetch all responses and filter client-side
      const q = query(responsesRef)
      const querySnapshot = await getDocs(q)
      
      const responsesData: ValuationResponse[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const response = {
          id: doc.id,
          valuation_id: data.valuation_id || '',
          admin_id: data.admin_id || '',
          admin_name: data.admin_name || 'Admin',
          message: data.message || '',
          created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString()
        }
        
        // Only include responses for this user's valuations
        if (valuationIds.includes(response.valuation_id)) {
          responsesData.push(response)
        }
      })
      
      // Sort by date (newest first)
      responsesData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setValuationResponses(responsesData)
    } catch (error) {
      console.error('Error fetching valuation responses:', error)
    } finally {
      setLoadingResponses(false)
    }
  }

  // Get responses for a specific valuation
  const getResponsesForValuation = (valuationId: string) => {
    return valuationResponses
      .filter(response => response.valuation_id === valuationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user?.email) {
      router.push('/customer/login')
      return
    }

    try {
      const valuationsRef = collection(db, 'valuations')
      const newValuation = {
        user_name: formData.name.trim(),
        userEmail: user.email,
        phoneNumber: formData.phoneNumber,
        property_type: formData.propertyType,
        location: formData.location,
        size: formData.size,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        year_built: formData.yearBuilt,
        condition: formData.condition,
        additional_features: formData.additionalFeatures,
        urgency: formData.urgency,
        contact_method: formData.contactMethod,
        status: 'pending',
        estimated_value: '',
        currency: 'AED',
        created_at: new Date().toISOString()
      }

      const docRef = await addDoc(valuationsRef, newValuation)
      
      setSuccess(true)
      setFormData({
        name: '',
        propertyType: '',
        location: '',
        size: '',
        bedrooms: '',
        bathrooms: '',
        yearBuilt: '',
        condition: '',
        additionalFeatures: '',
        urgency: '',
        contactMethod: 'email',
        phoneNumber: ''
      })
      
      // Add new valuation to state
      setValuations(prev => [{ 
        id: docRef.id, 
        ...newValuation 
      }, ...prev])
      setActiveTab('history')
    } catch (err: any) {
      if (err.code === 'permission-denied') {
        setError('Permission denied. Please check Firebase security rules.')
      } else {
        setError('Failed to submit valuation request. Please try again.')
      }
      console.error('Error submitting valuation:', err)
    }

    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in_progress':
        return 'In Progress'
      default:
        return 'Pending'
    }
  }

  const formatCurrency = (value: string, currency: string = 'AED') => {
    const numValue = parseInt(value) || 0
    return numValue.toLocaleString('en-US') + ' ' + currency
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate pending valuations count
  const getPendingValuationsCount = () => {
    return valuations.filter(v => v.status === 'pending').length
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-serif text-secondary">Valuation Request Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your property valuation request has been successfully submitted.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                setActiveTab('history')
              }}
              className="mt-6 w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
            >
              View My Valuations
            </button>
            <button
              onClick={() => {
                setSuccess(false)
                setActiveTab('request')
              }}
              className="mt-4 w-full py-3 px-4 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              Request Another Valuation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="text-slate-400 hover:text-slate-600 mr-4"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-serif text-secondary">Property Valuations</h1>
                <p className="text-sm text-slate-500">Request and track property valuations</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Logged in as: <span className="font-bold text-primary">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>



      {/* Stats Summary */}
<div className='flex justify-center'>
  {activeTab === 'history' && valuations.length > 0 && (
    <div className="mt-8 w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Total Valuations */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-base font-medium text-slate-600">Total Valuations</p>
            <p className="text-4xl font-bold text-secondary">{valuations.length}</p>
            <p className="text-xs text-slate-400">All property valuations</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl">
            <DocumentTextIcon className="h-10 w-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-base font-medium text-slate-600">Completed</p>
            <p className="text-4xl font-bold text-green-600">
              {valuations.filter(v => v.status === 'completed').length}
            </p>
            <p className="text-xs text-slate-400">Valuations finished</p>
          </div>
          <div className="p-4 bg-green-50 rounded-2xl">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>
        </div>
      </div>

      

      {/* Pending */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-base font-medium text-slate-600">Pending</p>
            <p className="text-4xl font-bold text-yellow-600">
              {getPendingValuationsCount()}
            </p>
            <p className="text-xs text-slate-400">Awaiting review</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-2xl">
            <AlertCircleIcon className="h-10 w-10 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  )}
</div>
      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'history'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                My Valuations
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'request'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Request New Valuation
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'history' ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-serif text-secondary">Valuation History</h2>
                  <button
                    onClick={() => setActiveTab('request')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                    New Valuation
                  </button>
                </div>

                {loadingValuations ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-slate-200 rounded-2xl"></div>
                      </div>
                    ))}
                  </div>
                ) : valuations.length > 0 ? (
                  <div className="space-y-6">
                    {valuations.map((valuation) => {
                      const responses = getResponsesForValuation(valuation.id)
                      const hasResponses = responses.length > 0
                      
                      return (
                        <div key={valuation.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-primary/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              {getStatusIcon(valuation.status)}
                              <div>
                                <h3 className="font-bold text-secondary capitalize">
                                  {valuation.property_type || 'Property'} in {valuation.location || 'Unknown Location'}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-slate-600">
                                  <UserIcon className="h-3 w-3" />
                                  {valuation.user_name || 'N/A'}
                                </div>
                                <p className="text-sm text-slate-500">
                                  {valuation.size ? `${valuation.size} sqm • ` : ''}
                                  {valuation.bedrooms ? `${valuation.bedrooms} bed • ` : ''}
                                  {valuation.bathrooms ? `${valuation.bathrooms} bath` : ''}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  Requested on: {formatDate(valuation.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                                valuation.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : valuation.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {getStatusText(valuation.status)}
                              </div>
                              {hasResponses && (
                                <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                                  <MessageCircleIcon className="h-3 w-3" />
                                  {responses.length} {responses.length === 1 ? 'response' : 'responses'}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Phone number display */}
                          {valuation.phoneNumber && (
                            <div className="mb-4 flex items-center gap-2 text-sm bg-slate-100 rounded-lg p-3">
                              <PhoneIcon className="h-4 w-4 text-slate-600" />
                              <span className="text-slate-700">Phone:</span>
                              <span className="font-medium">{valuation.phoneNumber}</span>
                            </div>
                          )}

                          {valuation.status === 'completed' && valuation.estimated_value && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                <span className="font-bold text-green-800">Valuation Complete</span>
                              </div>
                              <div className="text-2xl font-serif text-green-800">
                                {formatCurrency(valuation.estimated_value, valuation.currency)}
                              </div>
                              <div className="text-sm text-green-600 mt-1">
                                Completed on {valuation.completed_at 
                                  ? new Date(valuation.completed_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : 'N/A'}
                              </div>
                              <div className="mt-2 text-sm text-green-700">
                                Contact method: {valuation.contact_method || 'Email'}
                              </div>
                            </div>
                          )}

                          {valuation.status === 'in_progress' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                              <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-blue-600" />
                                <span className="font-bold text-blue-800">Valuation in Progress</span>
                              </div>
                              <p className="text-sm text-blue-600 mt-1">
                                Our experts are analyzing your property details. We'll contact you via {valuation.contact_method || 'email'} within 24 hours.
                              </p>
                              <div className="mt-2 text-xs text-blue-500">
                                Urgency: {valuation.urgency || 'Medium'}
                              </div>
                            </div>
                          )}

                          {valuation.status === 'pending' && (
                            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 mb-4">
                              <div className="flex items-center gap-2">
                                <DocumentTextIcon className="h-5 w-5 text-slate-600" />
                                <span className="font-bold text-slate-800">Pending Review</span>
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                Your valuation request is in queue. Our team will review it shortly.
                              </p>
                              <div className="mt-2 text-xs text-slate-500">
                                Condition: {valuation.condition || 'Not specified'}
                              </div>
                            </div>
                          )}

                          {/* Admin Responses Section */}
                          {hasResponses && (
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageCircleIcon className="h-5 w-5 text-blue-500" />
                                <h4 className="font-bold text-secondary">Admin Responses</h4>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {responses.length} {responses.length === 1 ? 'response' : 'responses'}
                                </span>
                              </div>
                              
                              <div className="space-y-3">
                                {responses.map((response) => (
                                  <div key={response.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                          <UserIcon className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-blue-800">
                                          {response.admin_name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-blue-600">
                                        <CalendarIcon className="h-3 w-3" />
                                        {formatDate(response.created_at)}
                                      </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                                      <p className="text-sm text-gray-700">
                                        {response.message}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Additional Details */}
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Year Built:</span>
                              <div className="font-medium">{valuation.year_built || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-500">Condition:</span>
                              <div className="font-medium capitalize">{valuation.condition || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-500">Urgency:</span>
                              <div className="font-medium capitalize">{valuation.urgency || 'Medium'}</div>
                            </div>
                            <div>
                              <span className="text-slate-500">Contact:</span>
                              <div className="font-medium capitalize">{valuation.contact_method || 'Email'}</div>
                            </div>
                          </div>

                          {valuation.additional_features && (
                            <div className="mt-4">
                              <span className="text-sm text-slate-500">Additional Features:</span>
                              <p className="text-sm mt-1">{valuation.additional_features}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ChartBarIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-secondary mb-2">No valuations yet</h3>
                    <p className="text-slate-500 mb-6">Get started by requesting your first property valuation.</p>
                    <button
                      onClick={() => setActiveTab('request')}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all"
                    >
                      Request Your First Valuation
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-serif text-secondary mb-2">Request Property Valuation</h2>
                  <p className="text-slate-500">Get an accurate market valuation for your property</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Please provide your name for identification
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Property Type *
                      </label>
                      <select
                        name="propertyType"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select type</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="studio">Studio</option>
                        <option value="duplex">Duplex</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Location/Area *
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g., Dubai Marina, Jumeirah, Downtown Dubai"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Size (sqm)
                      </label>
                      <input
                        type="number"
                        name="size"
                        min="0"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g., 120"
                        value={formData.size}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Bedrooms
                      </label>
                      <select
                        name="bedrooms"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="0">Studio</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5">5+ Bedrooms</option>
                      </select>
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Bathrooms
                      </label>
                      <select
                        name="bathrooms"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4 Bathrooms</option>
                        <option value="5">5+ Bathrooms</option>
                      </select>
                    </div>

                    {/* Year Built */}
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Year Built
                      </label>
                      <input
                        type="number"
                        name="yearBuilt"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder={`e.g., ${new Date().getFullYear() - 5}`}
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Property Condition */}
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Property Condition
                    </label>
                    <select
                      name="condition"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.condition}
                      onChange={handleInputChange}
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent - Like new</option>
                      <option value="good">Good - Well maintained</option>
                      <option value="fair">Fair - Needs minor repairs</option>
                      <option value="needs_work">Needs Work - Requires renovation</option>
                      <option value="off_plan">Off Plan - Under construction</option>
                    </select>
                  </div>

                  {/* Additional Features */}
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Additional Features & Amenities
                    </label>
                    <textarea
                      name="additionalFeatures"
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g., Balcony, covered parking, gym, pool, garden, security, concierge, etc."
                      value={formData.additionalFeatures}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      List any special features or amenities that add value to your property
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Urgency Level */}
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Urgency Level
                      </label>
                      <select
                        name="urgency"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.urgency}
                        onChange={handleInputChange}
                      >
                        <option value="">Select urgency</option>
                        <option value="low">Low - Just curious about value</option>
                        <option value="medium">Medium - Planning to sell/buy soon</option>
                        <option value="high">High - Need valuation urgently (within 24 hours)</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        className="w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g., +971 50 123 4567"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Optional: Provide your phone number for faster contact
                    </p>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="px-8 py-3 border border-slate-200 text-secondary font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5" />
                          Request Valuation
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  )
}