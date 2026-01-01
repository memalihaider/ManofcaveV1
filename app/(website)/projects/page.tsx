// "use client"

// import Image from 'next/image'
// import { Suspense, useState } from 'react'
// import {
//   BuildingOfficeIcon,
//   MapPinIcon,
//   CurrencyDollarIcon,
//   CalendarIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   WrenchScrewdriverIcon,
//   XMarkIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   UserIcon,
//   SparklesIcon,
//   ArrowRightIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   FunnelIcon,
//   HomeIcon,
//   ShoppingBagIcon,
//   ArrowTrendingUpIcon
// } from '@heroicons/react/24/outline'

// const mockProjects = [
//   {
//     id: '1',
//     name: 'Emaar Beachfront',
//     developer: 'Emaar Properties',
//     developerId: 'emaar',
//     status: 'in-progress',
//     launchDate: '2023-01-15',
//     completionDate: '2026-12-31',
//     city: 'Dubai',
//     area: 'Jumeirah Beach Residence',
//     startingPrice: 2500000,
//     currency: 'AED',
//     totalUnits: 500,
//     availableUnits: 120,
//     propertyTypes: ['Apartment', 'Penthouse'],
//     heroImage: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
//     images: [
//       'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396074/pexels-photo-1396074.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396124/pexels-photo-1396124.jpeg?auto=compress&cs=tinysrgb&w=800'
//     ],
//     description: 'Luxury beachfront development with world-class amenities and private beach access. Featuring smart home technology, infinity pools, and direct marina access.',
//     paymentPlan: '60/40 payment plan with post-handover installments',
//     roi: 'Expected 25-35% capital appreciation',
//     features: ['Private Beach', 'Marina Access', 'Smart Homes', 'Infinity Pools', 'Fitness Center'],
//     location: 'Jumeirah Beach Residence, Dubai',
//     nearby: ['Dubai Marina', 'Jumeirah Beach Park', 'Mall of the Emirates']
//   },
//   {
//     id: '2',
//     name: 'DAMAC Hills',
//     developer: 'DAMAC Properties',
//     developerId: 'damac',
//     status: 'completed',
//     launchDate: '2020-06-01',
//     completionDate: '2024-03-15',
//     city: 'Dubai',
//     area: 'Dubai Hills Estate',
//     startingPrice: 3500000,
//     currency: 'AED',
//     totalUnits: 800,
//     availableUnits: 45,
//     propertyTypes: ['Villa', 'Townhouse'],
//     heroImage: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
//     images: [
//       'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396126/pexels-photo-1396126.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396128/pexels-photo-1396128.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396130/pexels-photo-1396130.jpeg?auto=compress&cs=tinysrgb&w=800'
//     ],
//     description: 'Premium villas and townhouses surrounded by lush greenery and a championship golf course. Perfect for families seeking luxury living.',
//     paymentPlan: '30% down payment with 7-year payment plan',
//     roi: 'Strong rental yields of 6-8% annually',
//     features: ['Golf Course Views', 'Private Gardens', 'Swimming Pools', 'Kids Play Areas', 'Security'],
//     location: 'Dubai Hills Estate, Dubai',
//     nearby: ['Dubai Hills Mall', 'Dubai Miracle Garden', 'Motor City']
//   },
//   {
//     id: '3',
//     name: 'Palm Jumeirah Residences',
//     developer: 'Nakheel Properties',
//     developerId: 'nakheel',
//     status: 'in-progress',
//     launchDate: '2022-09-01',
//     completionDate: '2027-06-30',
//     city: 'Dubai',
//     area: 'Palm Jumeirah',
//     startingPrice: 5000000,
//     currency: 'AED',
//     totalUnits: 300,
//     availableUnits: 85,
//     propertyTypes: ['Apartment', 'Penthouse', 'Villa'],
//     heroImage: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800',
//     images: [
//       'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396136/pexels-photo-1396136.jpeg?auto=compress&cs=tinysrgb&w=800'
//     ],
//     description: 'Exclusive residences on the iconic Palm Jumeirah, offering unparalleled views of the Arabian Gulf.',
//     paymentPlan: '20% down payment with flexible installments',
//     roi: 'Premium location with 20-30% appreciation potential',
//     features: ['Gulf Views', 'Private Beach', 'Concierge Service', 'Spa & Wellness', 'Waterfront Dining'],
//     location: 'Palm Jumeirah, Dubai',
//     nearby: ['Atlantis The Palm', 'Nakheel Mall', 'Dubai Marina']
//   },
//   {
//     id: '4',
//     name: 'Emaar Creek Harbour',
//     developer: 'Emaar Properties',
//     developerId: 'emaar',
//     status: 'in-progress',
//     launchDate: '2024-01-01',
//     completionDate: '2028-12-31',
//     city: 'Dubai',
//     area: 'Dubai Creek Harbour',
//     startingPrice: 1800000,
//     currency: 'AED',
//     totalUnits: 1200,
//     availableUnits: 350,
//     propertyTypes: ['Apartment', 'Townhouse', 'Penthouse'],
//     heroImage: 'https://images.pexels.com/photos/2121287/pexels-photo-2121287.jpeg?auto=compress&cs=tinysrgb&w=800',
//     images: [
//       'https://images.pexels.com/photos/2121287/pexels-photo-2121287.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396138/pexels-photo-1396138.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396140/pexels-photo-1396140.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
//     ],
//     description: 'Mixed-use development combining residential, commercial, and leisure spaces along Dubai Creek.',
//     paymentPlan: '25% down payment with 8-year payment plan',
//     roi: 'High rental demand in business district',
//     features: ['Creek Views', 'Retail Spaces', 'Business Center', 'Waterfront Promenade', 'Metro Access'],
//     location: 'Dubai Creek Harbour, Dubai',
//     nearby: ['Dubai Creek', 'Business Bay', 'Dubai Metro']
//   },
//   {
//     id: '5',
//     name: 'DAMAC Lagoons',
//     developer: 'DAMAC Properties',
//     developerId: 'damac',
//     status: 'in-progress',
//     launchDate: '2023-06-01',
//     completionDate: '2027-09-30',
//     city: 'Dubai',
//     area: 'Akoya Oxygen',
//     startingPrice: 2200000,
//     currency: 'AED',
//     totalUnits: 600,
//     availableUnits: 180,
//     propertyTypes: ['Apartment', 'Villa'],
//     heroImage: 'https://images.pexels.com/photos/4819372/pexels-photo-4819372.jpeg?auto=compress&cs=tinysrgb&w=800',
//     images: [
//       'https://images.pexels.com/photos/4819372/pexels-photo-4819372.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396124/pexels-photo-1396124.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396126/pexels-photo-1396126.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396128/pexels-photo-1396128.jpeg?auto=compress&cs=tinysrgb&w=800'
//     ],
//     description: 'Sustainable waterfront community with lagoons, parks, and eco-friendly design.',
//     paymentPlan: '35% down payment with 6-year payment plan',
//     roi: 'Growing area with strong appreciation potential',
//     features: ['Waterfront Living', 'Eco-Friendly Design', 'Community Parks', 'Bike Paths', 'Smart Technology'],
//     location: 'Akoya Oxygen, Dubai',
//     nearby: ['Dubai South', 'Al Maktoum Airport', 'Dubai Parks & Resorts']
//   },
//   {
//     id: '6',
//     name: 'Nakheel Islands',
//     developer: 'Nakheel Properties',
//     developerId: 'nakheel',
//     status: 'in-progress',
//     launchDate: '2023-03-01',
//     completionDate: '2028-06-30',
//     city: 'Dubai',
//     area: 'Dubai Islands',
//     startingPrice: 3200000,
//     currency: 'AED',
//     totalUnits: 400,
//     availableUnits: 95,
//     propertyTypes: ['Villa', 'Townhouse'],
//     heroImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
//     images: [
//       'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396074/pexels-photo-1396074.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396124/pexels-photo-1396124.jpeg?auto=compress&cs=tinysrgb&w=800',
//       'https://images.pexels.com/photos/1396126/pexels-photo-1396126.jpeg?auto=compress&cs=tinysrgb&w=800'
//     ],
//     description: 'Private island community with luxury villas and exclusive waterfront properties.',
//     paymentPlan: '40% down payment with 5-year payment plan',
//     roi: 'Exclusive location with premium pricing',
//     features: ['Private Island', 'Waterfront Villas', 'Marina Access', 'Beach Club', 'Security'],
//     location: 'Dubai Islands, Dubai',
//     nearby: ['Palm Jumeirah', 'Dubai Marina', 'Jumeirah Beach']
//   }
// ]

// const developers = [
//   { id: 'all', name: 'All Developers', count: mockProjects.length },
//   { id: 'emaar', name: 'Emaar Properties', count: mockProjects.filter(p => p.developerId === 'emaar').length },
//   { id: 'damac', name: 'DAMAC Properties', count: mockProjects.filter(p => p.developerId === 'damac').length },
//   { id: 'nakheel', name: 'Nakheel Properties', count: mockProjects.filter(p => p.developerId === 'nakheel').length }
// ]

// function ProjectsPageContent() {
//   const [selectedDeveloper, setSelectedDeveloper] = useState('all')
//   const [inquiryModal, setInquiryModal] = useState<{ isOpen: boolean; project: typeof mockProjects[0] | null }>({ isOpen: false, project: null })
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     message: ''
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitSuccess, setSubmitSuccess] = useState(false)
//   const [selectedImageIndex, setSelectedImageIndex] = useState<{[key: string]: number}>({})

//   const filteredProjects = selectedDeveloper === 'all' 
//     ? mockProjects 
//     : mockProjects.filter(project => project.developerId === selectedDeveloper)

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
    
//     // Simulate form submission
//     await new Promise(resolve => setTimeout(resolve, 2000))
    
//     setSubmitSuccess(true)
//     setIsSubmitting(false)
    
//     // Reset form after 3 seconds
//     setTimeout(() => {
//       setSubmitSuccess(false)
//       setInquiryModal({ isOpen: false, project: null })
//       setFormData({ name: '', email: '', phone: '', message: '' })
//     }, 3000)
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }))
//   }

//   const handleImageChange = (projectId: string, direction: 'next' | 'prev') => {
//     const currentIndex = selectedImageIndex[projectId] || 0
//     const project = mockProjects.find(p => p.id === projectId)
//     if (!project) return

//     const maxIndex = project.images.length - 1
//     let newIndex

//     if (direction === 'next') {
//       newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1
//     } else {
//       newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1
//     }

//     setSelectedImageIndex(prev => ({
//       ...prev,
//       [projectId]: newIndex
//     }))
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-secondary">
//         <div className="absolute inset-0">
//           <Image 
//             src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
//             alt="Dubai Projects"
//             fill
//             className="object-cover opacity-30"
//           />
//           <div className="absolute inset-0 bg-linear-to-b from-secondary/60 via-secondary/40 to-white"></div>
//         </div>
        
//         <div className="container-custom relative z-10 text-center">
//           <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
//             Iconic Developments
//           </span>
//           <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
//             masterpiece <span className="text-primary italic">Projects</span>
//           </h1>
//           <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
//             Discover Dubai's most ambitious architectural marvels and high-yield investment opportunities in off-plan properties.
//           </p>
//         </div>
//       </section>

//       {/* About Off-Plan Properties Section */}
//       <section className="py-24 bg-slate-50">
//         <div className="container-custom">
//           <div className="max-w-4xl mx-auto text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-8">
//               Why Invest in <span className="text-primary italic">Off-Plan Properties</span>?
//             </h2>
//             <p className="text-xl text-slate-600 leading-relaxed">
//               Off-plan properties represent one of the most lucrative investment opportunities in Dubai's dynamic real estate market. 
//               By purchasing properties before construction begins, investors can secure prime locations at competitive prices with significant appreciation potential.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <ArrowTrendingUpIcon className="h-10 w-10 text-primary" />
//               </div>
//               <h3 className="text-2xl font-serif text-secondary mb-4">Capital Appreciation</h3>
//               <p className="text-slate-600 leading-relaxed">
//                 Dubai's property market has shown consistent growth, with off-plan properties offering 8-15% annual appreciation 
//                 as developments progress and infrastructure improves.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <CurrencyDollarIcon className="h-10 w-10 text-primary" />
//               </div>
//               <h3 className="text-2xl font-serif text-secondary mb-4">Flexible Payment Plans</h3>
//               <p className="text-slate-600 leading-relaxed">
//                 Developers offer extended payment plans spanning 4-6 years, allowing investors to spread payments over time 
//                 while construction progresses and value increases.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <HomeIcon className="h-10 w-10 text-primary" />
//               </div>
//               <h3 className="text-2xl font-serif text-secondary mb-4">Modern Specifications</h3>
//               <p className="text-slate-600 leading-relaxed">
//                 New developments feature cutting-edge technology, sustainable design, and premium finishes that exceed 
//                 current standards, ensuring long-term value and modern living.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Developer Filter Section */}
//       <section className="py-16 bg-white border-b border-slate-100">
//         <div className="container-custom">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
//             <div>
//               <h2 className="text-3xl font-serif text-secondary mb-2">Filter by Developer</h2>
//               <p className="text-slate-600">Choose from Dubai's most trusted property developers</p>
//             </div>
            
//             <div className="flex flex-wrap gap-4">
//               {developers.map((developer) => (
//                 <button
//                   key={developer.id}
//                   onClick={() => setSelectedDeveloper(developer.id)}
//                   className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
//                     selectedDeveloper === developer.id
//                       ? 'bg-primary text-secondary shadow-lg shadow-primary/20'
//                       : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                   }`}
//                 >
//                   {developer.name} ({developer.count})
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Projects Grid */}
//       <section className="py-24">
//         <div className="container-custom">
//           <div className="mb-12 text-center">
//             <h2 className="text-4xl font-serif text-secondary mb-4">
//               Featured {selectedDeveloper === 'all' ? 'Projects' : developers.find(d => d.id === selectedDeveloper)?.name}
//             </h2>
//             <p className="text-xl text-slate-600 max-w-2xl mx-auto">
//               {selectedDeveloper === 'all' 
//                 ? 'Explore our curated selection of premium off-plan properties from Dubai\'s leading developers'
//                 : `Discover exceptional properties from ${developers.find(d => d.id === selectedDeveloper)?.name}`
//               }
//             </p>
//           </div>

//           <div className="grid gap-12">
//             {filteredProjects.map((project) => (
//               <div 
//                 key={project.id}
//                 className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 group flex flex-col lg:flex-row hover:shadow-primary/10 transition-shadow duration-500"
//               >
//                 {/* Image Section */}
//                 <div className="lg:w-2/5 relative h-[400px] lg:h-auto overflow-hidden">
//                   <Image 
//                     src={project.images[selectedImageIndex[project.id] || 0]}
//                     alt={project.name}
//                     fill
//                     className="object-cover group-hover:scale-110 transition-transform duration-1000"
//                   />
                  
//                   {/* Image Navigation */}
//                   {project.images.length > 1 && (
//                     <>
//                       <button 
//                         onClick={() => handleImageChange(project.id, 'prev')}
//                         className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-all opacity-0 group-hover:opacity-100"
//                       >
//                         <ChevronLeftIcon className="h-5 w-5" />
//                       </button>
//                       <button 
//                         onClick={() => handleImageChange(project.id, 'next')}
//                         className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-all opacity-0 group-hover:opacity-100"
//                       >
//                         <ChevronRightIcon className="h-5 w-5" />
//                       </button>
                      
//                       {/* Image Indicators */}
//                       <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         {project.images.map((_, index) => (
//                           <button
//                             key={index}
//                             onClick={() => setSelectedImageIndex(prev => ({ ...prev, [project.id]: index }))}
//                             className={`w-2 h-2 rounded-full transition-all ${
//                               (selectedImageIndex[project.id] || 0) === index ? 'bg-white' : 'bg-white/50'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     </>
//                   )}
                  
//                   <div className="absolute top-6 left-6">
//                     <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg ${
//                       project.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-primary text-secondary'
//                     }`}>
//                       {project.status === 'completed' ? 'Completed' : 'In Progress'}
//                     </span>
//                   </div>
//                   <div className="absolute bottom-6 left-6">
//                     <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl">
//                       <div className="text-xs text-slate-500 uppercase tracking-widest">Starting From</div>
//                       <div className="text-lg font-bold text-secondary">
//                         {project.currency} {(project.startingPrice / 1000000).toFixed(1)}M
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Content Section */}
//                 <div className="lg:w-3/5 p-10 md:p-16 flex flex-col justify-center">
//                   <div className="flex items-center gap-2 text-primary mb-4">
//                     <SparklesIcon className="h-5 w-5" />
//                     <span className="text-sm font-bold uppercase tracking-widest">{project.developer}</span>
//                   </div>
                  
//                   <h3 className="text-4xl font-serif text-secondary mb-6 group-hover:text-primary transition-colors">
//                     {project.name}
//                   </h3>
                  
//                   <p className="text-slate-500 mb-8 leading-relaxed text-lg">
//                     {project.description}
//                   </p>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//                     <div className="space-y-1">
//                       <div className="text-xs text-slate-400 uppercase tracking-widest">Location</div>
//                       <div className="text-secondary font-bold flex items-center gap-1">
//                         <MapPinIcon className="h-4 w-4 text-primary" />
//                         {project.area}
//                       </div>
//                     </div>
                    
//                     <div className="space-y-1">
//                       <div className="text-xs text-slate-400 uppercase tracking-widest">Completion</div>
//                       <div className="text-secondary font-bold flex items-center gap-1">
//                         <CalendarIcon className="h-4 w-4 text-primary" />
//                         {new Date(project.completionDate).getFullYear()}
//                       </div>
//                     </div>
                    
//                     <div className="space-y-1">
//                       <div className="text-xs text-slate-400 uppercase tracking-widest">Payment Plan</div>
//                       <div className="text-secondary font-bold text-sm">
//                         {project.paymentPlan}
//                       </div>
//                     </div>
                    
//                     <div className="space-y-1">
//                       <div className="text-xs text-slate-400 uppercase tracking-widest">ROI Potential</div>
//                       <div className="text-secondary font-bold text-sm">
//                         {project.roi}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mb-8">
//                     <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">Key Features</div>
//                     <div className="flex flex-wrap gap-2">
//                       {project.features.slice(0, 4).map((feature, index) => (
//                         <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
//                           {feature}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-4">
//                     <button 
//                       onClick={() => setInquiryModal({ isOpen: true, project })}
//                       className="px-10 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300 shadow-xl shadow-secondary/20"
//                     >
//                       Request Brochure
//                     </button>
//                     <button 
//                       onClick={() => window.open(`/projects/${project.id}/floor-plans`, '_blank')}
//                       className="px-10 py-4 bg-white text-secondary border-2 border-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all duration-300"
//                     >
//                       View Floor Plans
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Investment Benefits Section */}
//       <section className="py-24 bg-secondary text-white">
//         <div className="container-custom">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-serif mb-8">
//               Investment <span className="text-primary italic">Benefits</span>
//             </h2>
//             <p className="text-xl text-slate-300 max-w-3xl mx-auto">
//               Dubai's off-plan property market offers unparalleled opportunities for investors seeking capital growth and rental income
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary mb-2">8-15%</div>
//               <div className="text-lg font-semibold mb-4">Annual Appreciation</div>
//               <p className="text-slate-300">Consistent property value growth driven by Dubai's expanding economy and infrastructure development</p>
//             </div>
            
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary mb-2">4-6 Years</div>
//               <div className="text-lg font-semibold mb-4">Payment Plans</div>
//               <p className="text-slate-300">Extended payment schedules allowing investors to spread costs while construction progresses</p>
//             </div>
            
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary mb-2">0%</div>
//               <div className="text-lg font-semibold mb-4">Interest Payments</div>
//               <p className="text-slate-300">No interest charges on construction payments, preserving capital for other investments</p>
//             </div>
            
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary mb-2">5-8%</div>
//               <div className="text-lg font-semibold mb-4">Rental Yield</div>
//               <p className="text-slate-300">Competitive rental returns from Dubai's growing expatriate and tourist population</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Inquiry Modal */}
//       {inquiryModal.isOpen && (
//         <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-fadeIn">
//             <div className="relative h-48">
//               <Image 
//                 src={inquiryModal.project?.heroImage || '/api/placeholder/400/300'}
//                 alt="Project"
//                 fill
//                 className="object-cover"
//               />
//               <div className="absolute inset-0 bg-secondary/60 flex items-center justify-center">
//                 <h3 className="text-3xl font-serif text-white">Inquire: {inquiryModal.project?.name}</h3>
//               </div>
//               <button 
//                 onClick={() => setInquiryModal({ isOpen: false, project: null })}
//                 className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-all"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="p-10">
//               {submitSuccess ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <CheckCircleIcon className="h-8 w-8 text-emerald-600" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-secondary mb-2">Inquiry Sent Successfully!</h3>
//                   <p className="text-slate-600">We'll get back to you within 24 hours with detailed information about {inquiryModal.project?.name}.</p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleFormSubmit} className="space-y-6">
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <input 
//                       type="text" 
//                       name="name"
//                       placeholder="Full Name" 
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50" 
//                     />
//                     <input 
//                       type="email" 
//                       name="email"
//                       placeholder="Email Address" 
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50" 
//                     />
//                   </div>
//                   <input 
//                     type="tel" 
//                     name="phone"
//                     placeholder="Phone Number" 
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50" 
//                   />
//                   <textarea 
//                     name="message"
//                     placeholder="Your Message" 
//                     rows={4} 
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 resize-none"
//                   ></textarea>
//                   <button 
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full py-5 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function ProjectsPage() {
//   return (
//     <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
//       <ProjectsPageContent />
//     </Suspense>
//   )
// }


// new code
"use client"

import Image from 'next/image'
import { Suspense, useState, useEffect } from 'react'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  HomeIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import { db } from '@/lib/firebase' // Aapka firebase config path
import { collection, getDocs, query, where } from 'firebase/firestore'

// Types define karen
interface Project {
  id: string;
  name: string;
  developer?: string;
  developer_id?: string | null;
  status: string;
  launch_date: string;
  completion_date: string;
  city: string;
  area: string;
  starting_price: number;
  currency: string;
  total_units: number;
  available_units: number;
  property_types: string[];
  hero_image_url: string;
  images: string[];
  description: string;
  payment_plan?: string | null;
  amenities?: string[];
  facilities?: string[];
  min_price: number;
  max_price: number;
  sold_units: number;
  brochure_url?: string;
  video_url?: string;
  featured: boolean;
  published: boolean;
  // ... other fields as per your Firebase
}

const developers = [
  { id: 'all', name: 'All Developers', count: 0 },
  { id: 'emaar', name: 'Emaar Properties', count: 0 },
  { id: 'damac', name: 'DAMAC Properties', count: 0 },
  { id: 'nakheel', name: 'Nakheel Properties', count: 0 }
]

function ProjectsPageContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeveloper, setSelectedDeveloper] = useState('all')
  const [inquiryModal, setInquiryModal] = useState<{ isOpen: boolean; project: Project | null }>({ isOpen: false, project: null })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<{[key: string]: number}>({})

  // Firebase se data fetch karna
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const projectsRef = collection(db, 'projects')
      const q = query(projectsRef, where('published', '==', true))
      const querySnapshot = await getDocs(q)
      
      const projectsData: Project[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        projectsData.push({
          id: doc.id,
          name: data.name || '',
          developer: data.developer || '',
          developer_id: data.developer_id || null,
          status: data.status || 'in-progress',
          launch_date: data.launch_date || '',
          completion_date: data.completion_date || '',
          city: data.city || '',
          area: data.area || '',
          starting_price: data.starting_price || 0,
          currency: data.currency || 'AED',
          total_units: data.total_units || 0,
          available_units: data.available_units || 0,
          property_types: data.property_types || [],
          hero_image_url: data.hero_image_url || '/default-image.jpg',
          images: data.images || [],
          description: data.description || '',
          payment_plan: data.payment_plan || null,
          amenities: data.amenities || [],
          facilities: data.facilities || [],
          min_price: data.min_price || 0,
          max_price: data.max_price || 0,
          sold_units: data.sold_units || 0,
          brochure_url: data.brochure_url || '',
          video_url: data.video_url || '',
          featured: data.featured || false,
          published: data.published || false
        })
      })
      
      setProjects(projectsData)
      
      // Developer counts update karen
      updateDeveloperCounts(projectsData)
      
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateDeveloperCounts = (projectsData: Project[]) => {
    const emaarCount = projectsData.filter(p => p.developer === 'Emaar Properties' || p.developer?.toLowerCase().includes('emaar')).length
    const damacCount = projectsData.filter(p => p.developer === 'DAMAC Properties' || p.developer?.toLowerCase().includes('damac')).length
    const nakheelCount = projectsData.filter(p => p.developer === 'Nakheel Properties' || p.developer?.toLowerCase().includes('nakheel')).length
    
    developers[0].count = projectsData.length
    developers[1].count = emaarCount
    developers[2].count = damacCount
    developers[3].count = nakheelCount
  }

  const filteredProjects = selectedDeveloper === 'all' 
    ? projects 
    : projects.filter(project => {
        if (selectedDeveloper === 'emaar') {
          return project.developer?.toLowerCase().includes('emaar')
        } else if (selectedDeveloper === 'damac') {
          return project.developer?.toLowerCase().includes('damac')
        } else if (selectedDeveloper === 'nakheel') {
          return project.developer?.toLowerCase().includes('nakheel')
        }
        return false
      })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitSuccess(true)
    setIsSubmitting(false)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false)
      setInquiryModal({ isOpen: false, project: null })
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageChange = (projectId: string, direction: 'next' | 'prev') => {
    const currentIndex = selectedImageIndex[projectId] || 0
    const project = projects.find(p => p.id === projectId)
    if (!project || !project.images || project.images.length === 0) return

    const maxIndex = project.images.length - 1
    let newIndex

    if (direction === 'next') {
      newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1
    } else {
      newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1
    }

    setSelectedImageIndex(prev => ({
      ...prev,
      [projectId]: newIndex
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Dubai Projects"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Iconic Developments
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            masterpiece <span className="text-primary italic">Projects</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover Dubai's most ambitious architectural marvels and high-yield investment opportunities in off-plan properties.
          </p>
        </div>
      </section>

      {/* About Off-Plan Properties Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-8">
              Why Invest in <span className="text-primary italic">Off-Plan Properties</span>?
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Off-plan properties represent one of the most lucrative investment opportunities in Dubai's dynamic real estate market. 
              By purchasing properties before construction begins, investors can secure prime locations at competitive prices with significant appreciation potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowTrendingUpIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-serif text-secondary mb-4">Capital Appreciation</h3>
              <p className="text-slate-600 leading-relaxed">
                Dubai's property market has shown consistent growth, with off-plan properties offering 8-15% annual appreciation 
                as developments progress and infrastructure improves.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CurrencyDollarIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-serif text-secondary mb-4">Flexible Payment Plans</h3>
              <p className="text-slate-600 leading-relaxed">
                Developers offer extended payment plans spanning 4-6 years, allowing investors to spread payments over time 
                while construction progresses and value increases.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HomeIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-serif text-secondary mb-4">Modern Specifications</h3>
              <p className="text-slate-600 leading-relaxed">
                New developments feature cutting-edge technology, sustainable design, and premium finishes that exceed 
                current standards, ensuring long-term value and modern living.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Filter Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="text-3xl font-serif text-secondary mb-2">Filter by Developer</h2>
              <p className="text-slate-600">Choose from Dubai's most trusted property developers</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {developers.map((developer) => (
                <button
                  key={developer.id}
                  onClick={() => setSelectedDeveloper(developer.id)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    selectedDeveloper === developer.id
                      ? 'bg-primary text-secondary shadow-lg shadow-primary/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {developer.name} ({developer.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-serif text-secondary mb-4">
              Featured {selectedDeveloper === 'all' ? 'Projects' : developers.find(d => d.id === selectedDeveloper)?.name}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {selectedDeveloper === 'all' 
                ? 'Explore our curated selection of premium off-plan properties from Dubai\'s leading developers'
                : `Discover exceptional properties from ${developers.find(d => d.id === selectedDeveloper)?.name}`
              }
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-2xl text-slate-400 mb-2">No projects found</h3>
              <p className="text-slate-500">Try selecting a different developer filter</p>
            </div>
          ) : (
            <div className="grid gap-12">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 group flex flex-col lg:flex-row hover:shadow-primary/10 transition-shadow duration-500"
                >
                  {/* Image Section */}
                  <div className="lg:w-2/5 relative h-[400px] lg:h-auto overflow-hidden">
                    <Image 
                      src={project.hero_image_url || '/default-image.jpg'}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/default-image.jpg'
                      }}
                    />
                    
                    {/* Image Navigation */}
                    {project.images && project.images.length > 1 && (
                      <>
                        <button 
                          onClick={() => handleImageChange(project.id, 'prev')}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleImageChange(project.id, 'next')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {project.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(prev => ({ ...prev, [project.id]: index }))}
                              className={`w-2 h-2 rounded-full transition-all ${
                                (selectedImageIndex[project.id] || 0) === index ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    
                    <div className="absolute top-6 left-6">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg ${
                        project.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-primary text-secondary'
                      }`}>
                        {project.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl">
                        <div className="text-xs text-slate-500 uppercase tracking-widest">Starting From</div>
                        <div className="text-lg font-bold text-secondary">
                          {project.currency} {project.starting_price ? (project.starting_price / 1000000).toFixed(1) + 'M' : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-3/5 p-10 md:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-primary mb-4">
                      <SparklesIcon className="h-5 w-5" />
                      <span className="text-sm font-bold uppercase tracking-widest">{project.developer || 'Developer'}</span>
                    </div>
                    
                    <h3 className="text-4xl font-serif text-secondary mb-6 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    
                    <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Location</div>
                        <div className="text-secondary font-bold flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4 text-primary" />
                          {project.area || project.city}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Completion</div>
                        <div className="text-secondary font-bold flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          {project.completion_date ? new Date(project.completion_date).getFullYear() : 'TBA'}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Available Units</div>
                        <div className="text-secondary font-bold text-sm">
                          {project.available_units} / {project.total_units}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Price Range</div>
                        <div className="text-secondary font-bold text-sm">
                          {project.currency} {project.min_price ? `${project.min_price}K` : 'N/A'} - {project.max_price ? `${project.max_price}K` : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Amenities/Facilities show karen */}
                    <div className="mb-8">
                      <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">Amenities & Features</div>
                      <div className="flex flex-wrap gap-2">
                        {project.amenities && project.amenities.length > 0 ? (
                          project.amenities.slice(0, 4).map((amenity, index) => (
                            <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                              {amenity}
                            </span>
                          ))
                        ) : project.facilities && project.facilities.length > 0 ? (
                          project.facilities.slice(0, 4).map((facility, index) => (
                            <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                              {facility}
                            </span>
                          ))
                        ) : project.property_types && project.property_types.length > 0 ? (
                          project.property_types.slice(0, 4).map((type, index) => (
                            <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                              {type}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-sm rounded-full">
                            Features coming soon
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => setInquiryModal({ isOpen: true, project })}
                        className="px-10 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300 shadow-xl shadow-secondary/20"
                      >
                        Request Brochure
                      </button>
                      <button 
                        onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                        className="px-10 py-4 bg-white text-secondary border-2 border-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Investment Benefits Section */}
      <section className="py-24 bg-secondary text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-8">
              Investment <span className="text-primary italic">Benefits</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Dubai's off-plan property market offers unparalleled opportunities for investors seeking capital growth and rental income
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">8-15%</div>
              <div className="text-lg font-semibold mb-4">Annual Appreciation</div>
              <p className="text-slate-300">Consistent property value growth driven by Dubai's expanding economy and infrastructure development</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4-6 Years</div>
              <div className="text-lg font-semibold mb-4">Payment Plans</div>
              <p className="text-slate-300">Extended payment schedules allowing investors to spread costs while construction progresses</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">0%</div>
              <div className="text-lg font-semibold mb-4">Interest Payments</div>
              <p className="text-slate-300">No interest charges on construction payments, preserving capital for other investments</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5-8%</div>
              <div className="text-lg font-semibold mb-4">Rental Yield</div>
              <p className="text-slate-300">Competitive rental returns from Dubai's growing expatriate and tourist population</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {inquiryModal.isOpen && inquiryModal.project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-fadeIn">
            <div className="relative h-48">
              <Image 
                src={inquiryModal.project.hero_image_url || '/default-image.jpg'}
                alt={inquiryModal.project.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/default-image.jpg'
                }}
              />
              <div className="absolute inset-0 bg-secondary/60 flex items-center justify-center">
                <h3 className="text-3xl font-serif text-white">Inquire: {inquiryModal.project.name}</h3>
              </div>
              <button 
                onClick={() => setInquiryModal({ isOpen: false, project: null })}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-all"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-10">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">Inquiry Sent Successfully!</h3>
                  <p className="text-slate-600">We'll get back to you within 24 hours with detailed information about {inquiryModal.project.name}.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Full Name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50" 
                    />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email Address" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50" 
                  />
                  <textarea 
                    name="message"
                    placeholder="Your Message" 
                    rows={4} 
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 resize-none"
                  ></textarea>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProjectsPageContent />
    </Suspense>
  )
}