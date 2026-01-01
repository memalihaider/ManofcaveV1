'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

interface Agent {
  id: string
  title: string
  office: string | null
  brokerage: string
  profile_image: string | null
  rating: number
  review_count: number
  whatsapp: string | null
  experience_years: number
}

export default function PropertyAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents?limit=3&sortBy=rating')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        // Ensure data is an array
        const agentsList = Array.isArray(data) ? data : (data?.agents || [])
        setAgents(agentsList)
      } catch (error) {
        console.error('Error fetching agents:', error)
        // Fallback to mock agents
        setAgents([
          {
            id: 'mock-1',
            title: 'Senior Real Estate Consultant',
            office: 'Downtown Dubai Office',
            brokerage: 'Luxury Properties Dubai',
            profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            rating: 4.8,
            review_count: 245,
            whatsapp: '+971501234567',
            experience_years: 15
          },
          {
            id: 'mock-2',
            title: 'Real Estate Specialist',
            office: 'Marina Mall Office',
            brokerage: 'Luxury Properties Dubai',
            profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
            rating: 4.9,
            review_count: 312,
            whatsapp: '+971509876543',
            experience_years: 12
          },
          {
            id: 'mock-3',
            title: 'Property Investment Advisor',
            office: 'Business Bay Office',
            brokerage: 'Luxury Properties Dubai',
            profile_image: 'https://images.unsplash.com/photo-1500636136919-5a2f53fcf973?w=400&q=80',
            rating: 4.7,
            review_count: 189,
            whatsapp: '+971505555555',
            experience_years: 10
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-gradient">Top Agents</span>
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-gradient">Top Agents</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with experienced real estate professionals to find your perfect property
          </p>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No agents available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent) => (
              <div key={agent.id} className="card-custom group hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  {/* Agent Image */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-muted">
                      <img
                        src={agent.profile_image || '/api/placeholder/96/96'}
                        alt={agent.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(agent.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({agent.review_count})
                      </span>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {agent.title}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">{agent.brokerage}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {agent.experience_years} years experience
                  </p>

                  {/* Contact Info */}
                  <div className="flex justify-center gap-3 mb-4">
                    {agent.whatsapp && (
                      <a
                        href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        title="WhatsApp"
                      >
                        <PhoneIcon className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={`mailto:support@ragdol.com`}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      title="Email"
                    >
                      <EnvelopeIcon className="w-4 h-4" />
                    </a>
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href={`/agents/${agent.id}`}
                    className="btn-primary w-full inline-block text-center"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/agents" className="btn-outline">
            View All Agents
          </Link>
        </div>
      </div>
    </section>
  )
}
