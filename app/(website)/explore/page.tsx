'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPinIcon, ArrowRightIcon, BuildingOfficeIcon, HomeIcon, SparklesIcon } from '@heroicons/react/24/outline'
import AgentSlider from '@/components/agent/AgentSlider'
import { getTopAgents } from '@/lib/mock-data'

const areas = [
  {
    id: 'dubai-marina',
    name: 'Dubai Marina',
    description: 'A stunning waterfront community known for its high-rise luxury apartments, vibrant nightlife, and the famous Marina Walk.',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
    stats: { properties: '1,240+', avgPrice: '2.5M', type: 'Waterfront' },
    tags: ['Luxury', 'Nightlife', 'Beach Access']
  },
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai',
    description: 'The heart of the city, home to the Burj Khalifa, Dubai Mall, and the Dubai Fountain. The ultimate urban luxury living.',
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    stats: { properties: '850+', avgPrice: '3.8M', type: 'Urban' },
    tags: ['Iconic', 'Shopping', 'Business']
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    description: 'The world-famous man-made island offering exclusive beachfront villas and ultra-luxury resorts.',
    image: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800',
    stats: { properties: '420+', avgPrice: '12M', type: 'Island' },
    tags: ['Beachfront', 'Exclusive', 'Resort']
  },
  {
    id: 'business-bay',
    name: 'Business Bay',
    description: 'A trendy mixed-use district with sleek office towers and stylish residential apartments along the Dubai Canal.',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    stats: { properties: '960+', avgPrice: '1.8M', type: 'Business' },
    tags: ['Modern', 'Canal View', 'Central']
  },
  {
    id: 'emirates-hills',
    name: 'Emirates Hills',
    description: 'The "Beverly Hills of Dubai," featuring massive custom-built mansions overlooking lush golf courses.',
    image: 'https://images.pexels.com/photos/2121287/pexels-photo-2121287.jpeg?auto=compress&cs=tinysrgb&w=800',
    stats: { properties: '150+', avgPrice: '45M', type: 'Golf' },
    tags: ['Ultra-Luxury', 'Private', 'Golf']
  },
  {
    id: 'jumeirah-beach-residence',
    name: 'JBR',
    description: 'A popular beachside community offering a relaxed Mediterranean lifestyle with plenty of dining and retail options.',
    image: 'https://images.pexels.com/photos/4819372/pexels-photo-4819372.jpeg?auto=compress&cs=tinysrgb&w=800',
    stats: { properties: '680+', avgPrice: '2.2M', type: 'Beach' },
    tags: ['Family', 'Beach', 'Retail']
  }
]

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Dubai Areas"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-primary font-bold tracking-[0.4em] uppercase text-sm mb-6 animate-slide-up">
            Neighborhood Guide
          </h2>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 animate-slide-up [animation-delay:100ms]">
            Explore <span className="text-gradient">Dubai</span> Areas
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium animate-slide-up [animation-delay:200ms]">
            Discover the unique character, lifestyle, and property opportunities in Dubai's most sought-after communities.
          </p>
        </div>
      </section>

      {/* Top Agents Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
              Meet Our <span className="text-primary italic">Expert Agents</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Connect with Dubai's most experienced real estate professionals who know every neighborhood intimately.
            </p>
          </div>
          <AgentSlider agents={getTopAgents(4)} showCount={4} />
        </div>
      </section>

      {/* Areas Grid */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {areas.map((area, i) => (
              <div key={area.id} className="group flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                  <img 
                    src={area.image} 
                    alt={area.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-secondary text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      {area.stats.type}
                    </span>
                  </div>
                </div>
                
                <div className="md:w-3/5 p-10 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">{area.name}</h3>
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
                    {area.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-slate-50">
                    <div>
                      <div className="text-2xl font-black text-slate-900">{area.stats.properties}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Properties</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">AED {area.stats.avgPrice}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Price</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {area.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link href={`/properties?area=${area.name}`} className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs group/link">
                    View Properties in {area.name}
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Can't Decide on an <span className="text-primary">Area</span>?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
            Our area specialists can help you find the perfect neighborhood that matches your lifestyle and investment goals.
          </p>
          <Link href="/contact" className="btn-primary !rounded-full !px-12 !py-5">
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  )
}
