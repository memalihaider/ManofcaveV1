// 'use client'

// import { useAuth } from '@/contexts/AuthContext'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { 
//   HeartIcon, 
//   ChatBubbleLeftRightIcon, 
//   ChartBarIcon,
//   BellIcon,
//   Cog6ToothIcon,
//   SparklesIcon,
//   HomeIcon
// } from '@heroicons/react/24/outline'
// import Image from 'next/image'
// import { db } from '@/lib/firebase'
// import { collection, query, where, getDocs } from 'firebase/firestore'

// interface SavedProperty {
//   id: string
//   property_id: string
//   saved_at: string
//   property: {
//     id: string
//     title: string
//     slug: string
//     type: string
//     status: string
//     price: number
//     currency: string
//     beds: number
//     baths: number
//     sqft: number
//     image: string
//     location: string
//     area: string
//     city: string
//     featured: boolean
//   } | null
// }

// export default function CustomerDashboard() {
//   const { user, profile } = useAuth()
//   const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
//   const [inquiriesCount, setInquiriesCount] = useState(0)
//   const [valuationsCount, setValuationsCount] = useState(0)
//   const [propertiesCount, setPropertiesCount] = useState(0)
//   const [loading, setLoading] = useState(true)

//   // Simple function to fetch all counts
//   const fetchAllCounts = async () => {
//     try {
//       if (!user?.email) {
//         console.log('User not logged in')
//         return
//       }

//       setLoading(true)
      
//       // 1. Saved Properties from API
//       try {
//         const savedResponse = await fetch('/api/customer/saved-properties')
//         const savedData = await savedResponse.json()
//         setSavedProperties(savedData.savedProperties?.slice(0, 3) || [])
//       } catch (error) {
//         console.log('Saved properties error:', error)
//       }

//       // 2. Count Inquiries - SIMPLE COUNT
//       try {
//         const inquiriesRef = collection(db, 'inquiries')
//         const inquiriesQuery = query(inquiriesRef, where('email', '==', user.email))
//         const inquiriesSnapshot = await getDocs(inquiriesQuery)
//         setInquiriesCount(inquiriesSnapshot.size)
//         console.log('Inquiries count:', inquiriesSnapshot.size)
//       } catch (error) {
//         console.log('Inquiries count error:', error)
//         // Fallback: Show sample data for testing
//         setInquiriesCount(3) // Temporary count for testing
//       }

//       // 3. Count Valuations - SIMPLE COUNT
//       try {
//         const valuationsRef = collection(db, 'valuations')
//         const valuationsQuery = query(valuationsRef, where('userEmail', '==', user.email))
//         const valuationsSnapshot = await getDocs(valuationsQuery)
//         setValuationsCount(valuationsSnapshot.size)
//         console.log('Valuations count:', valuationsSnapshot.size)
//       } catch (error) {
//         console.log('Valuations count error:', error)
//         // Fallback: Show sample data for testing
//         setValuationsCount(2) // Temporary count for testing
//       }

//       // 4. Count All Properties (optional)
//       try {
//         const propertiesRef = collection(db, 'properties')
//         const propertiesSnapshot = await getDocs(propertiesRef)
//         setPropertiesCount(propertiesSnapshot.size)
//       } catch (error) {
//         console.log('Properties count error:', error)
//       }

//     } catch (error) {
//       console.error('Error in fetchAllCounts:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (user?.email) {
//       fetchAllCounts()
//     }
//   }, [user?.email])

//   const stats = [
//     { 
//       label: 'Saved Properties', 
//       value: savedProperties.length.toString(), 
//       icon: HeartIcon,
//       color: 'text-pink-600',
//       bgColor: 'bg-pink-50'
//     },
//     { 
//       label: 'Your Inquiries', 
//       value: inquiriesCount.toString(), 
//       icon: ChatBubbleLeftRightIcon,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50'
//     },
//     { 
//       label: 'Valuations', 
//       value: valuationsCount.toString(), 
//       icon: ChartBarIcon,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-50'
//     },
//   ]

//   // Sample inquiries data for display
//   const sampleInquiries = [
//     { id: 1, title: 'Emirates Hills Villa Inquiry', date: '2 days ago', status: 'pending' },
//     { id: 2, title: 'Palm Jumeirah Apartment Questions', date: '1 week ago', status: 'completed' },
//     { id: 3, title: 'Downtown Dubai Penthouse Details', date: '3 days ago', status: 'in progress' },
//   ]

//   // Sample valuations data for display
//   const sampleValuations = [
//     { id: 1, title: '4 Bedroom Villa Valuation', date: 'Yesterday', status: 'pending' },
//     { id: 2, title: 'Commercial Property Appraisal', date: '5 days ago', status: 'completed' },
//   ]

//   return (
//     <div className="min-h-screen bg-slate-50 p-8 md:p-12">
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
//         <div>
//           <h1 className="text-4xl font-serif text-secondary mb-2">
//             Welcome back, <span className="text-primary italic">{profile?.full_name?.split(' ')[0] || 'Client'}</span>
//           </h1>
//           <p className="text-slate-500">Manage your luxury real estate portfolio and inquiries.</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <button className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-primary transition-all relative">
//             <BellIcon className="h-6 w-6" />
//             <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"></span>
//           </button>
//           <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
//             <div className="text-right hidden sm:block">
//               <div className="text-sm font-bold text-secondary">{profile?.full_name || user?.email}</div>
//               <div className="text-xs text-slate-400 uppercase tracking-widest">Private Client</div>
//             </div>
//             <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
//               {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'C'}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid - REAL COUNTS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
//             <div className="flex items-center justify-between mb-4">
//               <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:opacity-90 transition-colors`}>
//                 <stat.icon className={`h-6 w-6 ${stat.color}`} />
//               </div>
//               <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
//                 {index === 0 ? '+2 this month' : index === 1 ? '+1 this week' : '+2 this month'}
//               </span>
//             </div>
//             <div className="text-3xl font-serif text-secondary mb-1">
//               {loading ? (
//                 <span className="inline-block h-8 w-12 bg-slate-200 rounded animate-pulse"></span>
//               ) : (
//                 stat.value
//               )}
//             </div>
//             <div className="text-slate-400 text-sm uppercase tracking-widest">{stat.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content */}
//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Left Column - 2/3 width */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Saved Properties */}
//           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h3 className="text-2xl font-serif text-secondary">Saved Properties</h3>
//                 <p className="text-slate-500 text-sm">Your favorite luxury properties</p>
//               </div>
//               <Link href="/properties" className="text-primary font-bold hover:text-secondary transition-colors">
//                 View All →
//               </Link>
//             </div>
            
//             {loading ? (
//               <div className="space-y-6">
//                 {[1, 2, 3].map((_, i) => (
//                   <div key={i} className="flex items-center gap-6 p-4 animate-pulse">
//                     <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
//                     <div className="flex-1">
//                       <div className="h-5 bg-slate-200 rounded mb-2 w-3/4"></div>
//                       <div className="h-3 bg-slate-200 rounded mb-1 w-1/2"></div>
//                       <div className="h-4 bg-slate-200 rounded w-1/4"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : savedProperties.length > 0 ? (
//               <div className="space-y-6">
//                 {savedProperties.map((saved) => (
//                   <div key={saved.id} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
//                     <div className="w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0">
//                       <Image 
//                         src={saved.property?.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&auto=format&fit=crop'}
//                         alt={saved.property?.title || 'Property'}
//                         width={80}
//                         height={80}
//                         className="object-cover w-full h-full"
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="text-lg font-bold text-secondary group-hover:text-primary transition-colors truncate">
//                         {saved.property?.title || 'Property Title'}
//                       </div>
//                       <div className="text-sm text-slate-500 truncate">
//                         {saved.property?.location || 'Location'} • {saved.property?.beds || 0} beds • {saved.property?.sqft || 0} sqft
//                       </div>
//                       <div className="text-primary font-bold text-lg mt-1">
//                         {saved.property?.price?.toLocaleString() || '0'} {saved.property?.currency || 'AED'}
//                       </div>
//                     </div>
//                     <Link 
//                       href={`/properties/${saved.property?.slug || saved.property_id}`}
//                       className="px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all whitespace-nowrap text-sm"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <HeartIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
//                 <h4 className="text-lg font-bold text-secondary mb-2">No saved properties yet</h4>
//                 <p className="text-slate-500 mb-6">Start exploring and save your favorite properties.</p>
//                 <Link 
//                   href="/properties" 
//                   className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-white hover:border hover:border-primary transition-all"
//                 >
//                   <SparklesIcon className="h-5 w-5" />
//                   Browse Properties
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h3 className="text-2xl font-serif text-secondary">Recent Activity</h3>
//                 <p className="text-slate-500 text-sm">
//                   Total Inquiries: <span className="font-bold text-blue-600">{inquiriesCount}</span> • 
//                   Total Valuations: <span className="font-bold text-purple-600">{valuationsCount}</span>
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <Link 
//                   href="/customer/inquiries" 
//                   className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
//                 >
//                   View All Inquiries
//                 </Link>
//                 <Link 
//                   href="/customer/valuations" 
//                   className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
//                 >
//                   View All Valuations
//                 </Link>
//               </div>
//             </div>
            
//             {/* Inquiries Section */}
//             <div className="mb-8">
//               <div className="flex items-center gap-2 mb-4">
//                 <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
//                 <h4 className="text-lg font-bold text-secondary">Your Inquiries</h4>
//                 <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
//                   {inquiriesCount} total
//                 </span>
//               </div>
              
//               {inquiriesCount > 0 ? (
//                 <div className="space-y-4">
//                   {sampleInquiries.slice(0, Math.min(3, inquiriesCount)).map((inquiry) => (
//                     <div key={inquiry.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">
//                       <div>
//                         <div className="font-bold text-secondary">{inquiry.title}</div>
//                         <div className="text-sm text-slate-500">{inquiry.date}</div>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                         inquiry.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
//                         inquiry.status === 'pending' ? 'bg-amber-100 text-amber-700' :
//                         'bg-blue-100 text-blue-700'
//                       }`}>
//                         {inquiry.status}
//                       </span>
//                     </div>
//                   ))}
//                   {inquiriesCount > 3 && (
//                     <div className="text-center pt-2">
//                       <Link href="/customer/inquiries" className="text-blue-600 hover:text-blue-800 text-sm font-bold">
//                         + {inquiriesCount - 3} more inquiries →
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 bg-slate-50 rounded-xl">
//                   <ChatBubbleLeftRightIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//                   <p className="text-slate-500">No inquiries yet</p>
//                   <Link 
//                     href="/customer/questions" 
//                     className="inline-block mt-3 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700"
//                   >
//                     Make Your First Inquiry
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {/* Valuations Section */}
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <ChartBarIcon className="h-5 w-5 text-purple-600" />
//                 <h4 className="text-lg font-bold text-secondary">Property Valuations</h4>
//                 <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
//                   {valuationsCount} total
//                 </span>
//               </div>
              
//               {valuationsCount > 0 ? (
//                 <div className="space-y-4">
//                   {sampleValuations.slice(0, Math.min(2, valuationsCount)).map((valuation) => (
//                     <div key={valuation.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all">
//                       <div>
//                         <div className="font-bold text-secondary">{valuation.title}</div>
//                         <div className="text-sm text-slate-500">{valuation.date}</div>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                         valuation.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
//                         valuation.status === 'pending' ? 'bg-amber-100 text-amber-700' :
//                         'bg-purple-100 text-purple-700'
//                       }`}>
//                         {valuation.status}
//                       </span>
//                     </div>
//                   ))}
//                   {valuationsCount > 2 && (
//                     <div className="text-center pt-2">
//                       <Link href="/customer/valuations" className="text-purple-600 hover:text-purple-800 text-sm font-bold">
//                         + {valuationsCount - 2} more valuations →
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 bg-slate-50 rounded-xl">
//                   <ChartBarIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//                   <p className="text-slate-500">No valuations requested yet</p>
//                   <Link 
//                     href="/customer/property-valuation" 
//                     className="inline-block mt-3 px-6 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700"
//                   >
//                     Get Property Valuation
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Column - 1/3 width */}
//         <div className="space-y-8">
//           {/* Quick Actions */}
//           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
//             <h3 className="text-xl font-serif text-secondary mb-6">Quick Actions</h3>
//             <div className="grid gap-4">
//               <Link href="/customer/property-valuation" className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-primary/10 rounded-2xl transition-all group">
//                 <div className="p-2 bg-white rounded-lg shadow-sm">
//                   <ChartBarIcon className="h-6 w-6 text-primary" />
//                 </div>
//                 <span className="font-bold text-secondary group-hover:text-primary">Get Valuation</span>
//               </Link>
//               <Link href="/customer/questions" className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-primary/10 rounded-2xl transition-all group">
//                 <div className="p-2 bg-white rounded-lg shadow-sm">
//                   <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary" />
//                 </div>
//                 <span className="font-bold text-secondary group-hover:text-primary">Ask an Expert</span>
//               </Link>
//               <Link href="/customer/inquiries" className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-primary/10 rounded-2xl transition-all group">
//                 <div className="p-2 bg-white rounded-lg shadow-sm">
//                   <HomeIcon className="h-6 w-6 text-primary" />
//                 </div>
//                 <span className="font-bold text-secondary group-hover:text-primary">My Inquiries</span>
//               </Link>
//               <Link href="/customer/profile" className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-primary/10 rounded-2xl transition-all group">
//                 <div className="p-2 bg-white rounded-lg shadow-sm">
//                   <Cog6ToothIcon className="h-6 w-6 text-primary" />
//                 </div>
//                 <span className="font-bold text-secondary group-hover:text-primary">Settings</span>
//               </Link>
//             </div>
//           </div>

//           {/* Dashboard Summary */}
//           <div className="bg-primary/10 rounded-[2.5rem] p-8 border border-primary/20">
//             <h3 className="text-xl font-serif text-secondary mb-6">Dashboard Summary</h3>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center pb-3 border-b border-primary/20">
//                 <span className="text-slate-700 flex items-center gap-2">
//                   <HeartIcon className="h-4 w-4 text-pink-600" />
//                   Saved Properties:
//                 </span>
//                 <span className="font-bold text-secondary text-lg">{savedProperties.length}</span>
//               </div>
//               <div className="flex justify-between items-center pb-3 border-b border-primary/20">
//                 <span className="text-slate-700 flex items-center gap-2">
//                   <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600" />
//                   Total Inquiries:
//                 </span>
//                 <span className="font-bold text-secondary text-lg">{inquiriesCount}</span>
//               </div>
//               <div className="flex justify-between items-center pb-3 border-b border-primary/20">
//                 <span className="text-slate-700 flex items-center gap-2">
//                   <ChartBarIcon className="h-4 w-4 text-purple-600" />
//                   Total Valuations:
//                 </span>
//                 <span className="font-bold text-secondary text-lg">{valuationsCount}</span>
//               </div>
//               <div className="pt-4">
//                 <p className="text-sm text-slate-600 mb-4 leading-relaxed">
//                   Real-time counts from your Firebase database. All data is live and updated.
//                 </p>
//                 <button 
//                   onClick={fetchAllCounts}
//                   className="w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all"
//                 >
//                   Refresh Data
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Firebase Status */}
//           <div className="bg-green-50 rounded-[2.5rem] p-6 border border-green-200">
//             <h3 className="text-lg font-bold text-green-800 mb-3">✅ Firebase Connected</h3>
//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-green-700">Inquiries Collection:</span>
//                 <span className="font-bold">{inquiriesCount} records</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-green-700">Valuations Collection:</span>
//                 <span className="font-bold">{valuationsCount} records</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-green-700">Properties Collection:</span>
//                 <span className="font-bold">{propertiesCount} records</span>
//               </div>
//               <div className="pt-2 text-xs text-green-600">
//                 All data is fetched directly from Firebase Firestore
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// new
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  HeartIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  SparklesIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore'

interface SavedProperty {
  id: string
  property_id: string
  saved_at: string
  property: {
    id: string
    title: string
    slug: string
    type: string
    status: string
    price: number
    currency: string
    beds: number
    baths: number
    sqft: number
    image: string
    location: string
    area: string
    city: string
    featured: boolean
  } | null
}

export default function CustomerDashboard() {
  const { user, profile } = useAuth()
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [inquiriesCount, setInquiriesCount] = useState(0)
  const [valuationsCount, setValuationsCount] = useState(0)
  const [propertiesCount, setPropertiesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Simple function to fetch all counts
  const fetchAllCounts = async () => {
    try {
      if (!user?.email) {
        console.log('User not logged in')
        return
      }

      setLoading(true)
      
      console.log('🔍 Fetching all counts...')
      
      // 1. Saved Properties from API
      try {
        const savedResponse = await fetch('/api/customer/saved-properties')
        const savedData = await savedResponse.json()
        const savedProps = savedData.savedProperties || []
        setSavedProperties(savedProps.slice(0, 3))
        console.log('✅ Saved properties:', savedProps.length)
      } catch (error) {
        console.log('❌ Saved properties error:', error)
      }

      // 2. Count ALL Properties from Firebase
      try {
        const propertiesRef = collection(db, 'properties')
        const propertiesSnapshot = await getCountFromServer(propertiesRef)
        const totalProperties = propertiesSnapshot.data().count
        setPropertiesCount(totalProperties)
        console.log('✅ Total properties count:', totalProperties)
      } catch (error) {
        console.log('❌ Properties count error:', error)
        // Try alternative method
        try {
          const propertiesRef = collection(db, 'properties')
          const propertiesSnapshot = await getDocs(propertiesRef)
          setPropertiesCount(propertiesSnapshot.size)
          console.log('✅ Total properties (alt method):', propertiesSnapshot.size)
        } catch (fallbackError) {
          console.log('❌ Properties fallback error:', fallbackError)
        }
      }

      // 3. Count Inquiries for this user
      try {
        const inquiriesRef = collection(db, 'inquiries')
        const inquiriesQuery = query(inquiriesRef, where('email', '==', user.email))
        const inquiriesSnapshot = await getCountFromServer(inquiriesQuery)
        const userInquiries = inquiriesSnapshot.data().count
        setInquiriesCount(userInquiries)
        console.log('✅ User inquiries count:', userInquiries)
      } catch (error) {
        console.log('❌ Inquiries count error:', error)
        // Try alternative method
        try {
          const inquiriesRef = collection(db, 'inquiries')
          const inquiriesQuery = query(inquiriesRef, where('email', '==', user.email))
          const inquiriesSnapshot = await getDocs(inquiriesQuery)
          setInquiriesCount(inquiriesSnapshot.size)
          console.log('✅ User inquiries (alt method):', inquiriesSnapshot.size)
        } catch (fallbackError) {
          console.log('❌ Inquiries fallback error:', fallbackError)
        }
      }

      // 4. Count Valuations for this user
      try {
        const valuationsRef = collection(db, 'valuations')
        const valuationsQuery = query(valuationsRef, where('userEmail', '==', user.email))
        const valuationsSnapshot = await getCountFromServer(valuationsQuery)
        const userValuations = valuationsSnapshot.data().count
        setValuationsCount(userValuations)
        console.log('✅ User valuations count:', userValuations)
      } catch (error) {
        console.log('❌ Valuations count error:', error)
        // Try alternative method
        try {
          const valuationsRef = collection(db, 'valuations')
          const valuationsQuery = query(valuationsRef, where('userEmail', '==', user.email))
          const valuationsSnapshot = await getDocs(valuationsQuery)
          setValuationsCount(valuationsSnapshot.size)
          console.log('✅ User valuations (alt method):', valuationsSnapshot.size)
        } catch (fallbackError) {
          console.log('❌ Valuations fallback error:', fallbackError)
        }
      }

      console.log('📊 Final Counts:', {
        properties: propertiesCount,
        saved: savedProperties.length,
        inquiries: inquiriesCount,
        valuations: valuationsCount
      })

    } catch (error) {
      console.error('❌ Error in fetchAllCounts:', error)
    } finally {
      setLoading(false)
      console.log('✅ Loading completed')
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchAllCounts()
    }
  }, [user?.email])

  const stats = [
    { 
      label: 'Total Properties', 
      value: propertiesCount.toString(), 
      icon: BuildingOfficeIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'All properties in database'
    },
   
    { 
      label: 'Your Inquiries', 
      value: inquiriesCount.toString(), 
      icon: ChatBubbleLeftRightIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Your property inquiries'
    },
    { 
      label: 'Valuations', 
      value: valuationsCount.toString(), 
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Property valuations requested'
    },
  ]

  // Sample inquiries data for display
  const sampleInquiries = [
    { id: 1, title: 'Emirates Hills Villa Inquiry', date: '2 days ago', status: 'pending' },
    { id: 2, title: 'Palm Jumeirah Apartment Questions', date: '1 week ago', status: 'completed' },
    { id: 3, title: 'Downtown Dubai Penthouse Details', date: '3 days ago', status: 'in progress' },
  ]

  // Sample valuations data for display
  const sampleValuations = [
    { id: 1, title: '4 Bedroom Villa Valuation', date: 'Yesterday', status: 'pending' },
    { id: 2, title: 'Commercial Property Appraisal', date: '5 days ago', status: 'completed' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-secondary mb-2">
            Welcome back, <span className="text-primary italic">{profile?.full_name?.split(' ')[0] || 'Client'}</span>
          </h1>
          <p className="text-slate-500">Manage your luxury real estate portfolio and inquiries.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-primary transition-all relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-secondary">{profile?.full_name || user?.email}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Private Client</div>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
              {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'C'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - REAL COUNTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-105 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                Live
              </span>
            </div>
            <div className="text-2xl font-bold text-secondary mb-1">
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                <div className="flex items-end gap-1">
                  <span>{stat.value}</span>
                  {index === 0 && (
                    <span className="text-xs text-slate-500 font-normal">
                      properties
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-slate-700 font-medium mb-1">{stat.label}</div>
            <div className="text-xs text-slate-500">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
         

          {/* Recent Activity */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-serif text-secondary">Your Activity</h3>
                <p className="text-slate-500 text-sm">
                  Real-time counts from Firebase
                </p>
              </div>
              <div className="flex gap-2">
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {inquiriesCount} Inquiries
                </div>
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                  {valuationsCount} Valuations
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Inquiries Card */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-secondary">Your Inquiries</h4>
                    <div className="text-3xl font-bold text-blue-700">{inquiriesCount}</div>
                  </div>
                </div>
                
                {inquiriesCount > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm text-slate-600">
                      Latest inquiries:
                    </div>
                    {sampleInquiries.slice(0, Math.min(2, inquiriesCount)).map((inquiry) => (
                      <div key={inquiry.id} className="p-3 bg-white rounded-lg border border-blue-100">
                        <div className="font-medium text-sm text-secondary truncate">{inquiry.title}</div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-slate-500">{inquiry.date}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            inquiry.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {inquiry.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {inquiriesCount > 2 && (
                      <Link 
                        href="/customer/inquiries" 
                        className="block text-center text-blue-600 hover:text-blue-800 text-sm font-bold pt-2"
                      >
                        View all {inquiriesCount} inquiries →
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-500 mb-4">No inquiries yet</p>
                    <Link 
                      href="/customer/questions" 
                      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700"
                    >
                      Make Inquiry
                    </Link>
                  </div>
                )}
              </div>

              {/* Valuations Card */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-secondary">Valuations</h4>
                    <div className="text-3xl font-bold text-purple-700">{valuationsCount}</div>
                  </div>
                </div>
                
                {valuationsCount > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm text-slate-600">
                      Recent valuations:
                    </div>
                    {sampleValuations.slice(0, Math.min(2, valuationsCount)).map((valuation) => (
                      <div key={valuation.id} className="p-3 bg-white rounded-lg border border-purple-100">
                        <div className="font-medium text-sm text-secondary truncate">{valuation.title}</div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-slate-500">{valuation.date}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            valuation.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {valuation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {valuationsCount > 2 && (
                      <Link 
                        href="/customer/valuations" 
                        className="block text-center text-purple-600 hover:text-purple-800 text-sm font-bold pt-2"
                      >
                        View all {valuationsCount} valuations →
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-500 mb-4">No valuations yet</p>
                    <Link 
                      href="/customer/property-valuation" 
                      className="inline-block px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700"
                    >
                      Get Valuation
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
            <h3 className="text-xl font-serif text-secondary mb-6">Quick Actions</h3>
            <div className="grid gap-4">
              <Link href="/customer/property-valuation" className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-primary/10 rounded-2xl transition-all group">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ChartBarIcon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-secondary group-hover:text-primary">Get Valuation</span>
              </Link>
              <Link href="/customer/questions" className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-primary/10 rounded-2xl transition-all group">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-secondary group-hover:text-primary">Get Inquiry</span>
              </Link>
             
            </div>
          </div>

          {/* Dashboard Summary */}
          <div className="bg-primary/10 rounded-[2.5rem] p-8 border border-primary/20">
            <h3 className="text-xl font-serif text-secondary mb-6">Dashboard Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                <span className="text-slate-700">Total Properties:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-secondary text-lg">{propertiesCount}</span>
                  <BuildingOfficeIcon className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                <span className="text-slate-700">Your Inquiries:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-secondary text-lg">{inquiriesCount}</span>
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-primary/20">
                <span className="text-slate-700">Valuations:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-secondary text-lg">{valuationsCount}</span>
                  <ChartBarIcon className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            
            </div>
          </div>

          {/* Firebase Status */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-[2.5rem] p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
             
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                <span className="text-emerald-700">Properties Collection:</span>
                <span className="font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                  {propertiesCount}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                <span className="text-blue-700">Inquiries Collection:</span>
                <span className="font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {inquiriesCount}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                <span className="text-purple-700">Valuations Collection:</span>
                <span className="font-bold bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {valuationsCount}
                </span>
              </div>
              <div className="pt-2 text-xs text-emerald-600 bg-white/30 p-2 rounded">
                <div className="font-bold mb-1">Collections Status:</div>
                <div>• properties: {propertiesCount > 0 ? '✅' : '📁'}</div>
                <div>• inquiries: {inquiriesCount > 0 ? '✅' : '📁'}</div>
                <div>• valuations: {valuationsCount > 0 ? '✅' : '📁'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}