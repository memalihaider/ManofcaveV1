// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   MessageSquare, Search, Filter, CheckCircle, 
//   Clock, AlertCircle, Reply, Trash2, ExternalLink
// } from 'lucide-react'

// interface Question {
//   id: string
//   user_name: string
//   user_email: string
//   property_title?: string
//   question_text: string
//   status: 'pending' | 'answered' | 'archived'
//   created_at: string
// }

// export default function QuestionsPage() {
//   const [questions, setQuestions] = useState<Question[]>([])
//   const [loading, setLoading] = useState(true)
//   const [statusFilter, setStatusFilter] = useState('all')

//   useEffect(() => {
//     fetchQuestions()
//   }, [])

//   const fetchQuestions = async () => {
//     try {
//       const response = await fetch('/api/admin/questions')
//       const data = await response.json()
//       setQuestions(data.questions || [])
//     } catch (error) {
//       console.error('Error fetching questions:', error)
//       // Mock data
//       setQuestions([
//         { 
//           id: '1', 
//           user_name: 'Alice Smith', 
//           user_email: 'alice@example.com', 
//           property_title: 'Luxury Villa in Palm Jumeirah',
//           question_text: 'Is the price negotiable for a cash buyer?',
//           status: 'pending',
//           created_at: '2024-05-20T10:30:00Z'
//         },
//         { 
//           id: '2', 
//           user_name: 'Bob Johnson', 
//           user_email: 'bob@example.com', 
//           property_title: 'Modern Apartment in Downtown',
//           question_text: 'What are the monthly service charges for this unit?',
//           status: 'answered',
//           created_at: '2024-05-19T14:20:00Z'
//         },
//         { 
//           id: '3', 
//           user_name: 'Charlie Brown', 
//           user_email: 'charlie@example.com', 
//           question_text: 'Do you offer property management services for international investors?',
//           status: 'pending',
//           created_at: '2024-05-21T09:15:00Z'
//         }
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredQuestions = questions.filter(q => 
//     statusFilter === 'all' || q.status === statusFilter
//   )

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Customer Questions</h1>
//           <p className="text-muted-foreground">Manage and respond to inquiries from potential buyers.</p>
//         </div>
//         <div className="flex gap-2">
//           <button className="inline-flex items-center px-4 py-2 rounded-md border bg-background hover:bg-accent transition-colors text-sm font-medium">
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Stats Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
//           <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//             <MessageSquare className="h-5 w-5" />
//           </div>
//           <div>
//             <p className="text-sm text-muted-foreground">Total Questions</p>
//             <p className="text-2xl font-bold">{questions.length}</p>
//           </div>
//         </div>
//         <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
//           <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
//             <Clock className="h-5 w-5" />
//           </div>
//           <div>
//             <p className="text-sm text-muted-foreground">Pending Response</p>
//             <p className="text-2xl font-bold">{questions.filter(q => q.status === 'pending').length}</p>
//           </div>
//         </div>
//         <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
//           <div className="p-3 rounded-full bg-green-100 text-green-600">
//             <CheckCircle className="h-5 w-5" />
//           </div>
//           <div>
//             <p className="text-sm text-muted-foreground">Answered</p>
//             <p className="text-2xl font-bold">{questions.filter(q => q.status === 'answered').length}</p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <input 
//             type="text" 
//             placeholder="Search questions..." 
//             className="w-full pl-10 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
//           />
//         </div>
//         <select 
//           className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="all">All Status</option>
//           <option value="pending">Pending</option>
//           <option value="answered">Answered</option>
//           <option value="archived">Archived</option>
//         </select>
//       </div>

//       {/* Questions List */}
//       <div className="space-y-4">
//         {loading ? (
//           <div className="text-center py-12 bg-card rounded-xl border">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground">Loading questions...</p>
//           </div>
//         ) : filteredQuestions.length === 0 ? (
//           <div className="text-center py-12 bg-card rounded-xl border">
//             <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <p className="text-muted-foreground">No questions found.</p>
//           </div>
//         ) : (
//           filteredQuestions.map((q) => (
//             <div key={q.id} className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
//                     {q.user_name.charAt(0)}
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">{q.user_name}</h3>
//                     <p className="text-xs text-muted-foreground">{q.user_email} • {new Date(q.created_at).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
//                   q.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                   q.status === 'answered' ? 'bg-green-100 text-green-800' : 
//                   'bg-gray-100 text-gray-800'
//                 }`}>
//                   {q.status}
//                 </span>
//               </div>
              
//               <div className="mb-4">
//                 {q.property_title && (
//                   <div className="flex items-center gap-1 text-xs text-primary font-medium mb-2">
//                     <ExternalLink className="h-3 w-3" />
//                     Regarding: {q.property_title}
//                   </div>
//                 )}
//                 <p className="text-sm text-foreground leading-relaxed">
//                   "{q.question_text}"
//                 </p>
//               </div>

//               <div className="flex items-center justify-end gap-2 pt-4 border-t">
//                 <button className="p-2 hover:bg-red-50 rounded-md transition-colors text-muted-foreground hover:text-red-600">
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//                 <button className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
//                   <Reply className="mr-2 h-4 w-4" />
//                   Reply
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// new code
'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, Search, Filter, CheckCircle, 
  Clock, AlertCircle, Reply, Trash2, ExternalLink,
  Send, X
} from 'lucide-react'
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  Timestamp, 
  addDoc,
  updateDoc,
  doc,
  where,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Enquiry {
  id: string
  property_id: string | null
  name: string
  email: string
  phone: string
  message: string
  status: 'pending' | 'responded' | 'sent'
  created_at: string
  responded_at?: string
  category?: string
  property: {
    id: string
    title: string
    slug: string
    image: string
    location: string
    price: number
    currency: string
  } | null
}

interface Reply {
  id?: string
  enquiry_id: string
  admin_id: string
  admin_name: string
  message: string
  created_at: string | Timestamp
}

export default function AdminQuestionsPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [replies, setReplies] = useState<Reply[]>([])

  // Fetch all enquiries from Firebase
  useEffect(() => {
    setLoading(true)
    
    try {
      const enquiriesRef = collection(db, 'inquiries')
      
      // Query for all enquiries sorted by date
      const q = query(
        enquiriesRef,
        orderBy('created_at', 'desc')
      )

      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const enquiriesData: Enquiry[] = []
        
        snapshot.forEach((doc) => {
          const data = doc.data()
          
          // Convert Firebase Timestamp to ISO string
          const created_at = data.created_at instanceof Timestamp 
            ? data.created_at.toDate().toISOString()
            : data.created_at || new Date().toISOString()
          
          const responded_at = data.responded_at instanceof Timestamp
            ? data.responded_at.toDate().toISOString()
            : data.responded_at

          enquiriesData.push({
            id: doc.id,
            property_id: data.property_id || null,
            name: data.name || 'Customer',
            email: data.email,
            phone: data.phone || '',
            message: data.message,
            status: data.status || 'pending',
            created_at,
            responded_at,
            category: data.category || 'general',
            property: data.property || null
          } as Enquiry)
        })
        
        setEnquiries(enquiriesData)
        setLoading(false)
      }, (error) => {
        console.error('Firebase real-time error:', error)
        setLoading(false)
      })

      // Cleanup on unmount
      return () => unsubscribe()
    } catch (err) {
      console.error('Firebase setup error:', err)
      setLoading(false)
    }
  }, [])

  // Fetch replies when needed
  useEffect(() => {
    if (replyingTo) {
      fetchReplies(replyingTo)
    }
  }, [replyingTo])

  const fetchReplies = async (enquiryId: string) => {
    try {
      const repliesRef = collection(db, 'inquiry_replies')
      const q = query(
        repliesRef,
        where('enquiry_id', '==', enquiryId),
        orderBy('created_at', 'desc')
      )
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const repliesData: Reply[] = []
        
        snapshot.forEach((doc) => {
          const data = doc.data()
          repliesData.push({
            id: doc.id,
            ...data
          } as Reply)
        })
        
        setReplies(repliesData)
      })
      
      return unsubscribe
    } catch (err) {
      console.error('Error fetching replies:', err)
    }
  }

  const filteredEnquiries = enquiries.filter(enquiry => {
    // Status filter
    if (statusFilter !== 'all' && enquiry.status !== statusFilter) {
      return false
    }
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        enquiry.name.toLowerCase().includes(term) ||
        enquiry.email.toLowerCase().includes(term) ||
        enquiry.message.toLowerCase().includes(term) ||
        (enquiry.category?.toLowerCase().includes(term) || false) ||
        (enquiry.property?.title?.toLowerCase().includes(term) || false)
      )
    }
    
    return true
  })

  const handleSendReply = async (enquiryId: string) => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message')
      return
    }

    setSendingReply(true)
    
    try {
      // Admin details (you can get these from your auth context)
      const adminName = "Admin User" // Replace with actual admin name
      const adminId = "admin123" // Replace with actual admin ID

      // Save reply to "inquiry_replies" collection
      await addDoc(collection(db, 'inquiry_replies'), {
        enquiry_id: enquiryId,
        admin_id: adminId,
        admin_name: adminName,
        message: replyMessage,
        created_at: serverTimestamp()
      })

      // Update enquiry status to "responded"
      await updateDoc(doc(db, 'inquiries', enquiryId), {
        status: 'responded',
        responded_at: serverTimestamp()
      })

      // Reset and close
      setReplyMessage('')
      setReplyingTo(null)
      alert('Reply sent successfully!')

    } catch (err) {
      console.error('Error sending reply:', err)
      alert('Failed to send reply. Please try again.')
    } finally {
      setSendingReply(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'responded':
        return 'Answered'
      case 'pending':
        return 'Pending'
      default:
        return 'Sent'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Inquiries</h1>
          <p className="text-muted-foreground">Manage and respond to customer inquiries</p>
        </div>
        <div className="flex gap-2">
          
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Inquiries</p>
            <p className="text-2xl font-bold">{enquiries.length}</p>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{enquiries.filter(q => q.status === 'pending').length}</p>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Answered</p>
            <p className="text-2xl font-bold">{enquiries.filter(q => q.status === 'responded').length}</p>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold">
              {[...new Set(enquiries.map(e => e.category || 'general'))].length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, email, category, or message..." 
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="responded">Answered</option>
        
        </select>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 bg-card rounded-xl border">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading inquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No inquiries found.</p>
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary mt-1">
                    {enquiry.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{enquiry.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {enquiry.category || 'General'}
                      </span>
                    </div>
                    
                    {enquiry.phone && (
                      <p className="text-xs text-muted-foreground">Phone: {enquiry.phone}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    enquiry.status === 'responded' ? 'bg-green-100 text-green-800' : 
                    enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {getStatusIcon(enquiry.status)}
                    {getStatusText(enquiry.status)}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                {enquiry.property && (
                  <div className="flex items-center gap-1 text-xs text-primary font-medium mb-2">
                    <ExternalLink className="h-3 w-3" />
                    Regarding Property: {enquiry.property.title} - {enquiry.property.location}
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-sm text-foreground leading-relaxed">
                    {enquiry.message}
                  </p>
                </div>
              </div>

              {/* Previous Replies */}
              {replyingTo === enquiry.id && replies.length > 0 && (
                <div className="mb-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Previous Replies</h4>
                  {replies.map((reply) => (
                    <div key={reply.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-blue-800">
                          {reply.admin_name} • {reply.created_at instanceof Timestamp 
                            ? formatDate(reply.created_at.toDate().toISOString())
                            : formatDate(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-blue-900">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Section */}
              {replyingTo === enquiry.id ? (
                <div className="mb-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">Send Response</h4>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyMessage('')
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response here..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyMessage('')
                      }}
                      className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(enquiry.id)}
                      disabled={sendingReply || !replyMessage.trim()}
                      className="inline-flex items-center px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingReply ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Response
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 pt-4 border-t">
                  <button 
                    className="p-2 hover:bg-red-50 rounded-md transition-colors text-muted-foreground hover:text-red-600"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this inquiry?')) {
                        // Add delete functionality here
                        console.log('Delete inquiry:', enquiry.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {enquiry.status !== 'responded' && (
                    <button 
                      className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      onClick={() => setReplyingTo(enquiry.id)}
                    >
                      <Reply className="mr-2 h-4 w-4" />
                      Send Response
                    </button>
                  )}
                  {enquiry.status === 'responded' && (
                    <button 
                      className="inline-flex items-center px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                      onClick={() => setReplyingTo(enquiry.id)}
                    >
                      <Reply className="mr-2 h-4 w-4" />
                      Reply Again
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}