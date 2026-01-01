// 'use client'

// import { useState, useEffect } from 'react'
// import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

// interface Agent {
//   id: string
//   title: string
//   office?: string
//   license_no?: string
//   brokerage: string
//   bio?: string
//   whatsapp?: string
//   profile_image?: string
//   approved: boolean
//   verified: boolean
//   rating: number
//   review_count: number
//   experience_years: number
//   created_at: string
// }

// export default function Agents() {
//   const [agents, setAgents] = useState<Agent[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filterApproved, setFilterApproved] = useState<'all' | 'approved' | 'pending'>('all')

//   const [formData, setFormData] = useState({
//     title: '',
//     office: '',
//     license_no: '',
//     brokerage: 'Global Property Solutions',
//     bio: '',
//     whatsapp: '',
//     telegram: '',
//     linkedin_url: '',
//     instagram_handle: '',
//     website_url: '',
//     profile_image: '',
//     approved: false,
//     rating: 4.5,
//     review_count: 0,
//     total_sales: 0,
//     commission_rate: 2.5,
//     experience_years: 5,
//     languages: ['English', 'Arabic'],
//     certifications: ['RERA Certified'],
//     verified: false,
//     specializations: ['Residential Properties']
//   })

//   // Load agents
//   useEffect(() => {
//     loadAgents()
//   }, [])

//   const loadAgents = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('/api/admin/agents?limit=100')
//       const data = await response.json()
//       setAgents(data.agents || [])
//     } catch (error) {
//       console.error('Error loading agents:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddAgent = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch('/api/admin/agents', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setAgents([data.agent, ...agents])
//         setShowAddModal(false)
//         resetForm()
//       }
//     } catch (error) {
//       console.error('Error adding agent:', error)
//     }
//   }

//   const handleUpdateAgent = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!editingAgent) return

//     try {
//       const response = await fetch(`/api/admin/agents/${editingAgent.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setAgents(agents.map(a => a.id === editingAgent.id ? data.agent : a))
//         setEditingAgent(null)
//         setShowAddModal(false)
//       }
//     } catch (error) {
//       console.error('Error updating agent:', error)
//     }
//   }

//   const handleDeleteAgent = async (agentId: string) => {
//     if (!confirm('Are you sure you want to delete this agent?')) return

//     try {
//       const response = await fetch(`/api/admin/agents/${agentId}`, {
//         method: 'DELETE'
//       })

//       if (response.ok) {
//         setAgents(agents.filter(a => a.id !== agentId))
//       }
//     } catch (error) {
//       console.error('Error deleting agent:', error)
//     }
//   }

//   const handleToggleApproval = async (agent: Agent) => {
//     try {
//       const response = await fetch(`/api/admin/agents/${agent.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...agent,
//           approved: !agent.approved
//         })
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setAgents(agents.map(a => a.id === agent.id ? data.agent : a))
//       }
//     } catch (error) {
//       console.error('Error toggling approval:', error)
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       office: '',
//       license_no: '',
//       brokerage: 'Global Property Solutions',
//       bio: '',
//       whatsapp: '',
//       telegram: '',
//       linkedin_url: '',
//       instagram_handle: '',
//       website_url: '',
//       profile_image: '',
//       approved: false,
//       rating: 4.5,
//       review_count: 0,
//       total_sales: 0,
//       commission_rate: 2.5,
//       experience_years: 5,
//       languages: ['English', 'Arabic'],
//       certifications: ['RERA Certified'],
//       verified: false,
//       specializations: ['Residential Properties']
//     })
//   }

//   const filteredAgents = agents.filter(agent => {
//     const matchesSearch = agent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          agent.brokerage.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesFilter = filterApproved === 'all' || 
//                          (filterApproved === 'approved' && agent.approved) ||
//                          (filterApproved === 'pending' && !agent.approved)
//     return matchesSearch && matchesFilter
//   })

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Agent Management</h2>
//           <p className="text-gray-500 text-sm mt-1">Manage and verify real estate agents on the platform</p>
//         </div>
//         <button
//           onClick={() => {
//             setEditingAgent(null)
//             resetForm()
//             setShowAddModal(true)
//           }}
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Add Agent
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search agents by name or brokerage..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//           <select
//             value={filterApproved}
//             onChange={(e) => setFilterApproved(e.target.value as any)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           >
//             <option value="all">All Status</option>
//             <option value="approved">Approved Only</option>
//             <option value="pending">Pending Approval</option>
//           </select>
//         </div>
//       </div>

//       {/* Agents Table */}
//       <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-500">Loading agents...</p>
//           </div>
//         ) : filteredAgents.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             No agents found matching your criteria
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brokerage</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredAgents.map((agent) => (
//                   <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           {agent.profile_image ? (
//                             <img
//                               src={agent.profile_image}
//                               alt={agent.title}
//                               className="h-10 w-10 rounded-full object-cover"
//                             />
//                           ) : (
//                             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
//                               {agent.title.charAt(0)}
//                             </div>
//                           )}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{agent.title}</div>
//                           <div className="text-xs text-gray-500">{agent.whatsapp}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{agent.brokerage}</div>
//                       {agent.office && <div className="text-xs text-gray-500">{agent.office}</div>}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center text-sm text-gray-900">
//                         <span className="text-yellow-400 mr-1">★</span>
//                         {agent.rating} <span className="text-gray-400 ml-1">({agent.review_count})</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {agent.experience_years} years
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         agent.approved
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {agent.approved ? 'Approved' : 'Pending'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           onClick={() => handleToggleApproval(agent)}
//                           title={agent.approved ? 'Reject' : 'Approve'}
//                           className={`p-1 rounded hover:bg-gray-100 ${agent.approved ? 'text-red-600' : 'text-green-600'}`}
//                         >
//                           {agent.approved ? <XMarkIcon className="h-5 w-5" /> : <CheckIcon className="h-5 w-5" />}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setEditingAgent(agent)
//                             setFormData(agent as any)
//                             setShowAddModal(true)
//                           }}
//                           className="p-1 text-blue-600 hover:bg-gray-100 rounded"
//                         >
//                           <PencilIcon className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteAgent(agent.id)}
//                           className="p-1 text-red-600 hover:bg-gray-100 rounded"
//                         >
//                           <TrashIcon className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
//               <h2 className="text-xl font-bold text-gray-900">
//                 {editingAgent ? 'Edit Agent Profile' : 'Add New Agent'}
//               </h2>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>

//             <form onSubmit={editingAgent ? handleUpdateAgent : handleAddAgent} className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Agent Name/Title</label>
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Brokerage Name</label>
//                   <input
//                     type="text"
//                     value={formData.brokerage}
//                     onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Office Location</label>
//                   <input
//                     type="text"
//                     value={formData.office}
//                     onChange={(e) => setFormData({ ...formData, office: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">License Number (RERA)</label>
//                   <input
//                     type="text"
//                     value={formData.license_no}
//                     onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
//                   <input
//                     type="tel"
//                     value={formData.whatsapp}
//                     onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Profile Image URL</label>
//                   <input
//                     type="url"
//                     value={formData.profile_image}
//                     onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Experience (Years)</label>
//                   <input
//                     type="number"
//                     value={formData.experience_years}
//                     onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Initial Rating</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     min="0"
//                     max="5"
//                     value={formData.rating}
//                     onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Agent Bio</label>
//                 <textarea
//                   value={formData.bio}
//                   onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   rows={3}
//                 />
//               </div>

//               <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.approved}
//                     onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
//                     className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm font-medium text-gray-700">Approved</span>
//                 </label>
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.verified}
//                     onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
//                     className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm font-medium text-gray-700">Verified Badge</span>
//                 </label>
//               </div>

//               <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//                 >
//                   {editingAgent ? 'Update Agent' : 'Create Agent'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// new code
'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@/lib/firebase'

interface Agent {
  id: string
  title: string
  office?: string
  license_no?: string
  brokerage: string
  bio?: string
  whatsapp?: string
  telegram?: string
  linkedin_url?: string
  instagram_handle?: string
  website_url?: string
  profile_image?: string
  approved: boolean
  verified: boolean
  rating: number
  review_count: number
  total_sales?: number
  commission_rate?: number
  experience_years: number
  languages?: string[]
  certifications?: string[]
  specializations?: string[]
  created_at?: string
  updated_at?: string
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterApproved, setFilterApproved] = useState<'all' | 'approved' | 'pending'>('all')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    office: '',
    license_no: '',
    brokerage: 'Global Property Solutions',
    bio: '',
    whatsapp: '',
    telegram: '',
    linkedin_url: '',
    instagram_handle: '',
    website_url: '',
    profile_image: '',
    approved: false,
    rating: 4.5,
    review_count: 0,
    total_sales: 0,
    commission_rate: 2.5,
    experience_years: 5,
    languages: ['English', 'Arabic'],
    certifications: ['RERA Certified'],
    verified: false,
    specializations: ['Residential Properties']
  })

  // Load agents from Firebase
  const loadAgents = async () => {
    try {
      setLoading(true)
      const agentsCollection = collection(db, "agents")
      const agentSnapshot = await getDocs(agentsCollection)
      
      const agentsList: Agent[] = []
      agentSnapshot.forEach((doc) => {
        const data = doc.data()
        agentsList.push({ 
          id: doc.id, 
          ...data,
          rating: data.rating || 4.5,
          review_count: data.review_count || 0,
          experience_years: data.experience_years || 5,
          approved: data.approved || false,
          verified: data.verified || false,
          languages: data.languages || ['English'],
          certifications: data.certifications || [],
          specializations: data.specializations || []
        } as Agent)
      })
      
      // Sort by creation date (newest first)
      agentsList.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )
      
      setAgents(agentsList)
    } catch (error) {
      console.error('Error loading agents:', error)
      alert('Failed to load agents from Firebase.')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadAgents()
  }, [])

  // ADD AGENT TO FIREBASE
  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Prepare agent data
      const agentData = {
        title: formData.title.trim(),
        office: formData.office.trim() || null,
        license_no: formData.license_no.trim() || null,
        brokerage: formData.brokerage.trim(),
        bio: formData.bio.trim() || null,
        whatsapp: formData.whatsapp.trim() || null,
        telegram: formData.telegram.trim() || null,
        linkedin_url: formData.linkedin_url.trim() || null,
        instagram_handle: formData.instagram_handle.trim() || null,
        website_url: formData.website_url.trim() || null,
        profile_image: formData.profile_image.trim() || null,
        approved: formData.approved,
        verified: formData.verified,
        rating: formData.rating,
        review_count: formData.review_count,
        total_sales: formData.total_sales || 0,
        commission_rate: formData.commission_rate || 2.5,
        experience_years: formData.experience_years,
        languages: formData.languages || ['English'],
        certifications: formData.certifications || [],
        specializations: formData.specializations || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Add to Firebase
      const docRef = await addDoc(collection(db, "agents"), agentData)
      
      console.log('Agent created with ID:', docRef.id)
      
      // Update local state
      const newAgent = {
        id: docRef.id,
        ...agentData
      } as Agent
      
      setAgents([newAgent, ...agents])
      
      // Close modal and reset
      setShowAddModal(false)
      resetForm()
      
      alert('Agent created successfully in Firebase!')
      
    } catch (error: any) {
      console.error('Error adding agent:', error)
      
      let errorMessage = 'Error adding agent. Please try again.'
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check Firebase rules.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // UPDATE AGENT IN FIREBASE
  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAgent) return
    
    setIsSubmitting(true)
    
    try {
      // Prepare update data
      const updateData = {
        title: formData.title.trim(),
        office: formData.office.trim() || null,
        license_no: formData.license_no.trim() || null,
        brokerage: formData.brokerage.trim(),
        bio: formData.bio.trim() || null,
        whatsapp: formData.whatsapp.trim() || null,
        telegram: formData.telegram.trim() || null,
        linkedin_url: formData.linkedin_url.trim() || null,
        instagram_handle: formData.instagram_handle.trim() || null,
        website_url: formData.website_url.trim() || null,
        profile_image: formData.profile_image.trim() || null,
        approved: formData.approved,
        verified: formData.verified,
        rating: formData.rating,
        review_count: formData.review_count,
        total_sales: formData.total_sales || 0,
        commission_rate: formData.commission_rate || 2.5,
        experience_years: formData.experience_years,
        languages: formData.languages || ['English'],
        certifications: formData.certifications || [],
        specializations: formData.specializations || [],
        updated_at: new Date().toISOString()
      }

      // Update in Firebase
      const agentRef = doc(db, "agents", editingAgent.id)
      await updateDoc(agentRef, updateData)
      
      console.log('Agent updated:', editingAgent.id)
      
      // Update local state
      const updatedAgent = {
        ...editingAgent,
        ...updateData
      }
      
      setAgents(agents.map(a => a.id === editingAgent.id ? updatedAgent as Agent : a))
      
      // Close modal and reset
      setEditingAgent(null)
      setShowAddModal(false)
      resetForm()
      
      alert('Agent updated successfully in Firebase!')
      
    } catch (error: any) {
      console.error('Error updating agent:', error)
      
      let errorMessage = 'Error updating agent. Please try again.'
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check Firebase rules.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // DELETE AGENT FROM FIREBASE
  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return

    try {
      // Delete from Firebase
      const agentRef = doc(db, "agents", agentId)
      await deleteDoc(agentRef)
      
      // Update local state
      setAgents(agents.filter(a => a.id !== agentId))
      
      alert('Agent deleted successfully from Firebase!')
      
    } catch (error: any) {
      console.error('Error deleting agent:', error)
      
      if (error.code === 'permission-denied') {
        alert('Delete permission denied. Please check Firebase rules.')
      } else {
        alert('Error deleting agent. Please try again.')
      }
    }
  }

  // TOGGLE APPROVAL IN FIREBASE
  const handleToggleApproval = async (agent: Agent) => {
    try {
      // Toggle approval status
      const newApprovedStatus = !agent.approved
      
      // Update in Firebase
      const agentRef = doc(db, "agents", agent.id)
      await updateDoc(agentRef, {
        approved: newApprovedStatus,
        updated_at: new Date().toISOString()
      })
      
      // Update local state
      const updatedAgent = {
        ...agent,
        approved: newApprovedStatus
      }
      
      setAgents(agents.map(a => a.id === agent.id ? updatedAgent : a))
      
      alert(`Agent ${newApprovedStatus ? 'approved' : 'unapproved'} successfully!`)
      
    } catch (error: any) {
      console.error('Error toggling approval:', error)
      
      if (error.code === 'permission-denied') {
        alert('Permission denied. Please check Firebase rules.')
      } else {
        alert('Error updating approval status. Please try again.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      office: '',
      license_no: '',
      brokerage: 'Global Property Solutions',
      bio: '',
      whatsapp: '',
      telegram: '',
      linkedin_url: '',
      instagram_handle: '',
      website_url: '',
      profile_image: '',
      approved: false,
      rating: 4.5,
      review_count: 0,
      total_sales: 0,
      commission_rate: 2.5,
      experience_years: 5,
      languages: ['English', 'Arabic'],
      certifications: ['RERA Certified'],
      verified: false,
      specializations: ['Residential Properties']
    })
  }

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.brokerage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterApproved === 'all' || 
                         (filterApproved === 'approved' && agent.approved) ||
                         (filterApproved === 'pending' && !agent.approved)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agent Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and verify real estate agents on the platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadAgents}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
          >
            Refresh Agents
          </button>
          <button
            onClick={() => {
              setEditingAgent(null)
              resetForm()
              setShowAddModal(true)
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Agent
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
          <p className="text-sm text-gray-500">Total Agents</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{agents.filter(a => a.approved).length}</p>
          <p className="text-sm text-gray-500">Approved Agents</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{agents.filter(a => a.verified).length}</p>
          <p className="text-sm text-gray-500">Verified Agents</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents by name or brokerage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterApproved}
            onChange={(e) => setFilterApproved(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved Only</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading agents from Firebase...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No agents found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brokerage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {agent.profile_image ? (
                            <img
                              src={agent.profile_image}
                              alt={agent.title}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                              {agent.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agent.title}</div>
                          <div className="text-xs text-gray-500">{agent.whatsapp || 'No WhatsApp'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.brokerage}</div>
                      {agent.office && <div className="text-xs text-gray-500">{agent.office}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <span className="text-yellow-400 mr-1">★</span>
                        {agent.rating} <span className="text-gray-400 ml-1">({agent.review_count})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.experience_years} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          agent.approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {agent.approved ? 'Approved' : 'Pending'}
                        </span>
                        {agent.verified && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleApproval(agent)}
                          title={agent.approved ? 'Reject' : 'Approve'}
                          className={`p-1 rounded hover:bg-gray-100 ${agent.approved ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {agent.approved ? <XMarkIcon className="h-5 w-5" /> : <CheckIcon className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingAgent(agent)
                            setFormData({
                              title: agent.title || '',
                              office: agent.office || '',
                              license_no: agent.license_no || '',
                              brokerage: agent.brokerage || 'Global Property Solutions',
                              bio: agent.bio || '',
                              whatsapp: agent.whatsapp || '',
                              telegram: agent.telegram || '',
                              linkedin_url: agent.linkedin_url || '',
                              instagram_handle: agent.instagram_handle || '',
                              website_url: agent.website_url || '',
                              profile_image: agent.profile_image || '',
                              approved: agent.approved || false,
                              rating: agent.rating || 4.5,
                              review_count: agent.review_count || 0,
                              total_sales: agent.total_sales || 0,
                              commission_rate: agent.commission_rate || 2.5,
                              experience_years: agent.experience_years || 5,
                              languages: agent.languages || ['English'],
                              certifications: agent.certifications || ['RERA Certified'],
                              verified: agent.verified || false,
                              specializations: agent.specializations || ['Residential Properties']
                            })
                            setShowAddModal(true)
                          }}
                          className="p-1 text-blue-600 hover:bg-gray-100 rounded"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="p-1 text-red-600 hover:bg-gray-100 rounded"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAgent ? 'Edit Agent Profile' : 'Add New Agent'}
                <span className="text-sm text-gray-500 ml-2">(Firebase)</span>
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingAgent(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={editingAgent ? handleUpdateAgent : handleAddAgent} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Agent Name/Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Brokerage Name *</label>
                  <input
                    type="text"
                    value={formData.brokerage}
                    onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Office Location</label>
                  <input
                    type="text"
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">License Number (RERA)</label>
                  <input
                    type="text"
                    value={formData.license_no}
                    onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Profile Image URL</label>
                  <input
                    type="url"
                    value={formData.profile_image}
                    onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Telegram</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Instagram Handle</label>
                  <input
                    type="text"
                    value={formData.instagram_handle}
                    onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Website URL</label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Initial Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Total Sales</label>
                  <input
                    type="number"
                    value={formData.total_sales}
                    onChange={(e) => setFormData({ ...formData, total_sales: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Agent Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.approved}
                    onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Approved</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Verified Badge</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingAgent(null)
                    resetForm()
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {editingAgent ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingAgent ? 'Update Agent' : 'Create Agent'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}