// 'use client'

// import { useState, useRef, useCallback, useEffect } from 'react'
// import { XMarkIcon, PhotoIcon, MapPinIcon, PlusIcon, TrashIcon, CloudArrowUpIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
// import dynamic from 'next/dynamic'
// import { useTranslation } from 'react-i18next'
// import { db, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from '@/lib/firebase'

// // Dynamically import LocationPicker to avoid SSR issues with Leaflet
// const LocationPicker = dynamic(() => import('@/components/shared/LocationPicker'), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center border border-border">
//       <div className="text-muted-foreground flex flex-col items-center gap-2">
//         <MapPinIcon className="w-8 h-8 animate-bounce" />
//         <p className="text-sm font-medium">Loading Map...</p>
//       </div>
//     </div>
//   )
// })

// interface PropertyFormData {
//   id?: string
//   title: string
//   title_ar?: string
//   title_fr?: string
//   slug: string
//   description: string
//   description_ar?: string
//   description_fr?: string
//   category_id?: string
//   type: string
//   status: string
//   property_status: string
//   price: number
//   currency: string
//   beds: number
//   baths: number
//   sqft: number
//   images: string[]
//   floorplans: string[]
//   features: string[]
//   address: string
//   city: string
//   area: string
//   coords: { lat: number; lng: number } | null
//   published: boolean
//   featured: boolean
//   project_id?: string
//   developer_id?: string
//   agent_id?: string
//   video_url?: string
//   // Additional fields for comprehensive filtering
//   furnished?: boolean
//   parking?: string
//   property_age?: string
//   completion?: string
//   created_at?: string
//   updated_at?: string
//   views_count?: number
//   inquiries_count?: number
// }

// interface PropertyFormProps {
//   isOpen: boolean
//   onClose: () => void
//   onSubmit?: (data: PropertyFormData) => void // Make optional since we'll handle internally
//   initialData?: Partial<PropertyFormData>
//   mode?: 'create' | 'edit'
//   agents?: any[]
//   categories?: any[]
//   onSuccess?: () => void // Callback after successful save
// }

// const propertyTypes = [
//   { value: 'apartment', label: 'Apartment' },
//   { value: 'villa', label: 'Villa' },
//   { value: 'townhouse', label: 'Townhouse' },
//   { value: 'plot', label: 'Plot' },
//   { value: 'commercial', label: 'Commercial' },
//   { value: 'furnished-studio', label: 'Furnished Studio' },
//   { value: 'residential-plot', label: 'Residential Plot' },
//   { value: 'industrial-plot', label: 'Industrial Plot' },
// ]

// const propertyStatuses = [
//   { value: 'sale', label: 'For Sale' },
//   { value: 'rent', label: 'For Rent' },
// ]

// const propertyStatusOptions = [
//   { value: 'ready', label: 'Ready' },
//   { value: 'off-plan', label: 'Off Plan' },
//   { value: 'under-construction', label: 'Under Construction' },
//   { value: 'reserved', label: 'Reserved' },
// ]

// const currencies = [
//   { value: 'AED', label: 'AED' },
//   { value: 'USD', label: 'USD' },
//   { value: 'EUR', label: 'EUR' },
//   { value: 'GBP', label: 'GBP' },
// ]

// const commonFeatures = [
//   'Swimming Pool',
//   'Gym & Fitness Center',
//   'Concierge Service',
//   'Valet Parking',
//   'Rooftop Terrace',
//   'Floor-to-Ceiling Windows',
//   'Premium Appliances',
//   'Walk-in Closets',
//   'Smart Home System',
//   '24/7 Security',
//   'Balcony',
//   'Built-in Wardrobes',
//   'Parking',
//   'Garden',
//   'Maid Service',
//   'Sea View',
//   'City View',
//   'Burj Khalifa View',
//   // Special features for filtering
//   'Beachfront',
//   'Marina View',
//   'Golf Course',
//   'Private Pool',
//   'Penthouse',
//   'Duplex',
//   'Townhouse'
// ]

// interface MultiLanguageInputProps {
//   label: string
//   value: string
//   valueAr?: string
//   valueFr?: string
//   onChange: (value: string) => void
//   onChangeAr?: (value: string) => void
//   onChangeFr?: (value: string) => void
//   placeholder?: string
//   required?: boolean
//   rows?: number
//   textarea?: boolean
// }

// function MultiLanguageInput({
//   label,
//   value,
//   valueAr,
//   valueFr,
//   onChange,
//   onChangeAr,
//   onChangeFr,
//   placeholder,
//   required,
//   rows = 3,
//   textarea = false
// }: MultiLanguageInputProps) {
//   const { t } = useTranslation()
//   const [activeTab, setActiveTab] = useState<'en' | 'ar' | 'fr'>('en')

//   const languages = [
//     { code: 'en' as const, name: t('propertyForm.languages.english'), flag: '🇺🇸' },
//     { code: 'fr' as const, name: t('propertyForm.languages.french'), flag: '🇫🇷' },
//     { code: 'ar' as const, name: t('propertyForm.languages.arabic'), flag: '🇦🇪' }
//   ]

//   const getCurrentValue = () => {
//     switch (activeTab) {
//       case 'ar': return valueAr || ''
//       case 'fr': return valueFr || ''
//       default: return value
//     }
//   }

//   const handleValueChange = (newValue: string) => {
//     switch (activeTab) {
//       case 'ar': onChangeAr?.(newValue); break
//       case 'fr': onChangeFr?.(newValue); break
//       default: onChange(newValue); break
//     }
//   }

//   return (
//     <div className="space-y-2">
//       <label className="block text-sm font-medium text-foreground">
//         {label} {required && '*'}
//       </label>

//       {/* Language Tabs */}
//       <div className="flex border-b border-border">
//         {languages.map((lang) => (
//           <button
//             key={lang.code}
//             onClick={() => setActiveTab(lang.code)}
//             className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
//               activeTab === lang.code
//                 ? 'border-b-2 border-primary text-primary'
//                 : 'text-muted-foreground hover:text-foreground'
//             }`}
//           >
//             <span>{lang.flag}</span>
//             <span>{lang.name}</span>
//           </button>
//         ))}
//       </div>

//       {/* Input Field */}
//       {textarea ? (
//         <textarea
//           value={getCurrentValue()}
//           onChange={(e) => handleValueChange(e.target.value)}
//           rows={rows}
//           className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground resize-none"
//           placeholder={placeholder ? t(placeholder, { language: languages.find(l => l.code === activeTab)?.name }) : undefined}
//           required={required && activeTab === 'en'}
//         />
//       ) : (
//         <input
//           type="text"
//           value={getCurrentValue()}
//           onChange={(e) => handleValueChange(e.target.value)}
//           className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//           placeholder={placeholder ? t(placeholder, { language: languages.find(l => l.code === activeTab)?.name }) : undefined}
//           required={required && activeTab === 'en'}
//         />
//       )}

//       {/* Character Count for Description */}
//       {textarea && activeTab === 'en' && (
//         <p className="text-xs text-muted-foreground">
//           {value.length} characters
//         </p>
//       )}
//     </div>
//   )
// }

// export default function PropertyForm({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   mode = 'create',
//   agents = [],
//   categories = [],
//   onSuccess
// }: PropertyFormProps) {
//   const { t } = useTranslation()
//   const [activeLanguageTab, setActiveLanguageTab] = useState<'en' | 'ar' | 'fr'>('en')
//   const [formData, setFormData] = useState<PropertyFormData>({
//     title: initialData?.title || '',
//     title_ar: initialData?.title_ar || '',
//     title_fr: initialData?.title_fr || '',
//     slug: initialData?.slug || '',
//     description: initialData?.description || '',
//     description_ar: initialData?.description_ar || '',
//     description_fr: initialData?.description_fr || '',
//     category_id: initialData?.category_id || '',
//     type: initialData?.type || 'apartment',
//     status: initialData?.status || 'sale',
//     property_status: initialData?.property_status || 'ready',
//     price: initialData?.price || 0,
//     currency: initialData?.currency || 'AED',
//     beds: initialData?.beds || 0,
//     baths: initialData?.baths || 0,
//     sqft: initialData?.sqft || 0,
//     images: initialData?.images || [],
//     floorplans: initialData?.floorplans || [],
//     features: initialData?.features || [],
//     address: initialData?.address || '',
//     city: initialData?.city || 'Dubai',
//     area: initialData?.area || '',
//     coords: initialData?.coords || null,
//     published: initialData?.published || false,
//     featured: initialData?.featured || false,
//     project_id: initialData?.project_id,
//     developer_id: initialData?.developer_id,
//     agent_id: initialData?.agent_id,
//     video_url: initialData?.video_url || '',
//     // Additional fields for comprehensive filtering
//     furnished: initialData?.furnished,
//     parking: initialData?.parking,
//     property_age: initialData?.property_age,
//     completion: initialData?.completion,
//   })

//   const [newImageUrl, setNewImageUrl] = useState('')
//   const [newFloorplanUrl, setNewFloorplanUrl] = useState('')
//   const [newFeature, setNewFeature] = useState('')
//   const [mainImageIndex, setMainImageIndex] = useState(0)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isDragOver, setIsDragOver] = useState(false)
//   const [showReorderMode, setShowReorderMode] = useState(false)
//   const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null)
//   const [uploadProgress, setUploadProgress] = useState(0)

//   // Firebase se categories fetch karne ke liye states
//   const [firebaseCategories, setFirebaseCategories] = useState<any[]>([])
//   const [isLoadingCategories, setIsLoadingCategories] = useState(false)

//   const fileInputRef = useRef<HTMLInputElement>(null)

//   // Initialize form with initialData
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         title: initialData.title || '',
//         title_ar: initialData.title_ar || '',
//         title_fr: initialData.title_fr || '',
//         slug: initialData.slug || '',
//         description: initialData.description || '',
//         description_ar: initialData.description_ar || '',
//         description_fr: initialData.description_fr || '',
//         category_id: initialData.category_id || '',
//         type: initialData.type || 'apartment',
//         status: initialData.status || 'sale',
//         property_status: initialData.property_status || 'ready',
//         price: initialData.price || 0,
//         currency: initialData.currency || 'AED',
//         beds: initialData.beds || 0,
//         baths: initialData.baths || 0,
//         sqft: initialData.sqft || 0,
//         images: initialData.images || [],
//         floorplans: initialData.floorplans || [],
//         features: initialData.features || [],
//         address: initialData.address || '',
//         city: initialData.city || 'Dubai',
//         area: initialData.area || '',
//         coords: initialData.coords || null,
//         published: initialData.published || false,
//         featured: initialData.featured || false,
//         project_id: initialData.project_id,
//         developer_id: initialData.developer_id,
//         agent_id: initialData.agent_id,
//         video_url: initialData.video_url || '',
//         furnished: initialData.furnished,
//         parking: initialData.parking,
//         property_age: initialData.property_age,
//         completion: initialData.completion,
//       })
//     }
//   }, [initialData])

//   // Firebase se categories fetch karein
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setIsLoadingCategories(true)
//       try {
//         const categoriesRef = collection(db, "categories")
//         const snapshot = await getDocs(categoriesRef)
        
//         const categoriesList = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }))
        
//         setFirebaseCategories(categoriesList)
//       } catch (error) {
//         console.error("Error fetching categories:", error)
//       } finally {
//         setIsLoadingCategories(false)
//       }
//     }
    
//     fetchCategories()
//   }, [])

//   // Categories list ko prioritize karein (first Firebase categories, then props)
//   const categoriesList = firebaseCategories.length > 0 ? firebaseCategories : (categories || [])

//   const generateSlug = (title: string) => {
//     return title
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-')
//       .trim()
//   }

//   const handleTitleChange = (title: string) => {
//     setFormData(prev => ({
//       ...prev,
//       title,
//       slug: generateSlug(title)
//     }))
//   }

//   const handleLocationChange = useCallback((lat: number, lng: number, address: string) => {
//     setFormData(prev => ({
//       ...prev,
//       coords: { lat, lng },
//       address: address
//     }))
//   }, [])

//   const addImage = () => {
//     if (newImageUrl.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, newImageUrl.trim()]
//       }))
//       setNewImageUrl('')
//     }
//   }

//   const removeImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }))
//     if (mainImageIndex >= index && mainImageIndex > 0) {
//       setMainImageIndex(mainImageIndex - 1)
//     }
//   }

//   // Enhanced Image Management Functions
//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(true)
//   }, [])

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(false)
//   }, [])

//   const handleDrop = useCallback(async (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(false)

//     const files = Array.from(e.dataTransfer.files).filter(file =>
//       file.type.startsWith('image/')
//     )

//     if (files.length > 0) {
//       await handleFileUpload(files)
//     }
//   }, [])

//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []).filter(file =>
//       file.type.startsWith('image/')
//     )

//     if (files.length > 0) {
//       await handleFileUpload(files)
//     }

//     // Reset input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const handleFileUpload = async (files: File[]) => {
//     setUploadProgress(0)

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i]

//       // Validate file size (10MB limit)
//       if (file.size > 10 * 1024 * 1024) {
//         alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
//         continue
//       }

//       try {
//         // In a real application, you would upload to a cloud storage service
//         // For now, we'll create a data URL for demonstration
//         const reader = new FileReader()
//         reader.onload = (e) => {
//           const dataUrl = e.target?.result as string
//           setFormData(prev => ({
//             ...prev,
//             images: [...prev.images, dataUrl]
//           }))
//         }
//         reader.readAsDataURL(file)

//         // Update progress
//         setUploadProgress(((i + 1) / files.length) * 100)
//       } catch (error) {
//         console.error('Error uploading file:', error)
//         alert(`Failed to upload "${file.name}". Please try again.`)
//       }
//     }

//     setTimeout(() => setUploadProgress(0), 1000)
//   }

//   const handleImageDragStart = (e: React.DragEvent, index: number) => {
//     if (!showReorderMode) return
//     setDraggedImageIndex(index)
//     e.dataTransfer.effectAllowed = 'move'
//   }

//   const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
//     e.preventDefault()
//     if (!showReorderMode || draggedImageIndex === null || draggedImageIndex === dropIndex) {
//       setDraggedImageIndex(null)
//       return
//     }

//     const newImages = [...formData.images]
//     const [draggedImage] = newImages.splice(draggedImageIndex, 1)
//     newImages.splice(dropIndex, 0, draggedImage)

//     setFormData(prev => ({
//       ...prev,
//       images: newImages
//     }))

//     // Update main image index if it was moved
//     if (mainImageIndex === draggedImageIndex) {
//       setMainImageIndex(dropIndex)
//     } else if (mainImageIndex > draggedImageIndex && mainImageIndex <= dropIndex) {
//       setMainImageIndex(mainImageIndex - 1)
//     } else if (mainImageIndex < draggedImageIndex && mainImageIndex >= dropIndex) {
//       setMainImageIndex(mainImageIndex + 1)
//     }

//     setDraggedImageIndex(null)
//   }

//   const addFloorplan = () => {
//     if (newFloorplanUrl.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         floorplans: [...prev.floorplans, newFloorplanUrl.trim()]
//       }))
//       setNewFloorplanUrl('')
//     }
//   }

//   const removeFloorplan = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       floorplans: prev.floorplans.filter((_, i) => i !== index)
//     }))
//   }

//   const addFeature = () => {
//     if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         features: [...prev.features, newFeature.trim()]
//       }))
//       setNewFeature('')
//     }
//   }

//   const removeFeature = (feature: string) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter(f => f !== feature)
//     }))
//   }

//   const addCommonFeature = (feature: string) => {
//     if (!formData.features.includes(feature)) {
//       setFormData(prev => ({
//         ...prev,
//         features: [...prev.features, feature]
//       }))
//     }
//   }

//   // FIREBASE SUBMIT HANDLER
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       // Validation
//       if (!formData.title.trim()) {
//         alert('Property title is required')
//         return
//       }

//       if (!formData.price || formData.price <= 0) {
//         alert('Valid price is required')
//         return
//       }

//       // Ensure main image is first in the array
//       const reorderedImages = [...formData.images]
//       if (mainImageIndex > 0) {
//         const mainImage = reorderedImages.splice(mainImageIndex, 1)[0]
//         reorderedImages.unshift(mainImage)
//       }

//       // Prepare data for Firebase
//       const propertyData: any = {
//         title: formData.title.trim(),
//         slug: formData.slug.trim() || generateSlug(formData.title),
//         description: formData.description.trim(),
//         type: formData.type,
//         status: formData.status,
//         property_status: formData.property_status,
//         price: formData.price,
//         currency: formData.currency,
//         beds: formData.beds || 0,
//         baths: formData.baths || 0,
//         sqft: formData.sqft || 0,
//         images: reorderedImages,
//         floorplans: formData.floorplans,
//         features: formData.features,
//         address: formData.address.trim(),
//         city: formData.city.trim(),
//         area: formData.area.trim(),
//         coords: formData.coords,
//         published: formData.published,
//         featured: formData.featured,
//         video_url: formData.video_url?.trim() || null,
//         // Additional fields
//         furnished: formData.furnished || false,
//         parking: formData.parking || null,
//         property_age: formData.property_age || null,
//         completion: formData.completion || null,
//         // Timestamps
//         updated_at: new Date().toISOString(),
//         // Counters
//         views_count: initialData?.views_count || 0,
//         inquiries_count: initialData?.inquiries_count || 0,
//       }

//       // Add optional fields if they exist
//       if (formData.title_ar?.trim()) propertyData.title_ar = formData.title_ar.trim()
//       if (formData.title_fr?.trim()) propertyData.title_fr = formData.title_fr.trim()
//       if (formData.description_ar?.trim()) propertyData.description_ar = formData.description_ar.trim()
//       if (formData.description_fr?.trim()) propertyData.description_fr = formData.description_fr.trim()
//       if (formData.category_id?.trim()) propertyData.category_id = formData.category_id.trim()
//       if (formData.project_id?.trim()) propertyData.project_id = formData.project_id.trim()
//       if (formData.developer_id?.trim()) propertyData.developer_id = formData.developer_id.trim()
//       if (formData.agent_id?.trim()) propertyData.agent_id = formData.agent_id.trim()

//       console.log('Submitting property data:', propertyData)

//       if (mode === 'edit' && initialData?.id) {
//         // Update existing property in Firebase
//         const propertyRef = doc(db, "properties", initialData.id)
        
//         // Keep created_at from original
//         propertyData.created_at = initialData.created_at || new Date().toISOString()
        
//         await updateDoc(propertyRef, propertyData)
        
//         console.log('Property updated in Firebase:', initialData.id)
//         alert('Property updated successfully!')
//       } else {
//         // Create new property in Firebase
//         propertyData.created_at = new Date().toISOString()
        
//         const docRef = await addDoc(collection(db, "properties"), propertyData)
        
//         console.log('Property created in Firebase with ID:', docRef.id)
//         alert('Property created successfully!')
//       }

//       // Call custom onSubmit if provided
//       if (onSubmit) {
//         onSubmit({
//           ...propertyData,
//           id: mode === 'edit' ? initialData?.id : undefined
//         })
//       }

//       // Call success callback
//       if (onSuccess) {
//         onSuccess()
//       }

//       // Close modal
//       onClose()

//     } catch (error: any) {
//       console.error('Error saving property:', error)
      
//       let errorMessage = 'Error saving property. Please try again.'
      
//       if (error.code === 'permission-denied') {
//         errorMessage = 'Permission denied. Please check Firebase rules.'
//       } else if (error.message) {
//         errorMessage = `Error: ${error.message}`
//       }
      
//       alert(errorMessage)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // DELETE PROPERTY FUNCTION
//   const handleDeleteProperty = async () => {
//     if (!initialData?.id) return
    
//     if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
//       return
//     }

//     try {
//       const propertyRef = doc(db, "properties", initialData.id)
//       await deleteDoc(propertyRef)
      
//       alert('Property deleted successfully!')
      
//       if (onSuccess) {
//         onSuccess()
//       }
      
//       onClose()
//     } catch (error: any) {
//       console.error('Error deleting property:', error)
//       alert('Error deleting property. Please try again.')
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-card border border-border rounded-xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-2xl font-bold mb-2">
//                 {mode === 'create' ? t('propertyForm.addNewProperty') : t('propertyForm.editProperty')}
//                 <span className="text-sm text-blue-100 ml-2">(Firebase)</span>
//               </h2>
//               <p className="text-blue-100">
//                 {mode === 'create' ? t('propertyForm.fillDetails') : t('propertyForm.updateDetails')}
//               </p>
//             </div>
//             {mode === 'edit' && (
//               <button
//                 type="button"
//                 onClick={handleDeleteProperty}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
//               >
//                 Delete Property
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-140px)]">
//           <div className="p-6 space-y-8">
//             {/* 1. Basic Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">1</span>
//                 {t('propertyForm.sections.basicInfo')}
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="md:col-span-2">
//                   <MultiLanguageInput
//                     label={t('propertyForm.title')}
//                     value={formData.title}
//                     valueAr={formData.title_ar}
//                     valueFr={formData.title_fr}
//                     onChange={(value) => handleTitleChange(value)}
//                     onChangeAr={(value) => setFormData(prev => ({ ...prev, title_ar: value }))}
//                     onChangeFr={(value) => setFormData(prev => ({ ...prev, title_fr: value }))}
//                     required
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Slug {!formData.slug && '(Auto-generated)'}
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.slug}
//                     onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Property Type *
//                   </label>
//                   <select
//                     value={formData.type}
//                     onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     required
//                   >
//                     {propertyTypes.map((type) => (
//                       <option key={type.value} value={type.value}>
//                         {type.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Category
//                   </label>
//                   {isLoadingCategories ? (
//                     <div className="w-full px-3 py-2 bg-background border border-border rounded-lg">
//                       <div className="flex items-center gap-2">
//                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
//                         <span className="text-sm text-muted-foreground">Loading categories...</span>
//                       </div>
//                     </div>
//                   ) : (
//                     <select
//                       value={formData.category_id || ''}
//                       onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value || undefined }))}
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     >
//                       <option value="">Select a category...</option>
//                       {categoriesList.map((category) => (
//                         <option key={category.id} value={category.id}>
//                           {category.name || category.title || "Unnamed Category"}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Status *
//                   </label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     required
//                   >
//                     {propertyStatuses.map((status) => (
//                       <option key={status.value} value={status.value}>
//                         {status.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Property Status
//                   </label>
//                   <select
//                     value={formData.property_status}
//                     onChange={(e) => setFormData(prev => ({ ...prev, property_status: e.target.value }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   >
//                     {propertyStatusOptions.map((status) => (
//                       <option key={status.value} value={status.value}>
//                         {status.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Assigned Agent
//                   </label>
//                   <select
//                     value={formData.agent_id || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, agent_id: e.target.value || undefined }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   >
//                     <option value="">Select an agent...</option>
//                     {(agents || []).map((agent) => (
//                       <option key={agent.id} value={agent.id}>
//                         {agent.title || agent.profiles?.full_name || 'Unnamed Agent'}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Price *
//                   </label>
//                   <div className="flex gap-2">
//                     <select
//                       value={formData.currency}
//                       onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
//                       className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground w-20"
//                     >
//                       {currencies.map((currency) => (
//                         <option key={currency.value} value={currency.value}>
//                           {currency.label}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       type="number"
//                       value={formData.price}
//                       onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
//                       className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                       required
//                       min="0"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <MultiLanguageInput
//                 label={t('propertyForm.description')}
//                 value={formData.description}
//                 valueAr={formData.description_ar}
//                 valueFr={formData.description_fr}
//                 onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
//                 onChangeAr={(value) => setFormData(prev => ({ ...prev, description_ar: value }))}
//                 onChangeFr={(value) => setFormData(prev => ({ ...prev, description_fr: value }))}
//                 textarea
//                 rows={6}
//                 placeholder="propertyForm.descriptionPlaceholder"
//               />
//             </div>

//             {/* 2. Property Details */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">2</span>
//                 {t('propertyForm.sections.propertyDetails')}
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Bedrooms
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.beds}
//                     onChange={(e) => setFormData(prev => ({ ...prev, beds: Number(e.target.value) }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     min="0"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Bathrooms
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.baths}
//                     onChange={(e) => setFormData(prev => ({ ...prev, baths: Number(e.target.value) }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     min="0"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Area (sqft)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.sqft}
//                     onChange={(e) => setFormData(prev => ({ ...prev, sqft: Number(e.target.value) }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     min="0"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Furnished
//                   </label>
//                   <select
//                     value={formData.furnished === true ? 'true' : formData.furnished === false ? 'false' : ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, furnished: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   >
//                     <option value="">Not specified</option>
//                     <option value="true">Furnished</option>
//                     <option value="false">Unfurnished</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Parking
//                   </label>
//                   <select
//                     value={formData.parking || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.value || undefined }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   >
//                     <option value="">Not specified</option>
//                     <option value="yes">Yes</option>
//                     <option value="no">No</option>
//                     <option value="covered">Covered</option>
//                     <option value="open">Open</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Property Age
//                   </label>
//                   <select
//                     value={formData.property_age || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, property_age: e.target.value || undefined }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   >
//                     <option value="">Not specified</option>
//                     <option value="new">New (0 years)</option>
//                     <option value="1-5">1-5 years</option>
//                     <option value="5-10">5-10 years</option>
//                     <option value="10+">10+ years</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Completion Status
//                   </label>
//                   <select
//                     value={formData.completion || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, completion: e.target.value || undefined }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   >
//                     <option value="">Not specified</option>
//                     <option value="ready">Ready to Move</option>
//                     <option value="off-plan">Off-Plan</option>
//                     <option value="under-construction">Under Construction</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* 3. Location */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">3</span>
//                 {t('propertyForm.sections.location')}
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.address}
//                     onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     placeholder="Full address"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.city}
//                     onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Area
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.area}
//                     onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
//                     className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     placeholder="e.g., Downtown Dubai"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Select Location on Map
//                   </label>
//                   <LocationPicker 
//                     lat={formData.coords?.lat || 25.2048} 
//                     lng={formData.coords?.lng || 55.2708} 
//                     onChange={handleLocationChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Coordinates (Optional)
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="number"
//                       step="any"
//                       placeholder="Latitude"
//                       value={formData.coords?.lat || ''}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         coords: {
//                           lat: Number(e.target.value),
//                           lng: prev.coords?.lng || 0
//                         }
//                       }))}
//                       className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     />
//                     <input
//                       type="number"
//                       step="any"
//                       placeholder="Longitude"
//                       value={formData.coords?.lng || ''}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         coords: {
//                           lat: prev.coords?.lat || 0,
//                           lng: Number(e.target.value)
//                         }
//                       }))}
//                       className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 4. Video URL */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">4</span>
//                 {t('propertyForm.sections.videoUrl')}
//               </h3>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Video URL (Optional)
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.video_url || ''}
//                   onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
//                   className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Add a YouTube, Vimeo, or direct video URL to showcase your property
//                 </p>
//               </div>
//             </div>

//             {/* 5. Property Images */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">5</span>
//                 {t('propertyForm.sections.propertyImages')}
//               </h3>

//               <div className="space-y-4">
//                 {/* Drag & Drop Upload Area */}
//                 <div
//                   className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
//                     isDragOver
//                       ? 'border-primary bg-primary/5'
//                       : 'border-border hover:border-primary/50'
//                   }`}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                 >
//                   <CloudArrowUpIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <div className="space-y-2">
//                     <p className="text-lg font-medium text-foreground">
//                       Drag & drop images here, or click to browse
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Supports JPG, PNG, WebP up to 10MB each
//                     </p>
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleFileSelect}
//                     className="hidden"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//                   >
//                     Choose Files
//                   </button>
//                 </div>

//                 {/* URL Input as Alternative */}
//                 <div className="flex gap-2">
//                   <input
//                     type="url"
//                     value={newImageUrl}
//                     onChange={(e) => setNewImageUrl(e.target.value)}
//                     placeholder="Or paste image URL here..."
//                     className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                   />
//                   <button
//                     type="button"
//                     onClick={addImage}
//                     disabled={!newImageUrl.trim()}
//                     className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <PlusIcon className="h-5 w-5" />
//                   </button>
//                 </div>

//                 {/* Image Gallery */}
//                 {formData.images.length > 0 && (
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <label className="block text-sm font-medium text-foreground">
//                         Select Main Image
//                       </label>
//                       <button
//                         type="button"
//                         onClick={() => setShowReorderMode(!showReorderMode)}
//                         className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
//                       >
//                         <ArrowsUpDownIcon className="h-4 w-4" />
//                         {showReorderMode ? 'Done Reordering' : 'Reorder Images'}
//                       </button>
//                     </div>

//                     <select
//                       value={mainImageIndex}
//                       onChange={(e) => setMainImageIndex(Number(e.target.value))}
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     >
//                       {formData.images.map((image, index) => (
//                         <option key={index} value={index}>
//                           Image {index + 1} {index === mainImageIndex ? '(Main)' : ''}
//                         </option>
//                       ))}
//                     </select>

//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                       {formData.images.map((image, index) => (
//                         <div
//                           key={index}
//                           className={`relative group border rounded-lg overflow-hidden ${
//                             showReorderMode ? 'cursor-move' : ''
//                           } ${index === mainImageIndex ? 'ring-2 ring-primary' : ''}`}
//                           draggable={showReorderMode}
//                           onDragStart={(e) => handleImageDragStart(e, index)}
//                           onDragOver={(e) => e.preventDefault()}
//                           onDrop={(e) => handleImageDrop(e, index)}
//                         >
//                           <img
//                             src={image}
//                             alt={`Property image ${index + 1}`}
//                             className="w-full h-24 object-cover"
//                           />

//                           {/* Main Image Badge */}
//                           {index === mainImageIndex && (
//                             <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded shadow-lg">
//                               Main
//                             </div>
//                           )}

//                           {/* Image Number */}
//                           <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
//                             {index + 1}
//                           </div>

//                           {/* Action Buttons */}
//                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
//                             <button
//                               type="button"
//                               onClick={() => setMainImageIndex(index)}
//                               className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
//                               title="Set as main image"
//                             >
//                               <PhotoIcon className="h-4 w-4" />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => removeImage(index)}
//                               className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
//                               title="Remove image"
//                             >
//                               <TrashIcon className="h-4 w-4" />
//                             </button>
//                           </div>

//                           {/* Drag Handle */}
//                           {showReorderMode && (
//                             <div className="absolute bottom-2 right-2 p-1 bg-black/50 text-white rounded">
//                               <ArrowsUpDownIcon className="h-4 w-4" />
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* 6. Floorplans */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">6</span>
//                 {t('propertyForm.sections.floorplans')}
//               </h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Add Floorplan URL
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="url"
//                       value={newFloorplanUrl}
//                       onChange={(e) => setNewFloorplanUrl(e.target.value)}
//                       placeholder="https://example.com/floorplan.jpg"
//                       className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     />
//                     <button
//                       type="button"
//                       onClick={addFloorplan}
//                       className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//                     >
//                       <PlusIcon className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>

//                 {formData.floorplans.length > 0 && (
//                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {formData.floorplans.map((floorplan, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={floorplan}
//                           alt={`Floorplan ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg border border-border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeFloorplan(index)}
//                           className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <XMarkIcon className="h-4 w-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* 7. Features */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">7</span>
//                 {t('propertyForm.sections.featuresAmenities')}
//               </h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Add Custom Feature
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={newFeature}
//                       onChange={(e) => setNewFeature(e.target.value)}
//                       placeholder="e.g., Private Elevator"
//                       className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
//                     />
//                     <button
//                       type="button"
//                       onClick={addFeature}
//                       className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//                     >
//                       <PlusIcon className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Common Features
//                   </label>
//                   <div className="flex flex-wrap gap-2">
//                     {commonFeatures.map((feature) => (
//                       <button
//                         key={feature}
//                         type="button"
//                         onClick={() => addCommonFeature(feature)}
//                         className={`px-3 py-1 text-sm rounded-full border transition-colors ${
//                           formData.features.includes(feature)
//                             ? 'bg-primary text-primary-foreground border-primary'
//                             : 'bg-background text-foreground border-border hover:bg-muted'
//                         }`}
//                       >
//                         {feature}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {formData.features.length > 0 && (
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">
//                       Selected Features
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {formData.features.map((feature) => (
//                         <div
//                           key={feature}
//                           className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
//                         >
//                           <span>{feature}</span>
//                           <button
//                             type="button"
//                             onClick={() => removeFeature(feature)}
//                             className="hover:bg-primary/20 rounded-full p-0.5"
//                           >
//                             <XMarkIcon className="h-3 w-3" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* 8. Publishing Options */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">8</span>
//                 {t('propertyForm.sections.publishingOptions')}
//               </h3>

//               <div className="flex items-center gap-6">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={formData.published}
//                     onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
//                     className="rounded border-border text-primary focus:ring-primary/20"
//                   />
//                   <span className="text-sm font-medium text-foreground">Published</span>
//                 </label>

//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={formData.featured}
//                     onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
//                     className="rounded border-border text-primary focus:ring-primary/20"
//                   />
//                   <span className="text-sm font-medium text-foreground">Featured</span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-between gap-4 p-6 border-t border-border bg-muted/30">
//             {mode === 'edit' && (
//               <button
//                 type="button"
//                 onClick={handleDeleteProperty}
//                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             )}
//             <div className="flex items-center gap-4 ml-auto">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
//                     {mode === 'create' ? 'Creating...' : 'Updating...'}
//                   </span>
//                 ) : (
//                   mode === 'create' ? 'Create Property' : 'Update Property'
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// new code
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { XMarkIcon, PhotoIcon, MapPinIcon, PlusIcon, TrashIcon, CloudArrowUpIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { db, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from '@/lib/firebase'

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import('@/components/shared/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center border border-border">
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <MapPinIcon className="w-8 h-8 animate-bounce" />
        <p className="text-sm font-medium">Loading Map...</p>
      </div>
    </div>
  )
})

interface PropertyFormData {
  id?: string
  title: string
  title_ar?: string
  title_fr?: string
  slug: string
  description: string
  description_ar?: string
  description_fr?: string
  category_id?: string
  type: string
  status: string
  property_status: string
  price: number
  currency: string
  beds: number
  baths: number
  sqft: number
  images: string[]
  floorplans: string[]
  features: string[]
  address: string
  city: string
  area: string
  coords: { lat: number; lng: number } | null
  published: boolean
  featured: boolean
  project_id?: string
  developer_id?: string
  agent_id?: string
  video_url?: string
  // Additional fields for comprehensive filtering
  furnished?: boolean
  parking?: string
  property_age?: string
  completion?: string
  created_at?: string
  updated_at?: string
  views_count?: number
  inquiries_count?: number
}

interface PropertyFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: PropertyFormData) => void // Make optional since we'll handle internally
  initialData?: Partial<PropertyFormData>
  mode?: 'create' | 'edit'
  agents?: any[]
  categories?: any[]
  onSuccess?: () => void // Callback after successful save
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'furnished-studio', label: 'Furnished Studio' },
  { value: 'residential-plot', label: 'Residential Plot' },
  { value: 'industrial-plot', label: 'Industrial Plot' },
]

const propertyStatuses = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
]

const propertyStatusOptions = [
  { value: 'ready', label: 'Ready' },
  { value: 'off-plan', label: 'Off Plan' },
  { value: 'under-construction', label: 'Under Construction' },
  { value: 'reserved', label: 'Reserved' },
]

const currencies = [
  { value: 'AED', label: 'AED' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

const commonFeatures = [
  'Swimming Pool',
  'Gym & Fitness Center',
  'Concierge Service',
  'Valet Parking',
  'Rooftop Terrace',
  'Floor-to-Ceiling Windows',
  'Premium Appliances',
  'Walk-in Closets',
  'Smart Home System',
  '24/7 Security',
  'Balcony',
  'Built-in Wardrobes',
  'Parking',
  'Garden',
  'Maid Service',
  'Sea View',
  'City View',
  'Burj Khalifa View',
  // Special features for filtering
  'Beachfront',
  'Marina View',
  'Golf Course',
  'Private Pool',
  'Penthouse',
  'Duplex',
  'Townhouse'
]

interface MultiLanguageInputProps {
  label: string
  value: string
  valueAr?: string
  valueFr?: string
  onChange: (value: string) => void
  onChangeAr?: (value: string) => void
  onChangeFr?: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  textarea?: boolean
}

function MultiLanguageInput({
  label,
  value,
  valueAr,
  valueFr,
  onChange,
  onChangeAr,
  onChangeFr,
  placeholder,
  required,
  rows = 3,
  textarea = false
}: MultiLanguageInputProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'en' | 'ar' | 'fr'>('en')

  const languages = [
    { code: 'en' as const, name: t('propertyForm.languages.english'), flag: '🇺🇸' },
    { code: 'fr' as const, name: t('propertyForm.languages.french'), flag: '🇫🇷' },
    { code: 'ar' as const, name: t('propertyForm.languages.arabic'), flag: '🇦🇪' }
  ]

  const getCurrentValue = () => {
    switch (activeTab) {
      case 'ar': return valueAr || ''
      case 'fr': return valueFr || ''
      default: return value
    }
  }

  const handleValueChange = (newValue: string) => {
    switch (activeTab) {
      case 'ar': onChangeAr?.(newValue); break
      case 'fr': onChangeFr?.(newValue); break
      default: onChange(newValue); break
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label} {required && '*'}
      </label>

      {/* Language Tabs */}
      <div className="flex border-b border-border">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setActiveTab(lang.code)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === lang.code
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>

      {/* Input Field */}
      {textarea ? (
        <textarea
          value={getCurrentValue()}
          onChange={(e) => handleValueChange(e.target.value)}
          rows={rows}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground resize-none"
          placeholder={placeholder ? t(placeholder, { language: languages.find(l => l.code === activeTab)?.name }) : undefined}
          required={required && activeTab === 'en'}
        />
      ) : (
        <input
          type="text"
          value={getCurrentValue()}
          onChange={(e) => handleValueChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
          placeholder={placeholder ? t(placeholder, { language: languages.find(l => l.code === activeTab)?.name }) : undefined}
          required={required && activeTab === 'en'}
        />
      )}

      {/* Character Count for Description */}
      {textarea && activeTab === 'en' && (
        <p className="text-xs text-muted-foreground">
          {value.length} characters
        </p>
      )}
    </div>
  )
}

export default function PropertyForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
  agents = [],
  categories = [],
  onSuccess
}: PropertyFormProps) {
  const { t } = useTranslation()
  const [activeLanguageTab, setActiveLanguageTab] = useState<'en' | 'ar' | 'fr'>('en')
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData?.title || '',
    title_ar: initialData?.title_ar || '',
    title_fr: initialData?.title_fr || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    description_ar: initialData?.description_ar || '',
    description_fr: initialData?.description_fr || '',
    category_id: initialData?.category_id || '',
    type: initialData?.type || 'apartment',
    status: initialData?.status || 'sale',
    property_status: initialData?.property_status || 'ready',
    price: initialData?.price || 0,
    currency: initialData?.currency || 'AED',
    beds: initialData?.beds || 0,
    baths: initialData?.baths || 0,
    sqft: initialData?.sqft || 0,
    images: initialData?.images || [],
    floorplans: initialData?.floorplans || [],
    features: initialData?.features || [],
    address: initialData?.address || '',
    city: initialData?.city || 'Dubai',
    area: initialData?.area || '',
    coords: initialData?.coords || null,
    published: initialData?.published || false,
    featured: initialData?.featured || false,
    project_id: initialData?.project_id,
    developer_id: initialData?.developer_id,
    agent_id: initialData?.agent_id,
    video_url: initialData?.video_url || '',
    // Additional fields for comprehensive filtering
    furnished: initialData?.furnished,
    parking: initialData?.parking,
    property_age: initialData?.property_age,
    completion: initialData?.completion,
  })

  const [newImageUrl, setNewImageUrl] = useState('')
  const [newFloorplanUrl, setNewFloorplanUrl] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showReorderMode, setShowReorderMode] = useState(false)
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Firebase se categories aur agents fetch karne ke liye states
  const [firebaseCategories, setFirebaseCategories] = useState<any[]>([])
  const [firebaseAgents, setFirebaseAgents] = useState<any[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isLoadingAgents, setIsLoadingAgents] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        title_ar: initialData.title_ar || '',
        title_fr: initialData.title_fr || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        description_ar: initialData.description_ar || '',
        description_fr: initialData.description_fr || '',
        category_id: initialData.category_id || '',
        type: initialData.type || 'apartment',
        status: initialData.status || 'sale',
        property_status: initialData.property_status || 'ready',
        price: initialData.price || 0,
        currency: initialData.currency || 'AED',
        beds: initialData.beds || 0,
        baths: initialData.baths || 0,
        sqft: initialData.sqft || 0,
        images: initialData.images || [],
        floorplans: initialData.floorplans || [],
        features: initialData.features || [],
        address: initialData.address || '',
        city: initialData.city || 'Dubai',
        area: initialData.area || '',
        coords: initialData.coords || null,
        published: initialData.published || false,
        featured: initialData.featured || false,
        project_id: initialData.project_id,
        developer_id: initialData.developer_id,
        agent_id: initialData.agent_id,
        video_url: initialData.video_url || '',
        furnished: initialData.furnished,
        parking: initialData.parking,
        property_age: initialData.property_age,
        completion: initialData.completion,
      })
    }
  }, [initialData])

  // Firebase se categories aur agents fetch karein
  useEffect(() => {
    const fetchData = async () => {
      // Categories fetch karein
      setIsLoadingCategories(true)
      try {
        const categoriesRef = collection(db, "categories")
        const categoriesSnapshot = await getDocs(categoriesRef)
        
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setFirebaseCategories(categoriesList)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoadingCategories(false)
      }

      // Agents fetch karein
      setIsLoadingAgents(true)
      try {
        const agentsRef = collection(db, "agents")
        const agentsSnapshot = await getDocs(agentsRef)
        
        const agentsList = agentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setFirebaseAgents(agentsList)
      } catch (error) {
        console.error("Error fetching agents:", error)
      } finally {
        setIsLoadingAgents(false)
      }
    }
    
    fetchData()
  }, [])

  // Categories list ko prioritize karein (first Firebase categories, then props)
  const categoriesList = firebaseCategories.length > 0 ? firebaseCategories : (categories || [])

  // Agents list ko prioritize karein (first Firebase agents, then props)
  const agentsList = firebaseAgents.length > 0 ? firebaseAgents : (agents || [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleLocationChange = useCallback((lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      coords: { lat, lng },
      address: address
    }))
  }, [])

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    if (mainImageIndex >= index && mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1)
    }
  }

  // Enhanced Image Management Functions
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await handleFileUpload(files)
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await handleFileUpload(files)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileUpload = async (files: File[]) => {
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
        continue
      }

      try {
        // In a real application, you would upload to a cloud storage service
        // For now, we'll create a data URL for demonstration
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, dataUrl]
          }))
        }
        reader.readAsDataURL(file)

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert(`Failed to upload "${file.name}". Please try again.`)
      }
    }

    setTimeout(() => setUploadProgress(0), 1000)
  }

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    if (!showReorderMode) return
    setDraggedImageIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (!showReorderMode || draggedImageIndex === null || draggedImageIndex === dropIndex) {
      setDraggedImageIndex(null)
      return
    }

    const newImages = [...formData.images]
    const [draggedImage] = newImages.splice(draggedImageIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)

    setFormData(prev => ({
      ...prev,
      images: newImages
    }))

    // Update main image index if it was moved
    if (mainImageIndex === draggedImageIndex) {
      setMainImageIndex(dropIndex)
    } else if (mainImageIndex > draggedImageIndex && mainImageIndex <= dropIndex) {
      setMainImageIndex(mainImageIndex - 1)
    } else if (mainImageIndex < draggedImageIndex && mainImageIndex >= dropIndex) {
      setMainImageIndex(mainImageIndex + 1)
    }

    setDraggedImageIndex(null)
  }

  const addFloorplan = () => {
    if (newFloorplanUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        floorplans: [...prev.floorplans, newFloorplanUrl.trim()]
      }))
      setNewFloorplanUrl('')
    }
  }

  const removeFloorplan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      floorplans: prev.floorplans.filter((_, i) => i !== index)
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const addCommonFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
    }
  }

  // FIREBASE SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.title.trim()) {
        alert('Property title is required')
        return
      }

      if (!formData.price || formData.price <= 0) {
        alert('Valid price is required')
        return
      }

      // Ensure main image is first in the array
      const reorderedImages = [...formData.images]
      if (mainImageIndex > 0) {
        const mainImage = reorderedImages.splice(mainImageIndex, 1)[0]
        reorderedImages.unshift(mainImage)
      }

      // Prepare data for Firebase
      const propertyData: any = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || generateSlug(formData.title),
        description: formData.description.trim(),
        type: formData.type,
        status: formData.status,
        property_status: formData.property_status,
        price: formData.price,
        currency: formData.currency,
        beds: formData.beds || 0,
        baths: formData.baths || 0,
        sqft: formData.sqft || 0,
        images: reorderedImages,
        floorplans: formData.floorplans,
        features: formData.features,
        address: formData.address.trim(),
        city: formData.city.trim(),
        area: formData.area.trim(),
        coords: formData.coords,
        published: formData.published,
        featured: formData.featured,
        video_url: formData.video_url?.trim() || null,
        // Additional fields
        furnished: formData.furnished || false,
        parking: formData.parking || null,
        property_age: formData.property_age || null,
        completion: formData.completion || null,
        // Timestamps
        updated_at: new Date().toISOString(),
        // Counters
        views_count: initialData?.views_count || 0,
        inquiries_count: initialData?.inquiries_count || 0,
      }

      // Add optional fields if they exist
      if (formData.title_ar?.trim()) propertyData.title_ar = formData.title_ar.trim()
      if (formData.title_fr?.trim()) propertyData.title_fr = formData.title_fr.trim()
      if (formData.description_ar?.trim()) propertyData.description_ar = formData.description_ar.trim()
      if (formData.description_fr?.trim()) propertyData.description_fr = formData.description_fr.trim()
      if (formData.category_id?.trim()) propertyData.category_id = formData.category_id.trim()
      if (formData.project_id?.trim()) propertyData.project_id = formData.project_id.trim()
      if (formData.developer_id?.trim()) propertyData.developer_id = formData.developer_id.trim()
      if (formData.agent_id?.trim()) propertyData.agent_id = formData.agent_id.trim()

      console.log('Submitting property data:', propertyData)

      if (mode === 'edit' && initialData?.id) {
        // Update existing property in Firebase
        const propertyRef = doc(db, "properties", initialData.id)
        
        // Keep created_at from original
        propertyData.created_at = initialData.created_at || new Date().toISOString()
        
        await updateDoc(propertyRef, propertyData)
        
        console.log('Property updated in Firebase:', initialData.id)
        alert('Property updated successfully!')
      } else {
        // Create new property in Firebase
        propertyData.created_at = new Date().toISOString()
        
        const docRef = await addDoc(collection(db, "properties"), propertyData)
        
        console.log('Property created in Firebase with ID:', docRef.id)
        alert('Property created successfully!')
      }

      // Call custom onSubmit if provided
      if (onSubmit) {
        onSubmit({
          ...propertyData,
          id: mode === 'edit' ? initialData?.id : undefined
        })
      }

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }

      // Close modal
      onClose()

    } catch (error: any) {
      console.error('Error saving property:', error)
      
      let errorMessage = 'Error saving property. Please try again.'
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check Firebase rules.'
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // DELETE PROPERTY FUNCTION
  const handleDeleteProperty = async () => {
    if (!initialData?.id) return
    
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    try {
      const propertyRef = doc(db, "properties", initialData.id)
      await deleteDoc(propertyRef)
      
      alert('Property deleted successfully!')
      
      if (onSuccess) {
        onSuccess()
      }
      
      onClose()
    } catch (error: any) {
      console.error('Error deleting property:', error)
      alert('Error deleting property. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {mode === 'create' ? t('propertyForm.addNewProperty') : t('propertyForm.editProperty')}
                <span className="text-sm text-blue-100 ml-2">(Firebase)</span>
              </h2>
              <p className="text-blue-100">
                {mode === 'create' ? t('propertyForm.fillDetails') : t('propertyForm.updateDetails')}
              </p>
            </div>
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete Property
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="p-6 space-y-8">
            {/* 1. Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">1</span>
                {t('propertyForm.sections.basicInfo')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <MultiLanguageInput
                    label={t('propertyForm.title')}
                    value={formData.title}
                    valueAr={formData.title_ar}
                    valueFr={formData.title_fr}
                    onChange={(value) => handleTitleChange(value)}
                    onChangeAr={(value) => setFormData(prev => ({ ...prev, title_ar: value }))}
                    onChangeFr={(value) => setFormData(prev => ({ ...prev, title_fr: value }))}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Slug {!formData.slug && '(Auto-generated)'}
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    required
                  >
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  {isLoadingCategories ? (
                    <div className="w-full px-3 py-2 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm text-muted-foreground">Loading categories...</span>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={formData.category_id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value || undefined }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    >
                      <option value="">Select a category...</option>
                      {categoriesList.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name || category.title || "Unnamed Category"}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    required
                  >
                    {propertyStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Status
                  </label>
                  <select
                    value={formData.property_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, property_status: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  >
                    {propertyStatusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Assigned Agent
                  </label>
                  {isLoadingAgents ? (
                    <div className="w-full px-3 py-2 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm text-muted-foreground">Loading agents...</span>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={formData.agent_id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, agent_id: e.target.value || undefined }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    >
                      <option value="">Select an agent...</option>
                      {agentsList.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.title || agent.name || agent.full_name || 'Unnamed Agent'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground w-20"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                      required
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <MultiLanguageInput
                label={t('propertyForm.description')}
                value={formData.description}
                valueAr={formData.description_ar}
                valueFr={formData.description_fr}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                onChangeAr={(value) => setFormData(prev => ({ ...prev, description_ar: value }))}
                onChangeFr={(value) => setFormData(prev => ({ ...prev, description_fr: value }))}
                textarea
                rows={6}
                placeholder="propertyForm.descriptionPlaceholder"
              />
            </div>

            {/* 2. Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">2</span>
                {t('propertyForm.sections.propertyDetails')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.beds}
                    onChange={(e) => setFormData(prev => ({ ...prev, beds: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.baths}
                    onChange={(e) => setFormData(prev => ({ ...prev, baths: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Area (sqft)
                  </label>
                  <input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData(prev => ({ ...prev, sqft: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Furnished
                  </label>
                  <select
                    value={formData.furnished === true ? 'true' : formData.furnished === false ? 'false' : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, furnished: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  >
                    <option value="">Not specified</option>
                    <option value="true">Furnished</option>
                    <option value="false">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Parking
                  </label>
                  <select
                    value={formData.parking || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.value || undefined }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  >
                    <option value="">Not specified</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="covered">Covered</option>
                    <option value="open">Open</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Age
                  </label>
                  <select
                    value={formData.property_age || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, property_age: e.target.value || undefined }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  >
                    <option value="">Not specified</option>
                    <option value="new">New (0 years)</option>
                    <option value="1-5">1-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Completion Status
                  </label>
                  <select
                    value={formData.completion || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, completion: e.target.value || undefined }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  >
                    <option value="">Not specified</option>
                    <option value="ready">Ready to Move</option>
                    <option value="off-plan">Off-Plan</option>
                    <option value="under-construction">Under Construction</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">3</span>
                {t('propertyForm.sections.location')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    placeholder="Full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    placeholder="e.g., Downtown Dubai"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Location on Map
                  </label>
                  <LocationPicker 
                    lat={formData.coords?.lat || 25.2048} 
                    lng={formData.coords?.lng || 55.2708} 
                    onChange={handleLocationChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Coordinates (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={formData.coords?.lat || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        coords: {
                          lat: Number(e.target.value),
                          lng: prev.coords?.lng || 0
                        }
                      }))}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={formData.coords?.lng || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        coords: {
                          lat: prev.coords?.lat || 0,
                          lng: Number(e.target.value)
                        }
                      }))}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Video URL */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">4</span>
                {t('propertyForm.sections.videoUrl')}
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add a YouTube, Vimeo, or direct video URL to showcase your property
                </p>
              </div>
            </div>

            {/* 5. Property Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">5</span>
                {t('propertyForm.sections.propertyImages')}
              </h3>

              <div className="space-y-4">
                {/* Drag & Drop Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <CloudArrowUpIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">
                      Drag & drop images here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, WebP up to 10MB each
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Choose Files
                  </button>
                </div>

                {/* URL Input as Alternative */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste image URL here..."
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    disabled={!newImageUrl.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Image Gallery */}
                {formData.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-foreground">
                        Select Main Image
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowReorderMode(!showReorderMode)}
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ArrowsUpDownIcon className="h-4 w-4" />
                        {showReorderMode ? 'Done Reordering' : 'Reorder Images'}
                      </button>
                    </div>

                    <select
                      value={mainImageIndex}
                      onChange={(e) => setMainImageIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    >
                      {formData.images.map((image, index) => (
                        <option key={index} value={index}>
                          Image {index + 1} {index === mainImageIndex ? '(Main)' : ''}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative group border rounded-lg overflow-hidden ${
                            showReorderMode ? 'cursor-move' : ''
                          } ${index === mainImageIndex ? 'ring-2 ring-primary' : ''}`}
                          draggable={showReorderMode}
                          onDragStart={(e) => handleImageDragStart(e, index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleImageDrop(e, index)}
                        >
                          <img
                            src={image}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />

                          {/* Main Image Badge */}
                          {index === mainImageIndex && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded shadow-lg">
                              Main
                            </div>
                          )}

                          {/* Image Number */}
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                            {index + 1}
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setMainImageIndex(index)}
                              className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                              title="Set as main image"
                            >
                              <PhotoIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                              title="Remove image"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Drag Handle */}
                          {showReorderMode && (
                            <div className="absolute bottom-2 right-2 p-1 bg-black/50 text-white rounded">
                              <ArrowsUpDownIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Floorplans */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">6</span>
                {t('propertyForm.sections.floorplans')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Add Floorplan URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newFloorplanUrl}
                      onChange={(e) => setNewFloorplanUrl(e.target.value)}
                      placeholder="https://example.com/floorplan.jpg"
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                    <button
                      type="button"
                      onClick={addFloorplan}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {formData.floorplans.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.floorplans.map((floorplan, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={floorplan}
                          alt={`Floorplan ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeFloorplan(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 7. Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">7</span>
                {t('propertyForm.sections.featuresAmenities')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Add Custom Feature
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="e.g., Private Elevator"
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Common Features
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonFeatures.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => addCommonFeature(feature)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          formData.features.includes(feature)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.features.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Selected Features
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 8. Publishing Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">8</span>
                {t('propertyForm.sections.publishingOptions')}
              </h3>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-foreground">Published</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-foreground">Featured</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 p-6 border-t border-border bg-muted/30">
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDeleteProperty}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
            <div className="flex items-center gap-4 ml-auto">
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
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </span>
                ) : (
                  mode === 'create' ? 'Create Property' : 'Update Property'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}