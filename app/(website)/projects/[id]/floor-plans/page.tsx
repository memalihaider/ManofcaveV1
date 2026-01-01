"use client"

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import {
  ArrowLeftIcon,
  HomeIcon,
  CubeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

// Mock floor plans data - in a real app, this would come from an API
const floorPlansData = {
  '1': { // Emaar Beachfront
    name: 'Emaar Beachfront',
    floorPlans: [
      {
        id: '1bed',
        name: '1 Bedroom Apartment',
        type: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        price: 1850000,
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Balcony', 'Kitchen', 'Living Room', 'Bathroom']
      },
      {
        id: '2bed',
        name: '2 Bedroom Apartment',
        type: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 950,
        price: 2750000,
        image: 'https://images.pexels.com/photos/1396074/pexels-photo-1396074.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Master Bedroom', 'Guest Room', 'Open Kitchen', '2 Bathrooms', 'Balcony']
      },
      {
        id: 'penthouse',
        name: '3 Bedroom Penthouse',
        type: 'Penthouse',
        bedrooms: 3,
        bathrooms: 3,
        area: 1800,
        price: 5200000,
        image: 'https://images.pexels.com/photos/1396124/pexels-photo-1396124.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Private Terrace', 'Master Suite', 'Home Office', 'Maids Room', '3 Bathrooms', 'Panoramic Views']
      }
    ]
  },
  '2': { // DAMAC Hills
    name: 'DAMAC Hills',
    floorPlans: [
      {
        id: 'townhouse',
        name: '3 Bedroom Townhouse',
        type: 'Townhouse',
        bedrooms: 3,
        bathrooms: 3,
        area: 2200,
        price: 3950000,
        image: 'https://images.pexels.com/photos/1396126/pexels-photo-1396126.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Private Garden', '3 Floors', 'Garage', 'Maids Room', 'Storage']
      },
      {
        id: 'villa',
        name: '4 Bedroom Villa',
        type: 'Villa',
        bedrooms: 4,
        bathrooms: 4,
        area: 3200,
        price: 4850000,
        image: 'https://images.pexels.com/photos/1396128/pexels-photo-1396128.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Private Pool', 'Garden', '4 Bedrooms', 'Study Room', 'Maids Quarter', '2-Car Garage']
      }
    ]
  },
  '3': { // Palm Jumeirah Residences
    name: 'Palm Jumeirah Residences',
    floorPlans: [
      {
        id: '2bed-gulf',
        name: '2 Bedroom with Gulf View',
        type: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        price: 6200000,
        image: 'https://images.pexels.com/photos/1396130/pexels-photo-1396130.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Gulf Views', 'Private Balcony', 'Premium Finishes', 'Built-in Wardrobes']
      },
      {
        id: '3bed-penthouse',
        name: '3 Bedroom Penthouse',
        type: 'Penthouse',
        bedrooms: 3,
        bathrooms: 3,
        area: 2500,
        price: 12500000,
        image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['360° Views', 'Private Terrace', 'Jacuzzi', 'Wine Cellar', 'Maids Room']
      }
    ]
  },
  '4': { // Emaar Creek Harbour
    name: 'Emaar Creek Harbour',
    floorPlans: [
      {
        id: 'studio',
        name: 'Studio Apartment',
        type: 'Apartment',
        bedrooms: 0,
        bathrooms: 1,
        area: 450,
        price: 950000,
        image: 'https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Creek View', 'Open Plan', 'Built-in Kitchen', 'Balcony']
      },
      {
        id: '1bed-townhouse',
        name: '1 Bedroom Townhouse',
        type: 'Townhouse',
        bedrooms: 1,
        bathrooms: 1,
        area: 750,
        price: 1650000,
        image: 'https://images.pexels.com/photos/1396136/pexels-photo-1396136.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Private Entrance', 'Rooftop Terrace', 'Modern Kitchen', 'Parking']
      }
    ]
  },
  '5': { // DAMAC Lagoons
    name: 'DAMAC Lagoons',
    floorPlans: [
      {
        id: '2bed-lagoon',
        name: '2 Bedroom Lagoon View',
        type: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        price: 2450000,
        image: 'https://images.pexels.com/photos/1396138/pexels-photo-1396138.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Lagoon Views', 'Private Balcony', 'Eco-Friendly Design', 'Smart Home Features']
      },
      {
        id: '3bed-villa',
        name: '3 Bedroom Villa',
        type: 'Villa',
        bedrooms: 3,
        bathrooms: 3,
        area: 2800,
        price: 3650000,
        image: 'https://images.pexels.com/photos/1396140/pexels-photo-1396140.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Private Garden', 'Solar Panels', 'Water Features', '3-Car Parking', 'Maids Room']
      }
    ]
  },
  '6': { // Nakheel Islands
    name: 'Nakheel Islands',
    floorPlans: [
      {
        id: '4bed-waterfront',
        name: '4 Bedroom Waterfront Villa',
        type: 'Villa',
        bedrooms: 4,
        bathrooms: 4,
        area: 4500,
        price: 8500000,
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Private Beach', 'Boat Dock', '5 Floors', 'Elevator', 'Home Cinema', 'Wine Cellar']
      },
      {
        id: '5bed-estate',
        name: '5 Bedroom Estate',
        type: 'Villa',
        bedrooms: 5,
        bathrooms: 5,
        area: 6500,
        price: 15000000,
        image: 'https://images.pexels.com/photos/1396074/pexels-photo-1396074.jpeg?auto=compress&cs=tinysrgb&w=800',
        features: ['Private Island', 'Helipad', 'Swimming Pool', 'Tennis Court', 'Staff Quarters', '6-Car Garage']
      }
    ]
  }
}

function FloorPlansContent() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [inquiryModal, setInquiryModal] = useState(false)

  const projectData = floorPlansData[projectId as keyof typeof floorPlansData]

  if (!projectData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-secondary mb-4">Project Not Found</h1>
          <p className="text-slate-600 mb-8">The requested project floor plans are not available.</p>
          <button
            onClick={() => router.push('/projects')}
            className="px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Floor Plans"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>

        <div className="container-custom relative z-10 text-center">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>

          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Floor Plans
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
            {projectData.name}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explore our meticulously designed floor plans offering the perfect blend of luxury and functionality
          </p>
        </div>
      </section>

      {/* Floor Plans Grid */}
      <section className="py-24">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-serif text-secondary mb-4">
              Available Floor Plans
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our collection of thoughtfully designed layouts, each crafted to maximize space, light, and luxury living
            </p>
          </div>

          <div className="grid gap-8 md:gap-12">
            {projectData.floorPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 group"
              >
                <div className="grid lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative h-[300px] lg:h-[400px] overflow-hidden">
                    <Image
                      src={plan.image}
                      alt={plan.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-primary text-secondary text-sm font-bold rounded-full">
                        {plan.type}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl">
                        <div className="text-lg font-bold text-secondary">
                          AED {(plan.price / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl font-serif text-secondary mb-6 group-hover:text-primary transition-colors">
                      {plan.name}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {plan.bedrooms}
                        </div>
                        <div className="text-sm text-slate-500 uppercase tracking-widest">
                          {plan.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {plan.bathrooms}
                        </div>
                        <div className="text-sm text-slate-500 uppercase tracking-widest">
                          {plan.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {plan.area}
                        </div>
                        <div className="text-sm text-slate-500 uppercase tracking-widest">
                          Sq Ft
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {(plan.price / plan.area).toFixed(0)}
                        </div>
                        <div className="text-sm text-slate-500 uppercase tracking-widest">
                          AED/Sq Ft
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="text-sm text-slate-400 uppercase tracking-widest mb-3">Features</div>
                      <div className="flex flex-wrap gap-2">
                        {plan.features.slice(0, 4).map((feature, index) => (
                          <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setSelectedPlan(plan.id)}
                        className="px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300 shadow-xl shadow-secondary/20"
                      >
                        <EyeIcon className="h-5 w-5 inline mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => setInquiryModal(true)}
                        className="px-8 py-4 bg-white text-secondary border-2 border-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all duration-300"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 inline mr-2" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Detail Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            {(() => {
              const plan = projectData.floorPlans.find(p => p.id === selectedPlan)
              return plan ? (
                <>
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={plan.image}
                      alt={plan.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-secondary/40 flex items-center justify-center">
                      <h3 className="text-3xl font-serif text-white">{plan.name}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-all"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{plan.bedrooms}</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm">Bedrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{plan.bathrooms}</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm">Bathrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{plan.area.toLocaleString()}</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm">Square Feet</div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-secondary mb-4">Key Features</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span className="text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setInquiryModal(true)}
                        className="flex-1 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300"
                      >
                        Request More Information
                      </button>
                      <button className="flex-1 py-4 bg-slate-100 text-secondary font-bold rounded-xl hover:bg-slate-200 transition-all duration-300">
                        Schedule Viewing
                      </button>
                    </div>
                  </div>
                </>
              ) : null
            })()}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-serif text-secondary mb-6 text-center">Request Floor Plans</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300"
                >
                  Send Request
                </button>
              </form>
              <button
                onClick={() => setInquiryModal(false)}
                className="w-full mt-4 py-3 text-slate-500 hover:text-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FloorPlansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <FloorPlansContent />
    </Suspense>
  )
}