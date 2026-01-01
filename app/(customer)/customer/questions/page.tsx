// // new code
// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import { useRouter } from 'next/navigation'
// import {
//   ChatBubbleLeftRightIcon,
//   PlusIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   DocumentTextIcon,
//   TrashIcon,
//   PencilIcon,
//   XMarkIcon,
//   UserIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   CalendarIcon,
//   ArrowRightIcon
// } from '@heroicons/react/24/outline'
// import { 
//   collection, 
//   query, 
//   where, 
//   onSnapshot, 
//   Timestamp, 
//   addDoc,
//   deleteDoc,
//   doc,
//   updateDoc,
//   getDocs
// } from 'firebase/firestore'
// import { db } from '@/lib/firebase'

// interface Enquiry {
//   id: string
//   property_id: string | null
//   name: string
//   email: string
//   phone: string
//   subject: string
//   message: string
//   status: 'pending' | 'responded' | 'sent'
//   created_at: string
//   responded_at?: string
//   category?: string
//   property: {
//     id: string
//     title: string
//     slug: string
//     image: string
//     location: string
//     price: number
//     currency: string
//   } | null
//   user_id?: string
// }

// interface Reply {
//   id: string
//   enquiry_id: string
//   admin_id: string
//   admin_name: string
//   message: string
//   created_at: string
// }

// export default function CustomerQuestions() {
//   const [activeTab, setActiveTab] = useState<'history' | 'ask' | 'replies'>('history')
//   const [enquiries, setEnquiries] = useState<Enquiry[]>([])
//   const [allReplies, setAllReplies] = useState<Reply[]>([])
//   const [loading, setLoading] = useState(false)
//   const [loadingEnquiries, setLoadingEnquiries] = useState(true)
//   const [loadingReplies, setLoadingReplies] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: '',
//     category: 'general'
//   })
//   const [success, setSuccess] = useState(false)
//   const [error, setError] = useState('')
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
//   const [editingEnquiry, setEditingEnquiry] = useState<string | null>(null)
//   const [editFormData, setEditFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: '',
//     category: 'general'
//   })

//   const { user } = useAuth()
//   const router = useRouter()

//   // Debug user object
//   useEffect(() => {
//     console.log('User object in CustomerQuestions:', user)
//   }, [user])

//   // Pre-fill user data if logged in
//   useEffect(() => {
//     if (user) {
//       console.log('Setting form data for user:', user.email, user.uid)
//       setFormData(prev => ({
//         ...prev,
//         name: user.displayName || '',
//         email: user.email || ''
//       }))
//     }
//   }, [user])

//   // Firebase real-time listener for enquiries - FIXED WITHOUT ORDERBY
//   useEffect(() => {
//     if (!user) {
//       setLoadingEnquiries(false)
//       return
//     }

//     setLoadingEnquiries(true)
    
//     try {
//       const enquiriesRef = collection(db, 'inquiries')
      
//       // Fetch all enquiries without orderBy to avoid index error
//       const q = query(enquiriesRef)

//       // Set up real-time listener
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const enquiriesData: Enquiry[] = []
        
//         snapshot.forEach((doc) => {
//           const data = doc.data()
          
//           // Check if this enquiry belongs to current user
//           // EITHER by email OR by user_id
//           const enquiryEmail = data.email?.toLowerCase().trim()
//           const userEmail = user.email?.toLowerCase().trim()
//           const enquiryUserId = data.user_id
//           const currentUserId = user.uid
          
//           // Skip if neither email nor user_id matches
//           if (enquiryEmail !== userEmail && enquiryUserId !== currentUserId) {
//             return
//           }
          
//           // Convert Firebase Timestamp to ISO string
//           const created_at = data.created_at instanceof Timestamp 
//             ? data.created_at.toDate().toISOString()
//             : data.created_at || new Date().toISOString()
          
//           const responded_at = data.responded_at instanceof Timestamp
//             ? data.responded_at.toDate().toISOString()
//             : data.responded_at

//           enquiriesData.push({
//             id: doc.id,
//             property_id: data.property_id || null,
//             name: data.name || '',
//             email: data.email || '',
//             phone: data.phone || '',
//             subject: data.subject || '',
//             message: data.message || '',
//             status: data.status || 'pending',
//             created_at,
//             responded_at,
//             category: data.category || 'general',
//             property: data.property || null,
//             user_id: data.user_id || undefined
//           } as Enquiry)
//         })
        
//         // Sort manually on client side (newest first)
//         enquiriesData.sort((a, b) => 
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         )
        
//         console.log(`Found ${enquiriesData.length} enquiries for user`)
//         setEnquiries(enquiriesData)
//         setLoadingEnquiries(false)
//       }, (error) => {
//         console.error('Firebase real-time error:', error)
//         setError('Connection issue. Please refresh.')
//         setLoadingEnquiries(false)
//       })

//       // Cleanup on unmount
//       return () => unsubscribe()
//     } catch (err) {
//       console.error('Firebase setup error:', err)
//       setLoadingEnquiries(false)
//     }
//   }, [user])

//   // ✅ NEW: Real-time listener for replies to update enquiry status automatically
//   useEffect(() => {
//     if (!user) return;

//     const repliesRef = collection(db, 'inquiry_replies');
//     const q = query(repliesRef);

//     const unsubscribe = onSnapshot(q, async (snapshot) => {
//       snapshot.docChanges().forEach(async (change) => {
//         if (change.type === 'added') {
//           const replyData = change.doc.data();
//           const enquiryId = replyData.enquiry_id;
          
//           console.log('New reply detected for enquiry:', enquiryId);
          
//           // Update enquiry status to 'responded'
//           try {
//             const enquiryRef = doc(db, 'inquiries', enquiryId);
//             await updateDoc(enquiryRef, {
//               status: 'responded',
//               responded_at: Timestamp.now()
//             });
            
//             console.log('Enquiry status updated to responded:', enquiryId);
            
//             // Update local state
//             setEnquiries(prev => prev.map(enquiry => 
//               enquiry.id === enquiryId 
//                 ? { 
//                     ...enquiry, 
//                     status: 'responded',
//                     responded_at: new Date().toISOString()
//                   }
//                 : enquiry
//             ));
//           } catch (error) {
//             console.error('Error updating enquiry status:', error);
//           }
//         }
//       });
//     }, (error) => {
//       console.error('Error in replies listener:', error);
//     });

//     return () => unsubscribe();
//   }, [user]);

//   // Fetch all replies for the current user - FIXED WITHOUT ORDERBY
//   const fetchAllReplies = async () => {
//     if (!user || enquiries.length === 0) {
//       setAllReplies([]);
//       setLoadingReplies(false);
//       return;
//     }
    
//     setLoadingReplies(true);
    
//     try {
//       // First get all enquiry IDs for this user
//       const userEnquiryIds = enquiries.map(enquiry => enquiry.id);
      
//       if (userEnquiryIds.length === 0) {
//         setAllReplies([]);
//         setLoadingReplies(false);
//         return;
//       }

//       // Use 'in' operator to fetch replies for multiple enquiries in one query
//       const repliesRef = collection(db, 'inquiry_replies');
      
//       // If we have 10 or fewer enquiries, use the 'in' operator for efficiency
//       if (userEnquiryIds.length <= 10) {
//         const q = query(
//           repliesRef,
//           where('enquiry_id', 'in', userEnquiryIds)
//           // Removed orderBy to avoid index error
//         );
        
//         const querySnapshot = await getDocs(q);
//         const repliesData: Reply[] = [];
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           repliesData.push({
//             id: doc.id,
//             enquiry_id: data.enquiry_id,
//             admin_id: data.admin_id,
//             admin_name: data.admin_name,
//             message: data.message,
//             created_at: data.created_at instanceof Timestamp 
//               ? data.created_at.toDate().toISOString()
//               : data.created_at
//           });
//         });
        
//         // ✅ NEW: Update enquiry statuses based on replies
//         for (const enquiry of enquiries) {
//           const hasReply = repliesData.some(reply => reply.enquiry_id === enquiry.id);
//           if (hasReply && enquiry.status !== 'responded') {
//             // Update in Firebase
//             try {
//               const enquiryRef = doc(db, 'inquiries', enquiry.id);
//               await updateDoc(enquiryRef, {
//                 status: 'responded',
//                 responded_at: Timestamp.now()
//               });
              
//               // Update local state
//               setEnquiries(prev => prev.map(e => 
//                 e.id === enquiry.id 
//                   ? { ...e, status: 'responded', responded_at: new Date().toISOString() }
//                   : e
//               ));
//             } catch (err) {
//               console.error(`Error updating enquiry ${enquiry.id}:`, err);
//             }
//           }
//         }
        
//         // Sort by date on client side (newest first)
//         repliesData.sort((a, b) => 
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         );
        
//         setAllReplies(repliesData);
//       } else {
//         // Fallback: For more than 10 enquiries, fetch one by one
//         const repliesData: Reply[] = [];
        
//         for (const enquiryId of userEnquiryIds) {
//           try {
//             const q = query(
//               repliesRef,
//               where('enquiry_id', '==', enquiryId)
//               // Removed orderBy to avoid index error
//             );
            
//             const querySnapshot = await getDocs(q);
            
//             querySnapshot.forEach((doc) => {
//               const data = doc.data();
//               repliesData.push({
//                 id: doc.id,
//                 enquiry_id: data.enquiry_id,
//                 admin_id: data.admin_id,
//                 admin_name: data.admin_name,
//                 message: data.message,
//                 created_at: data.created_at instanceof Timestamp 
//                   ? data.created_at.toDate().toISOString()
//                   : data.created_at
//               });
//             });
            
//             // ✅ NEW: Update enquiry status if it has replies
//             if (querySnapshot.size > 0) {
//               try {
//                 const enquiryRef = doc(db, 'inquiries', enquiryId);
//                 await updateDoc(enquiryRef, {
//                   status: 'responded',
//                   responded_at: Timestamp.now()
//                 });
                
//                 setEnquiries(prev => prev.map(e => 
//                   e.id === enquiryId 
//                     ? { ...e, status: 'responded', responded_at: new Date().toISOString() }
//                     : e
//                 ));
//               } catch (err) {
//                 console.error(`Error updating enquiry ${enquiryId}:`, err);
//               }
//             }
//           } catch (err) {
//             console.error(`Error fetching replies for enquiry ${enquiryId}:`, err);
//           }
//         }
        
//         // Sort by date on client side (newest first)
//         repliesData.sort((a, b) => 
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         );
        
//         setAllReplies(repliesData);
//       }
//     } catch (err) {
//       console.error('Error fetching all replies:', err);
      
//       // Final fallback: fetch all replies and filter client-side
//       try {
//         const repliesRef = collection(db, 'inquiry_replies');
//         const q = query(repliesRef); // No orderBy
        
//         const querySnapshot = await getDocs(q);
//         const repliesData: Reply[] = [];
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           const reply = {
//             id: doc.id,
//             enquiry_id: data.enquiry_id,
//             admin_id: data.admin_id,
//             admin_name: data.admin_name,
//             message: data.message,
//             created_at: data.created_at instanceof Timestamp 
//               ? data.created_at.toDate().toISOString()
//               : data.created_at
//           };
          
//           // Filter client-side to only include replies for user's enquiries
//           if (enquiries.some(enquiry => enquiry.id === reply.enquiry_id)) {
//             repliesData.push(reply);
//           }
//         });
        
//         // ✅ NEW: Update enquiry statuses based on replies
//         for (const enquiry of enquiries) {
//           const hasReply = repliesData.some(reply => reply.enquiry_id === enquiry.id);
//           if (hasReply && enquiry.status !== 'responded') {
//             setEnquiries(prev => prev.map(e => 
//               e.id === enquiry.id 
//                 ? { ...e, status: 'responded', responded_at: new Date().toISOString() }
//                 : e
//             ));
//           }
//         }
        
//         // Sort on client side
//         repliesData.sort((a, b) => 
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         );
        
//         setAllReplies(repliesData);
//       } catch (err2) {
//         console.error('Error in fallback reply fetch:', err2);
//         setAllReplies([]);
//       }
//     } finally {
//       setLoadingReplies(false);
//     }
//   }

//   // Load replies when switching to replies tab
//   useEffect(() => {
//     if (activeTab === 'replies' && enquiries.length > 0) {
//       fetchAllReplies()
//     }
//   }, [activeTab, enquiries.length])

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//     setError('')
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
    
//     // Validation
//     if (!formData.name.trim()) {
//       setError('Please enter your name')
//       return
//     }
//     if (!formData.email.trim()) {
//       setError('Please enter your email')
//       return
//     }
//     if (!formData.subject.trim()) {
//       setError('Please enter subject')
//       return
//     }
//     if (!formData.message.trim()) {
//       setError('Please enter message')
//       return
//     }
    
//     setLoading(true)

//     try {
//       // Create enquiry data object
//       const enquiryData: any = {
//         property_id: null,
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         phone: formData.phone.trim() || '',
//         subject: formData.subject.trim(),
//         message: formData.message.trim(),
//         status: 'pending',
//         category: formData.category,
//         created_at: Timestamp.now(),
//         // IMPORTANT: Always add user_id when user is logged in
//         user_id: user?.uid || null
//       }

//       console.log('Current user when submitting:', user)
//       if (user && user.uid) {
//         enquiryData.user_id = user.uid
//         console.log('Adding user_id:', user.uid)
//       } else {
//         console.log('No user_id added - user not logged in or no uid')
//       }

//       console.log('Saving enquiry data:', enquiryData)
      
//       const docRef = await addDoc(collection(db, 'inquiries'), enquiryData)
//       console.log('Enquiry saved with ID:', docRef.id)

//       setSuccess(true)
//       setFormData({
//         name: user?.displayName || '',
//         email: user?.email || '',
//         phone: '',
//         subject: '',
//         message: '',
//         category: 'general'
//       })

//       setTimeout(() => {
//         setActiveTab('history')
//         setSuccess(false)
//       }, 2000)

//     } catch (err: any) {
//       console.error('Error saving to Firebase:', err)
//       console.error('Error details:', err.message, err.code)
//       setError(`Enquiry submit nahi ho saka: ${err.message || 'Unknown error'}`)
//     }

//     setLoading(false)
//   }

//   // Delete enquiry function
//   const handleDeleteEnquiry = async (enquiryId: string) => {
//     if (!user) return
    
//     if (!window.confirm('Are you sure you want to delete this enquiry?')) {
//       return
//     }
    
//     setDeleteLoading(enquiryId)
    
//     try {
//       await deleteDoc(doc(db, 'inquiries', enquiryId))
//       // Also delete related replies
//       const repliesRef = collection(db, 'inquiry_replies')
//       const q = query(repliesRef, where('enquiry_id', '==', enquiryId))
//       const snapshot = await getDocs(q)
      
//       const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
//       await Promise.all(deletePromises)
      
//     } catch (err) {
//       console.error('Error deleting enquiry:', err)
//       setError('Enquiry delete nahi ho saka. Please try again.')
//     } finally {
//       setDeleteLoading(null)
//     }
//   }

//   // Setup edit form
//   const handleEditClick = (enquiry: Enquiry) => {
//     setEditingEnquiry(enquiry.id)
//     setEditFormData({
//       name: enquiry.name,
//       email: enquiry.email,
//       phone: enquiry.phone,
//       subject: enquiry.subject,
//       message: enquiry.message,
//       category: enquiry.category || 'general'
//     })
//   }

//   const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setEditFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   // Update enquiry function
//   const handleUpdateEnquiry = async (enquiryId: string) => {
//     if (!user) return
    
//     // Validation
//     if (!editFormData.name.trim()) {
//       setError('Please enter your name')
//       return
//     }
//     if (!editFormData.email.trim()) {
//       setError('Please enter your email')
//       return
//     }
//     if (!editFormData.subject.trim()) {
//       setError('Please enter subject')
//       return
//     }
//     if (!editFormData.message.trim()) {
//       setError('Please enter message')
//       return
//     }
    
//     try {
//       const updateData: any = {
//         name: editFormData.name.trim(),
//         email: editFormData.email.trim(),
//         phone: editFormData.phone.trim() || '',
//         subject: editFormData.subject.trim(),
//         message: editFormData.message.trim(),
//         category: editFormData.category,
//         status: 'pending', // Reset status when edited
//         updated_at: Timestamp.now(),
//         // Keep user_id when updating
//         user_id: user?.uid || null
//       }

//       await updateDoc(doc(db, 'inquiries', enquiryId), updateData)
      
//       setEditingEnquiry(null)
//       setError('')
//     } catch (err) {
//       console.error('Error updating enquiry:', err)
//       setError('Enquiry update nahi ho saka. Please try again.')
//     }
//   }

//   const cancelEdit = () => {
//     setEditingEnquiry(null)
//     setError('')
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'responded':
//         return <CheckCircleIcon className="h-5 w-5 text-green-500" />
//       case 'pending':
//         return <ClockIcon className="h-5 w-5 text-blue-500" />
//       default:
//         return <DocumentTextIcon className="h-5 w-5 text-slate-400" />
//     }
//   }

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'responded':
//         return 'Responded'
//       case 'pending':
//         return 'Pending'
//       default:
//         return 'Sent'
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   // Get enquiry by ID
//   const getEnquiryById = (enquiryId: string) => {
//     return enquiries.find(enquiry => enquiry.id === enquiryId)
//   }

//   // Get replies count for an enquiry
//   const getReplyCount = (enquiryId: string) => {
//     return allReplies.filter(reply => reply.enquiry_id === enquiryId).length
//   }

//   // Get replies for specific enquiry
//   const getRepliesForEnquiry = (enquiryId: string) => {
//     return allReplies
//       .filter(reply => reply.enquiry_id === enquiryId)
//       .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//   }

//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div className="text-center">
//             <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
//             <h2 className="mt-6 text-3xl font-serif text-secondary">Enquiry Submitted!</h2>
//             <p className="mt-2 text-sm text-gray-600">
//               We'll get back to you within 24 hours with a response.
//             </p>
//             <button
//               onClick={() => {
//                 setSuccess(false)
//                 setActiveTab('history')
//               }}
//               className="mt-6 w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
//             >
//               View My Enquiries
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div className="flex items-center">
//               <button
//                 onClick={() => router.back()}
//                 className="text-slate-400 hover:text-slate-600 mr-4"
//               >
//                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <div>
//                 <h1 className="text-2xl font-serif text-secondary">My Inquiries</h1>
//                 <p className="text-sm text-slate-500">View and manage your property enquiries</p>
//               </div>
//             </div>
//             {enquiries.length > 0 && (
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-green-600 font-medium">Live Updates Active</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden">
//           <div className="border-b border-slate-100">
//             <nav className="flex">
//               <button
//                 onClick={() => setActiveTab('history')}
//                 className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
//                   activeTab === 'history'
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 My Inquiries
//               </button>
//               <button
//                 onClick={() => setActiveTab('replies')}
//                 className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
//                   activeTab === 'replies'
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 Admin Replies
//               </button>
//               <button
//                 onClick={() => setActiveTab('ask')}
//                 className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
//                   activeTab === 'ask'
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 Ask a Question
//               </button>
//             </nav>
//           </div>

//           <div className="p-8">
//             {activeTab === 'history' ? (
//               <div>
//                 <div className="flex items-center justify-between mb-8">
//                   <h2 className="text-xl font-serif text-secondary">Inquiry History</h2>
//                   <button
//                     onClick={() => setActiveTab('ask')}
//                     className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
//                   >
//                     <PlusIcon className="h-5 w-5" />
//                     New Inquiry
//                   </button>
//                 </div>

//                 {loadingEnquiries ? (
//                   <div className="space-y-6">
//                     {[1, 2, 3].map((_, i) => (
//                       <div key={i} className="animate-pulse">
//                         <div className="h-32 bg-slate-200 rounded-2xl"></div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : enquiries.length > 0 ? (
//                   <div className="space-y-6">
//                     {enquiries.map((enquiry) => (
//                       <div key={enquiry.id} id={`enquiry-${enquiry.id}`} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-primary/50 transition-all">
//                         <div className="flex items-start justify-between mb-4">
//                           <div className="flex items-center gap-4">
//                             {getStatusIcon(enquiry.status)}
//                             <div>
//                               <h3 className="font-bold text-secondary">
//                                 {enquiry.subject}
//                               </h3>
//                               <p className="text-sm text-slate-500">
//                                 {enquiry.property 
//                                   ? `${enquiry.property.location} • ${enquiry.property.price?.toLocaleString()} ${enquiry.property.currency}`
//                                   : enquiry.category ? `${enquiry.category.charAt(0).toUpperCase() + enquiry.category.slice(1)}` : 'General Question'}
//                               </p>
//                               <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
//                                 <span className="flex items-center gap-1">
//                                   <UserIcon className="h-3 w-3" />
//                                   {enquiry.name}
//                                 </span>
//                                 <span className="flex items-center gap-1">
//                                   <EnvelopeIcon className="h-3 w-3" />
//                                   {enquiry.email}
//                                 </span>
//                                 {enquiry.phone && (
//                                   <span className="flex items-center gap-1">
//                                     <PhoneIcon className="h-3 w-3" />
//                                     {enquiry.phone}
//                                   </span>
//                                 )}
//                                 <span className="flex items-center gap-1">
//                                   <CalendarIcon className="h-3 w-3" />
//                                   {formatDate(enquiry.created_at)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-3">
//                             <div className="text-right">
//                               <div className={`text-sm font-bold ${
//                                 enquiry.status === 'responded' ? 'text-green-600' :
//                                 enquiry.status === 'pending' ? 'text-blue-600' : 'text-slate-600'
//                               }`}>
//                                 {getStatusText(enquiry.status)}
//                                 {enquiry.status === 'responded' && getReplyCount(enquiry.id) > 0 && (
//                                   <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
//                                     {getReplyCount(enquiry.id)} {getReplyCount(enquiry.id) === 1 ? 'reply' : 'replies'}
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="text-xs text-slate-400">
//                                 {formatDate(enquiry.created_at)}
//                               </div>
//                             </div>
                            
//                             {/* Action Buttons */}
//                             <div className="flex gap-1">
//                               {/* Edit Button */}
//                               <button
//                                 onClick={() => handleEditClick(enquiry)}
//                                 className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                                 title="Edit enquiry"
//                               >
//                                 <PencilIcon className="h-5 w-5" />
//                               </button>
                              
//                               {/* Delete Button */}
//                               <button
//                                 onClick={() => handleDeleteEnquiry(enquiry.id)}
//                                 disabled={deleteLoading === enquiry.id}
//                                 className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
//                                 title="Delete enquiry"
//                               >
//                                 {deleteLoading === enquiry.id ? (
//                                   <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                                   </svg>
//                                 ) : (
//                                   <TrashIcon className="h-5 w-5" />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Edit Form */}
//                         {editingEnquiry === enquiry.id ? (
//                           <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                             <div className="flex justify-between items-center mb-4">
//                               <h4 className="font-bold text-blue-800">Edit Inquiry</h4>
//                               <button
//                                 onClick={cancelEdit}
//                                 className="p-1 text-blue-600 hover:text-blue-800"
//                                 title="Cancel edit"
//                               >
//                                 <XMarkIcon className="h-5 w-5" />
//                               </button>
//                             </div>
                            
//                             <div className="space-y-3">
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Your Name *
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="name"
//                                   value={editFormData.name}
//                                   onChange={handleEditInputChange}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
                              
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Email *
//                                 </label>
//                                 <input
//                                   type="email"
//                                   name="email"
//                                   value={editFormData.email}
//                                   onChange={handleEditInputChange}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
                              
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Phone
//                                 </label>
//                                 <input
//                                   type="tel"
//                                   name="phone"
//                                   value={editFormData.phone}
//                                   onChange={handleEditInputChange}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
                              
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Subject *
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="subject"
//                                   value={editFormData.subject}
//                                   onChange={handleEditInputChange}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
                              
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Category
//                                 </label>
//                                 <select
//                                   name="category"
//                                   value={editFormData.category}
//                                   onChange={handleEditInputChange}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 >
//                                   <option value="general">General Inquiry</option>
//                                   <option value="property">Property Information</option>
//                                   <option value="valuation">Property Valuation</option>
//                                   <option value="investment">Investment Advice</option>
//                                   <option value="legal">Legal Questions</option>
//                                   <option value="financing">Financing</option>
//                                 </select>
//                               </div>
                              
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Message *
//                                 </label>
//                                 <textarea
//                                   name="message"
//                                   rows={3}
//                                   value={editFormData.message}
//                                   onChange={handleEditInputChange}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
                              
//                               {error && (
//                                 <div className="text-sm text-red-600">
//                                   {error}
//                                 </div>
//                               )}
                              
//                               <div className="flex justify-end gap-2 pt-2">
//                                 <button
//                                   onClick={cancelEdit}
//                                   className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                                 >
//                                   Cancel
//                                 </button>
//                                 <button
//                                   onClick={() => handleUpdateEnquiry(enquiry.id)}
//                                   className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                                 >
//                                   Update Inquiry
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           /* Normal Display */
//                           <>
//                             <div className="mb-4">
//                               <div className="bg-white p-4 rounded-lg border">
//                                 <p className="text-slate-600 text-sm leading-relaxed">{enquiry.message}</p>
//                               </div>
//                             </div>

//                             {/* Display Replies for this enquiry */}
//                             {getReplyCount(enquiry.id) > 0 && (
//                               <div className="mb-4">
//                                 <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//                                   <div className="flex items-center justify-between mb-2">
//                                     <div className="flex items-center gap-2">
//                                       <CheckCircleIcon className="h-5 w-5 text-green-600" />
//                                       <span className="font-bold text-green-800">
//                                         {getReplyCount(enquiry.id)} {getReplyCount(enquiry.id) === 1 ? 'Reply' : 'Replies'} Received
//                                       </span>
//                                     </div>
//                                     <button
//                                       onClick={() => setActiveTab('replies')}
//                                       className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
//                                     >
//                                       View All Replies
//                                       <ArrowRightIcon className="h-3 w-3" />
//                                     </button>
//                                   </div>
                                  
//                                   {/* Show latest reply preview */}
//                                   {getRepliesForEnquiry(enquiry.id).slice(0, 1).map((reply, index) => (
//                                     <div key={index} className="mt-2">
//                                       <div className="flex items-center gap-2 mb-1">
//                                         <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
//                                           <UserIcon className="h-3 w-3 text-green-600" />
//                                         </div>
//                                         <span className="text-sm font-medium text-green-700">{reply.admin_name}</span>
//                                         <span className="text-xs text-green-500">{formatDate(reply.created_at)}</span>
//                                       </div>
//                                       <p className="text-sm text-green-600 line-clamp-2">
//                                         {reply.message}
//                                       </p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}

//                             {enquiry.status === 'responded' && getReplyCount(enquiry.id) === 0 && (
//                               <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <CheckCircleIcon className="h-5 w-5 text-green-600" />
//                                   <span className="font-bold text-green-800">Response Received</span>
//                                 </div>
//                                 <p className="text-sm text-green-600">
//                                   Our team has responded to your inquiry.
//                                   {enquiry.responded_at && ` Responded on ${formatDate(enquiry.responded_at)}.`}
//                                 </p>
//                               </div>
//                             )}

//                             {enquiry.status === 'pending' && (
//                               <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                                 <div className="flex items-center gap-2">
//                                   <ClockIcon className="h-5 w-5 text-blue-600" />
//                                   <span className="font-bold text-blue-800">Awaiting Response</span>
//                                 </div>
//                                 <p className="text-sm text-blue-600 mt-1">
//                                   We're reviewing your inquiry and will get back to you within 24 hours.
//                                 </p>
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-16">
//                     <ChatBubbleLeftRightIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
//                     <h3 className="text-lg font-bold text-secondary mb-2">No inquiries yet</h3>
//                     <p className="text-slate-500 mb-6">Have questions about properties or our services? We're here to help.</p>
//                     <button
//                       onClick={() => setActiveTab('ask')}
//                       className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all"
//                     >
//                       Ask a Question
//                       <PlusIcon className="h-5 w-5" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : activeTab === 'replies' ? (
//               <div>
//                 <div className="flex items-center justify-between mb-8">
//                   <div>
//                     <h2 className="text-xl font-serif text-secondary">Admin Replies</h2>
//                     <p className="text-sm text-slate-500 mt-1">
//                       All responses from our team to your inquiries
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => setActiveTab('history')}
//                       className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-secondary font-bold rounded-xl hover:bg-slate-50 transition-all"
//                     >
//                       Back to Inquiries
//                     </button>
//                     <button
//                       onClick={() => setActiveTab('ask')}
//                       className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
//                     >
//                       <PlusIcon className="h-5 w-5" />
//                       New Inquiry
//                     </button>
//                   </div>
//                 </div>

//                 {loadingReplies ? (
//                   <div className="text-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//                     <p className="text-muted-foreground">Loading replies...</p>
//                   </div>
//                 ) : allReplies.length > 0 ? (
//                   <div className="space-y-6">
//                     {allReplies.map((reply) => {
//                       const enquiry = getEnquiryById(reply.enquiry_id)
//                       return (
//                         <div key={reply.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
//                           <div className="flex items-start justify-between mb-6">
//                             <div>
//                               <h3 className="font-bold text-secondary text-lg flex items-center gap-2">
//                                 <CheckCircleIcon className="h-6 w-6 text-green-500" />
//                                 Reply from Admin
//                               </h3>
//                               {enquiry && (
//                                 <div className="mt-2">
//                                   <p className="text-sm text-slate-600">
//                                     <span className="font-medium">Regarding:</span> {enquiry.subject}
//                                   </p>
//                                   <p className="text-xs text-slate-500 mt-1">
//                                     Your Inquiry: {formatDate(enquiry.created_at)}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="text-right">
//                               <div className="flex items-center gap-2 text-sm font-medium text-green-700">
//                                 <UserIcon className="h-4 w-4" />
//                                 {reply.admin_name}
//                               </div>
//                               <div className="text-xs text-slate-400 mt-1">
//                                 {formatDate(reply.created_at)}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Reply Message - Highlighted Section */}
//                           <div className="bg-white rounded-xl p-4 border border-green-100 mb-4">
//                             <div className="flex items-start gap-3">
//                               <div className="flex-shrink-0">
//                                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
//                                   <UserIcon className="h-5 w-5 text-green-600" />
//                                 </div>
//                               </div>
//                               <div className="flex-1">
//                                 <div className="flex items-center justify-between mb-2">
//                                   <span className="font-bold text-green-800">{reply.admin_name}</span>
//                                   <span className="text-xs text-green-600">
//                                     {formatDate(reply.created_at)}
//                                   </span>
//                                 </div>
//                                 <div className="bg-green-50 p-3 rounded-lg border border-green-200">
//                                   <p className="text-slate-700 leading-relaxed">
//                                     {reply.message}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Original Inquiry Summary */}
//                           {enquiry && (
//                             <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
//                               <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                                 <DocumentTextIcon className="h-4 w-4" />
//                                 Your Original Inquiry
//                               </h4>
//                               <div className="text-sm text-slate-600">
//                                 <p className="font-medium mb-1">{enquiry.subject}</p>
//                                 <p className="text-slate-500">{enquiry.message.substring(0, 150)}...</p>
//                                 <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
//                                   <span className="flex items-center gap-1">
//                                     <CalendarIcon className="h-3 w-3" />
//                                     {formatDate(enquiry.created_at)}
//                                   </span>
//                                   {enquiry.category && (
//                                     <span className="px-2 py-0.5 bg-slate-200 rounded-full">
//                                       {enquiry.category}
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           )

//                           }

//                           <div className="mt-4 flex justify-end">
//                             <button
//                               onClick={() => {
//                                 setActiveTab('history')
//                                 // Scroll to the specific enquiry
//                                 setTimeout(() => {
//                                   const element = document.getElementById(`enquiry-${reply.enquiry_id}`)
//                                   if (element) {
//                                     element.scrollIntoView({ behavior: 'smooth' })
//                                   }
//                                 }, 100)
//                               }}
//                               className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-800 font-medium"
//                             >
//                               View Full Inquiry
//                               <ArrowRightIcon className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center py-16">
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 max-w-2xl mx-auto">
//                       <ChatBubbleLeftRightIcon className="h-16 w-16 text-blue-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-bold text-secondary mb-2">No replies yet</h3>
//                       <p className="text-slate-500 mb-4">
//                         You haven't received any responses from our team yet.
//                         Once we respond to your inquiries, you'll see the replies here.
//                       </p>
//                       <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                         <button
//                           onClick={() => setActiveTab('history')}
//                           className="px-6 py-3 border border-slate-200 text-secondary font-bold rounded-xl hover:bg-slate-50 transition-all"
//                         >
//                           View My Inquiries
//                         </button>
//                         <button
//                           onClick={() => setActiveTab('ask')}
//                           className="px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
//                         >
//                           <PlusIcon className="h-5 w-5 inline mr-2" />
//                           Ask a New Question
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div>
//                 <div className="mb-8">
//                   <h2 className="text-xl font-serif text-secondary mb-2">Ask Our Experts</h2>
//                   <p className="text-slate-500">Get answers to your property-related questions from our experienced team</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-bold text-secondary mb-2">
//                         Your Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         required
//                         className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
//                         placeholder="Enter your full name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-bold text-secondary mb-2">
//                         Email *
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         required
//                         className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
//                         placeholder="Enter your email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-secondary mb-2">
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
//                       placeholder="Enter your phone number (optional)"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-secondary mb-2">
//                       Subject *
//                     </label>
//                     <input
//                       type="text"
//                       name="subject"
//                       required
//                       className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
//                       placeholder="Brief description of your question"
//                       value={formData.subject}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-secondary mb-2">
//                       Category
//                     </label>
//                     <select
//                       name="category"
//                       className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                     >
//                       <option value="general">General Inquiry</option>
//                       <option value="property">Property Information</option>
//                       <option value="valuation">Property Valuation</option>
//                       <option value="investment">Investment Advice</option>
//                       <option value="legal">Legal Questions</option>
//                       <option value="financing">Financing</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-secondary mb-2">
//                       Message *
//                     </label>
//                     <textarea
//                       name="message"
//                       required
//                       rows={6}
//                       className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
//                       placeholder="Please provide details about your question..."
//                       value={formData.message}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {error && (
//                     <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                       <div className="flex items-center gap-2 text-red-700">
//                         <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                         </svg>
//                         <span className="text-sm">{error}</span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex justify-end gap-4">
//                     <button
//                       type="button"
//                       onClick={() => setActiveTab('history')}
//                       className="px-8 py-3 border border-slate-200 text-secondary font-bold rounded-xl hover:bg-slate-50 transition-all"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="px-8 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                     >
//                       {loading ? (
//                         <>
//                           <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                           </svg>
//                           Submitting...
//                         </>
//                       ) : (
//                         'Submit Inquiry'
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// new code
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  Timestamp, 
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Enquiry {
  id: string
  property_id: string | null
  name: string
  email: string
  phone: string
  subject: string
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
  user_id?: string
}

interface Reply {
  id: string
  enquiry_id: string
  admin_id: string
  admin_name: string
  message: string
  created_at: string
}

export default function CustomerQuestions() {
  const [activeTab, setActiveTab] = useState<'history' | 'ask' | 'replies'>('history')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [allReplies, setAllReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingEnquiries, setLoadingEnquiries] = useState(true)
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [editingEnquiry, setEditingEnquiry] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const { user } = useAuth()
  const router = useRouter()

  // Debug user object
  useEffect(() => {
    console.log('User object in CustomerQuestions:', user)
  }, [user])

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      console.log('Setting form data for user:', user.email, user.id)
      setFormData(prev => ({
        ...prev,
        name: '',
        email: user.email || ''
      }))
    }
  }, [user])

  // Firebase real-time listener for enquiries - FIXED WITHOUT ORDERBY
  useEffect(() => {
    if (!user) {
      setLoadingEnquiries(false)
      return
    }

    setLoadingEnquiries(true)
    
    try {
      const enquiriesRef = collection(db, 'inquiries')
      
      // Fetch all enquiries without orderBy to avoid index error
      const q = query(enquiriesRef)

      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const enquiriesData: Enquiry[] = []
        
        snapshot.forEach((doc) => {
          const data = doc.data()
          
          // Check if this enquiry belongs to current user
          // EITHER by email OR by user_id
          const enquiryEmail = data.email?.toLowerCase().trim()
          const userEmail = user.email?.toLowerCase().trim()
          const enquiryUserId = data.user_id
          const currentUserId = user.id
          
          // Skip if neither email nor user_id matches
          if (enquiryEmail !== userEmail && enquiryUserId !== currentUserId) {
            return
          }
          
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
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            subject: data.subject || '',
            message: data.message || '',
            status: data.status || 'pending',
            created_at,
            responded_at,
            category: data.category || 'general',
            property: data.property || null,
            user_id: data.user_id || undefined
          } as Enquiry)
        })
        
        // Sort manually on client side (newest first)
        enquiriesData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        
        console.log(`Found ${enquiriesData.length} enquiries for user`)
        setEnquiries(enquiriesData)
        setLoadingEnquiries(false)
      }, (error) => {
        console.error('Firebase real-time error:', error)
        setError('Connection issue. Please refresh.')
        setLoadingEnquiries(false)
      })

      // Cleanup on unmount
      return () => unsubscribe()
    } catch (err) {
      console.error('Firebase setup error:', err)
      setLoadingEnquiries(false)
    }
  }, [user])

  // ✅ NEW: Real-time listener for replies to update enquiry status automatically
  useEffect(() => {
    if (!user) return;

    const repliesRef = collection(db, 'inquiry_replies');
    const q = query(repliesRef);

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const replyData = change.doc.data();
          const enquiryId = replyData.enquiry_id;
          
          console.log('New reply detected for enquiry:', enquiryId);
          
          // Update enquiry status to 'responded'
          try {
            const enquiryRef = doc(db, 'inquiries', enquiryId);
            await updateDoc(enquiryRef, {
              status: 'responded',
              responded_at: Timestamp.now()
            });
            
            console.log('Enquiry status updated to responded:', enquiryId);
            
            // Update local state
            setEnquiries(prev => prev.map(enquiry => 
              enquiry.id === enquiryId 
                ? { 
                    ...enquiry, 
                    status: 'responded',
                    responded_at: new Date().toISOString()
                  }
                : enquiry
            ));
          } catch (error) {
            console.error('Error updating enquiry status:', error);
          }
        }
      });
    }, (error) => {
      console.error('Error in replies listener:', error);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch all replies for the current user - FIXED WITHOUT ORDERBY
  const fetchAllReplies = async () => {
    if (!user || enquiries.length === 0) {
      setAllReplies([]);
      setLoadingReplies(false);
      return;
    }
    
    setLoadingReplies(true);
    
    try {
      // First get all enquiry IDs for this user
      const userEnquiryIds = enquiries.map(enquiry => enquiry.id);
      
      if (userEnquiryIds.length === 0) {
        setAllReplies([]);
        setLoadingReplies(false);
        return;
      }

      // Use 'in' operator to fetch replies for multiple enquiries in one query
      const repliesRef = collection(db, 'inquiry_replies');
      
      // If we have 10 or fewer enquiries, use the 'in' operator for efficiency
      if (userEnquiryIds.length <= 10) {
        const q = query(
          repliesRef,
          where('enquiry_id', 'in', userEnquiryIds)
          // Removed orderBy to avoid index error
        );
        
        const querySnapshot = await getDocs(q);
        const repliesData: Reply[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          repliesData.push({
            id: doc.id,
            enquiry_id: data.enquiry_id,
            admin_id: data.admin_id,
            admin_name: data.admin_name,
            message: data.message,
            created_at: data.created_at instanceof Timestamp 
              ? data.created_at.toDate().toISOString()
              : data.created_at
          });
        });
        
        // ✅ NEW: Update enquiry statuses based on replies
        for (const enquiry of enquiries) {
          const hasReply = repliesData.some(reply => reply.enquiry_id === enquiry.id);
          if (hasReply && enquiry.status !== 'responded') {
            // Update in Firebase
            try {
              const enquiryRef = doc(db, 'inquiries', enquiry.id);
              await updateDoc(enquiryRef, {
                status: 'responded',
                responded_at: Timestamp.now()
              });
              
              // Update local state
              setEnquiries(prev => prev.map(e => 
                e.id === enquiry.id 
                  ? { ...e, status: 'responded', responded_at: new Date().toISOString() }
                  : e
              ));
            } catch (err) {
              console.error(`Error updating enquiry ${enquiry.id}:`, err);
            }
          }
        }
        
        // Sort by date on client side (newest first)
        repliesData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setAllReplies(repliesData);
      } else {
        // Fallback: For more than 10 enquiries, fetch one by one
        const repliesData: Reply[] = [];
        
        for (const enquiryId of userEnquiryIds) {
          try {
            const q = query(
              repliesRef,
              where('enquiry_id', '==', enquiryId)
              // Removed orderBy to avoid index error
            );
            
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              repliesData.push({
                id: doc.id,
                enquiry_id: data.enquiry_id,
                admin_id: data.admin_id,
                admin_name: data.admin_name,
                message: data.message,
                created_at: data.created_at instanceof Timestamp 
                  ? data.created_at.toDate().toISOString()
                  : data.created_at
              });
            });
            
            // ✅ NEW: Update enquiry status if it has replies
            if (querySnapshot.size > 0) {
              try {
                const enquiryRef = doc(db, 'inquiries', enquiryId);
                await updateDoc(enquiryRef, {
                  status: 'responded',
                  responded_at: Timestamp.now()
                });
                
                setEnquiries(prev => prev.map(e => 
                  e.id === enquiryId 
                    ? { ...e, status: 'responded', responded_at: new Date().toISOString() }
                    : e
                ));
              } catch (err) {
                console.error(`Error updating enquiry ${enquiryId}:`, err);
              }
            }
          } catch (err) {
            console.error(`Error fetching replies for enquiry ${enquiryId}:`, err);
          }
        }
        
        // Sort by date on client side (newest first)
        repliesData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setAllReplies(repliesData);
      }
    } catch (err) {
      console.error('Error fetching all replies:', err);
      
      // Final fallback: fetch all replies and filter client-side
      try {
        const repliesRef = collection(db, 'inquiry_replies');
        const q = query(repliesRef); // No orderBy
        
        const querySnapshot = await getDocs(q);
        const repliesData: Reply[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const reply = {
            id: doc.id,
            enquiry_id: data.enquiry_id,
            admin_id: data.admin_id,
            admin_name: data.admin_name,
            message: data.message,
            created_at: data.created_at instanceof Timestamp 
              ? data.created_at.toDate().toISOString()
              : data.created_at
          };
          
          // Filter client-side to only include replies for user's enquiries
          if (enquiries.some(enquiry => enquiry.id === reply.enquiry_id)) {
            repliesData.push(reply);
          }
        });
        
        // ✅ NEW: Update enquiry statuses based on replies
        for (const enquiry of enquiries) {
          const hasReply = repliesData.some(reply => reply.enquiry_id === enquiry.id);
          if (hasReply && enquiry.status !== 'responded') {
            setEnquiries(prev => prev.map(e => 
              e.id === enquiry.id 
                ? { ...e, status: 'responded', responded_at: new Date().toISOString() }
                : e
            ));
          }
        }
        
        // Sort on client side
        repliesData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setAllReplies(repliesData);
      } catch (err2) {
        console.error('Error in fallback reply fetch:', err2);
        setAllReplies([]);
      }
    } finally {
      setLoadingReplies(false);
    }
  }

  // Load replies when switching to replies tab
  useEffect(() => {
    if (activeTab === 'replies' && enquiries.length > 0) {
      fetchAllReplies()
    }
  }, [activeTab, enquiries.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!formData.email.trim()) {
      setError('Please enter your email')
      return
    }
    if (!formData.subject.trim()) {
      setError('Please enter subject')
      return
    }
    if (!formData.message.trim()) {
      setError('Please enter message')
      return
    }
    
    setLoading(true)

    try {
      // Create enquiry data object
      const enquiryData: any = {
        property_id: null,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '',
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: 'pending',
        category: formData.category,
        created_at: Timestamp.now(),
        // IMPORTANT: Always add user_id when user is logged in
        user_id: user?.id || null
      }

      console.log('Current user when submitting:', user)
      if (user && user.id) {
        enquiryData.user_id = user.id
        console.log('Adding user_id:', user.id)
      } else {
        console.log('No user_id added - user not logged in or no id')
      }

      console.log('Saving enquiry data:', enquiryData)
      
      const docRef = await addDoc(collection(db, 'inquiries'), enquiryData)
      console.log('Enquiry saved with ID:', docRef.id)

      setSuccess(true)
      setFormData({
        name: '',
        email: user?.email || '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      })

      setTimeout(() => {
        setActiveTab('history')
        setSuccess(false)
      }, 2000)

    } catch (err: any) {
      console.error('Error saving to Firebase:', err)
      console.error('Error details:', err.message, err.code)
      setError(`Enquiry submit nahi ho saka: ${err.message || 'Unknown error'}`)
    }

    setLoading(false)
  }

  // Delete enquiry function
  const handleDeleteEnquiry = async (enquiryId: string) => {
    if (!user) return
    
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return
    }
    
    setDeleteLoading(enquiryId)
    
    try {
      await deleteDoc(doc(db, 'inquiries', enquiryId))
      // Also delete related replies
      const repliesRef = collection(db, 'inquiry_replies')
      const q = query(repliesRef, where('enquiry_id', '==', enquiryId))
      const snapshot = await getDocs(q)
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      
    } catch (err) {
      console.error('Error deleting enquiry:', err)
      setError('Enquiry delete nahi ho saka. Please try again.')
    } finally {
      setDeleteLoading(null)
    }
  }

  // Setup edit form
  const handleEditClick = (enquiry: Enquiry) => {
    setEditingEnquiry(enquiry.id)
    setEditFormData({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      subject: enquiry.subject,
      message: enquiry.message,
      category: enquiry.category || 'general'
    })
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update enquiry function
  const handleUpdateEnquiry = async (enquiryId: string) => {
    if (!user) return
    
    // Validation
    if (!editFormData.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!editFormData.email.trim()) {
      setError('Please enter your email')
      return
    }
    if (!editFormData.subject.trim()) {
      setError('Please enter subject')
      return
    }
    if (!editFormData.message.trim()) {
      setError('Please enter message')
      return
    }
    
    try {
      const updateData: any = {
        name: editFormData.name.trim(),
        email: editFormData.email.trim(),
        phone: editFormData.phone.trim() || '',
        subject: editFormData.subject.trim(),
        message: editFormData.message.trim(),
        category: editFormData.category,
        status: 'pending', // Reset status when edited
        updated_at: Timestamp.now(),
        // Keep user_id when updating
        user_id: user?.id || null
      }

      await updateDoc(doc(db, 'inquiries', enquiryId), updateData)
      
      setEditingEnquiry(null)
      setError('')
    } catch (err) {
      console.error('Error updating enquiry:', err)
      setError('Enquiry update nahi ho saka. Please try again.')
    }
  }

  const cancelEdit = () => {
    setEditingEnquiry(null)
    setError('')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'responded':
        return 'Responded'
      case 'pending':
        return 'Pending'
      default:
        return 'Sent'
    }
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

  // Get enquiry by ID
  const getEnquiryById = (enquiryId: string) => {
    return enquiries.find(enquiry => enquiry.id === enquiryId)
  }

  // Get replies count for an enquiry
  const getReplyCount = (enquiryId: string) => {
    return allReplies.filter(reply => reply.enquiry_id === enquiryId).length
  }

  // Get replies for specific enquiry
  const getRepliesForEnquiry = (enquiryId: string) => {
    return allReplies
      .filter(reply => reply.enquiry_id === enquiryId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  // ✅ NEW: Calculate enquiry stats
  const getEnquiryStats = () => {
    const total = enquiries.length;
    const responded = enquiries.filter(e => e.status === 'responded').length;
    const pending = enquiries.filter(e => e.status === 'pending').length;
    
    return { total, responded, pending };
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-serif text-secondary">Enquiry Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll get back to you within 24 hours with a response.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                setActiveTab('history')
              }}
              className="mt-6 w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
            >
              View My Enquiries
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
                <h1 className="text-2xl font-serif text-secondary">My Inquiries</h1>
                <p className="text-sm text-slate-500">View and manage your property enquiries</p>
              </div>
            </div>
            {enquiries.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Live Updates Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ NEW: Inquiry Stats Section */}
      {activeTab === 'history' && enquiries.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Total Inquiries Card */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-base font-medium text-slate-600">Total Inquiries</p>
                      <p className="text-4xl font-bold text-secondary">{getEnquiryStats().total}</p>
                      <p className="text-xs text-slate-400">All your property inquiries</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <DocumentTextIcon className="h-10 w-10 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Responded Card */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-base font-medium text-slate-600">Responded</p>
                      <p className="text-4xl font-bold text-green-600">
                        {getEnquiryStats().responded}
                      </p>
                      <p className="text-xs text-slate-400">With admin responses</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl">
                      <CheckCircleIcon className="h-10 w-10 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Pending Card */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-base font-medium text-slate-600">Pending</p>
                      <p className="text-4xl font-bold text-yellow-600">
                        {getEnquiryStats().pending}
                      </p>
                      <p className="text-xs text-slate-400">Awaiting response</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-2xl">
                      <ClockIcon className="h-10 w-10 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                My Inquiries
              </button>
              <button
                onClick={() => setActiveTab('replies')}
                className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'replies'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Admin Replies
              </button>
              <button
                onClick={() => setActiveTab('ask')}
                className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'ask'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Ask a Question
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'history' ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-serif text-secondary">Inquiry History</h2>
                  <button
                    onClick={() => setActiveTab('ask')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                    New Inquiry
                  </button>
                </div>

                {loadingEnquiries ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-slate-200 rounded-2xl"></div>
                      </div>
                    ))}
                  </div>
                ) : enquiries.length > 0 ? (
                  <div className="space-y-6">
                    {enquiries.map((enquiry) => (
                      <div key={enquiry.id} id={`enquiry-${enquiry.id}`} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-primary/50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {getStatusIcon(enquiry.status)}
                            <div>
                              <h3 className="font-bold text-secondary">
                                {enquiry.subject}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {enquiry.property 
                                  ? `${enquiry.property.location} • ${enquiry.property.price?.toLocaleString()} ${enquiry.property.currency}`
                                  : enquiry.category ? `${enquiry.category.charAt(0).toUpperCase() + enquiry.category.slice(1)}` : 'General Question'}
                              </p>
                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <UserIcon className="h-3 w-3" />
                                  {enquiry.name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <EnvelopeIcon className="h-3 w-3" />
                                  {enquiry.email}
                                </span>
                                {enquiry.phone && (
                                  <span className="flex items-center gap-1">
                                    <PhoneIcon className="h-3 w-3" />
                                    {enquiry.phone}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {formatDate(enquiry.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className={`text-sm font-bold ${
                                enquiry.status === 'responded' ? 'text-green-600' :
                                enquiry.status === 'pending' ? 'text-blue-600' : 'text-slate-600'
                              }`}>
                                {getStatusText(enquiry.status)}
                                {enquiry.status === 'responded' && getReplyCount(enquiry.id) > 0 && (
                                  <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                    {getReplyCount(enquiry.id)} {getReplyCount(enquiry.id) === 1 ? 'reply' : 'replies'}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {formatDate(enquiry.created_at)}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-1">
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditClick(enquiry)}
                                className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Edit enquiry"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteEnquiry(enquiry.id)}
                                disabled={deleteLoading === enquiry.id}
                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                title="Delete enquiry"
                              >
                                {deleteLoading === enquiry.id ? (
                                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                ) : (
                                  <TrashIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Edit Form */}
                        {editingEnquiry === enquiry.id ? (
                          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-blue-800">Edit Inquiry</h4>
                              <button
                                onClick={cancelEdit}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Cancel edit"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Your Name *
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.name}
                                  onChange={handleEditInputChange}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email *
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  value={editFormData.email}
                                  onChange={handleEditInputChange}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Phone
                                </label>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={editFormData.phone}
                                  onChange={handleEditInputChange}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Subject *
                                </label>
                                <input
                                  type="text"
                                  name="subject"
                                  value={editFormData.subject}
                                  onChange={handleEditInputChange}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Category
                                </label>
                                <select
                                  name="category"
                                  value={editFormData.category}
                                  onChange={handleEditInputChange}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="general">General Inquiry</option>
                                  <option value="property">Property Information</option>
                                  <option value="valuation">Property Valuation</option>
                                  <option value="investment">Investment Advice</option>
                                  <option value="legal">Legal Questions</option>
                                  <option value="financing">Financing</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Message *
                                </label>
                                <textarea
                                  name="message"
                                  rows={3}
                                  value={editFormData.message}
                                  onChange={handleEditInputChange}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              
                              {error && (
                                <div className="text-sm text-red-600">
                                  {error}
                                </div>
                              )}
                              
                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleUpdateEnquiry(enquiry.id)}
                                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                  Update Inquiry
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Normal Display */
                          <>
                            <div className="mb-4">
                              <div className="bg-white p-4 rounded-lg border">
                                <p className="text-slate-600 text-sm leading-relaxed">{enquiry.message}</p>
                              </div>
                            </div>

                            {/* Display Replies for this enquiry */}
                            {getReplyCount(enquiry.id) > 0 && (
                              <div className="mb-4">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                      <span className="font-bold text-green-800">
                                        {getReplyCount(enquiry.id)} {getReplyCount(enquiry.id) === 1 ? 'Reply' : 'Replies'} Received
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => setActiveTab('replies')}
                                      className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
                                    >
                                      View All Replies
                                      <ArrowRightIcon className="h-3 w-3" />
                                    </button>
                                  </div>
                                  
                                  {/* Show latest reply preview */}
                                  {getRepliesForEnquiry(enquiry.id).slice(0, 1).map((reply, index) => (
                                    <div key={index} className="mt-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                          <UserIcon className="h-3 w-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-green-700">{reply.admin_name}</span>
                                        <span className="text-xs text-green-500">{formatDate(reply.created_at)}</span>
                                      </div>
                                      <p className="text-sm text-green-600 line-clamp-2">
                                        {reply.message}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {enquiry.status === 'responded' && getReplyCount(enquiry.id) === 0 && (
                              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                  <span className="font-bold text-green-800">Response Received</span>
                                </div>
                                <p className="text-sm text-green-600">
                                  Our team has responded to your inquiry.
                                  {enquiry.responded_at && ` Responded on ${formatDate(enquiry.responded_at)}.`}
                                </p>
                              </div>
                            )}

                            {enquiry.status === 'pending' && (
                              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-5 w-5 text-blue-600" />
                                  <span className="font-bold text-blue-800">Awaiting Response</span>
                                </div>
                                <p className="text-sm text-blue-600 mt-1">
                                  We're reviewing your inquiry and will get back to you within 24 hours.
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-secondary mb-2">No inquiries yet</h3>
                    <p className="text-slate-500 mb-6">Have questions about properties or our services? We're here to help.</p>
                    <button
                      onClick={() => setActiveTab('ask')}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all"
                    >
                      Ask a Question
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : activeTab === 'replies' ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-serif text-secondary">Admin Replies</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      All responses from our team to your inquiries
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('history')}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-secondary font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Back to Inquiries
                    </button>
                    <button
                      onClick={() => setActiveTab('ask')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
                    >
                      <PlusIcon className="h-5 w-5" />
                      New Inquiry
                    </button>
                  </div>
                </div>

                {loadingReplies ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading replies...</p>
                  </div>
                ) : allReplies.length > 0 ? (
                  <div className="space-y-6">
                    {allReplies.map((reply) => {
                      const enquiry = getEnquiryById(reply.enquiry_id)
                      return (
                        <div key={reply.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="font-bold text-secondary text-lg flex items-center gap-2">
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                Reply from Admin
                              </h3>
                              {enquiry && (
                                <div className="mt-2">
                                  <p className="text-sm text-slate-600">
                                    <span className="font-medium">Regarding:</span> {enquiry.subject}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Your Inquiry: {formatDate(enquiry.created_at)}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                                <UserIcon className="h-4 w-4" />
                                {reply.admin_name}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {formatDate(reply.created_at)}
                              </div>
                            </div>
                          </div>

                          {/* Reply Message - Highlighted Section */}
                          <div className="bg-white rounded-xl p-4 border border-green-100 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 text-green-600" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-green-800">{reply.admin_name}</span>
                                  <span className="text-xs text-green-600">
                                    {formatDate(reply.created_at)}
                                  </span>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                  <p className="text-slate-700 leading-relaxed">
                                    {reply.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Original Inquiry Summary */}
                          {enquiry && (
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                              <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <DocumentTextIcon className="h-4 w-4" />
                                Your Original Inquiry
                              </h4>
                              <div className="text-sm text-slate-600">
                                <p className="font-medium mb-1">{enquiry.subject}</p>
                                <p className="text-slate-500">{enquiry.message.substring(0, 150)}...</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {formatDate(enquiry.created_at)}
                                  </span>
                                  {enquiry.category && (
                                    <span className="px-2 py-0.5 bg-slate-200 rounded-full">
                                      {enquiry.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )

                          }

                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => {
                                setActiveTab('history')
                                // Scroll to the specific enquiry
                                setTimeout(() => {
                                  const element = document.getElementById(`enquiry-${reply.enquiry_id}`)
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' })
                                  }
                                }, 100)
                              }}
                              className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-800 font-medium"
                            >
                              View Full Inquiry
                              <ArrowRightIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 max-w-2xl mx-auto">
                      <ChatBubbleLeftRightIcon className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-secondary mb-2">No replies yet</h3>
                      <p className="text-slate-500 mb-4">
                        You haven't received any responses from our team yet.
                        Once we respond to your inquiries, you'll see the replies here.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => setActiveTab('history')}
                          className="px-6 py-3 border border-slate-200 text-secondary font-bold rounded-xl hover:bg-slate-50 transition-all"
                        >
                          View My Inquiries
                        </button>
                        <button
                          onClick={() => setActiveTab('ask')}
                          className="px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
                        >
                          <PlusIcon className="h-5 w-5 inline mr-2" />
                          Ask a New Question
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-serif text-secondary mb-2">Ask Our Experts</h2>
                  <p className="text-slate-500">Get answers to your property-related questions from our experienced team</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter your phone number (optional)"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Brief description of your question"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="property">Property Information</option>
                      <option value="valuation">Property Valuation</option>
                      <option value="investment">Investment Advice</option>
                      <option value="legal">Legal Questions</option>
                      <option value="financing">Financing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Please provide details about your question..."
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}

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
                          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Inquiry'
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