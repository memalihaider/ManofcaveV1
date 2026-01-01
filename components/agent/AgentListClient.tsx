"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { StarIcon as StarSolid, PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import { StarIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

type Agent = {
  id: string
  profile_image?: string | null
  profile?: {
    full_name?: string | null
    avatar_url?: string | null
  }
  profile_id?: string | null
  title?: string | null
  experience_years?: number | null
  properties?: number | null
  rating?: number | null
  review_count?: number | null
  specializations?: string[] | null
}

export default function AgentListClient({ agents }: { agents: Agent[] }) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = agents.filter((agent) => {
    const name = agent.profile?.full_name || agent.title || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || (agent.specializations || []).some((s) => s.toLowerCase().includes(filter.toLowerCase()))
    return matchesSearch && matchesFilter
  })

  return (
    <div className="w-full min-h-screen bg-slate-50/50">
      {/* Search & Filter Header */}
      <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Our Elite <span className="text-primary">Property Experts</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Connect with Dubai's most experienced real estate professionals. 
              Our agents are dedicated to finding your perfect property.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass p-2 rounded-2xl flex flex-col md:flex-row gap-2">
              <div className="relative flex-grow">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search agents by name or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative group">
                  <button className="h-full px-6 py-4 bg-white/10 border border-white/10 rounded-xl text-white flex items-center gap-2 hover:bg-white/20 transition-all">
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    <span>Filters</span>
                  </button>
                </div>
                <button className="px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20">
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['all', 'Luxury', 'Commercial', 'Residential', 'Investment', 'New Developments'].map(
                (spec) => (
                  <button
                    key={spec}
                    onClick={() => setFilter(spec)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      filter === spec
                        ? 'bg-primary text-secondary shadow-lg shadow-primary/20'
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:border-primary/50 hover:text-white'
                    }`}
                  >
                    {spec === 'all' ? 'All Specialists' : spec}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-serif text-secondary">
                {filtered.length} {filtered.length === 1 ? 'Expert' : 'Experts'} Available
              </h2>
              <div className="w-20 h-1 bg-primary mt-2"></div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Sort by:</span>
              <select className="bg-transparent border-none focus:ring-0 font-semibold text-secondary cursor-pointer">
                <option>Most Experienced</option>
                <option>Top Rated</option>
                <option>Most Properties</option>
              </select>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map((agent) => (
                <div 
                  key={agent.id} 
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Agent Image */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={agent.profile?.avatar_url || agent.profile_image || '/api/placeholder/400/500'}
                      alt={agent.profile?.full_name || agent.title || 'Agent'}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    {/* Experience Badge */}
                    <div className="absolute top-4 right-4 bg-primary text-secondary text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {agent.experience_years}+ Years Exp.
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex gap-2">
                        <button className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white py-2 rounded-lg hover:bg-primary hover:text-secondary hover:border-primary transition-all flex items-center justify-center gap-2">
                          <PhoneIcon className="w-4 h-4" />
                          <span className="text-xs font-bold">Call</span>
                        </button>
                        <button className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white py-2 rounded-lg hover:bg-primary hover:text-secondary hover:border-primary transition-all flex items-center justify-center gap-2">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span className="text-xs font-bold">Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-serif text-secondary group-hover:text-primary transition-colors mb-1">
                        {agent.profile?.full_name || agent.title || 'Agent'}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">{agent.title}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarSolid 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor((agent.rating || 0)) ? 'text-primary' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-secondary">{agent.rating ?? '—'}</span>
                      <span className="text-xs text-slate-400">({agent.review_count ?? '0'} reviews)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-6">
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Properties</div>
                        <div className="text-lg font-bold text-secondary">{agent.properties ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Specialty</div>
                        <div className="text-sm font-bold text-secondary truncate">
                          {agent.specializations?.[0] || 'General'}
                        </div>
                      </div>
                    </div>

                    <Link 
                      href={`/agents/${agent.id}`} 
                      className="block w-full py-3 bg-secondary text-white text-center font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MagnifyingGlassIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-serif text-secondary mb-2">No Experts Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We couldn't find any agents matching your current search criteria. 
                Try adjusting your filters or search term.
              </p>
              <button 
                onClick={() => {setSearchTerm(''); setFilter('all');}}
                className="mt-8 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2"></div>
        <div className="container-custom relative z-10">
          <div className="glass p-12 rounded-3xl border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                Are you a <span className="text-primary">Real Estate Professional?</span>
              </h2>
              <p className="text-slate-300 text-lg">
                Join Dubai's fastest-growing luxury real estate network. 
                Get access to exclusive listings, premium tools, and a global client base.
              </p>
            </div>
            <Link 
              href="/careers" 
              className="px-10 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-primary-light transition-all whitespace-nowrap"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
