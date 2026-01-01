'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Agent {
  id: string
  title?: string | null
  bio?: string | null
  experience_years?: number | null
  rating?: number | null
  review_count?: number | null
  total_sales?: number | null
  profile_image?: string | null
  profiles?: {
    full_name?: string | null
    avatar_url?: string | null
  } | null
}

interface AgentSliderProps {
  agents: Agent[]
  showCount?: number
}

export default function AgentSlider({ agents, showCount = 4 }: AgentSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) =>
      prevIndex + showCount >= agents.length ? 0 : prevIndex + showCount
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) =>
      prevIndex - showCount < 0 ? Math.max(0, agents.length - showCount) : prevIndex - showCount
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const visibleAgents = agents.slice(currentIndex, currentIndex + showCount)

  return (
    <div className="container-custom">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }

        .slide-item {
          animation: slideIn 0.5s ease-out forwards;
        }

        .slide-item.transitioning {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>

      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
            Expert Professionals
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Meet Our Top Agents
          </h3>
        </div>
        <div className="flex gap-2 ml-8">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex + showCount >= agents.length}
            className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <ChevronRightIcon className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-hidden">
        {visibleAgents.map((agent, idx) => (
          <div
            key={agent.id}
            className={`slide-item h-full`}
          >
            <div className="card-custom group p-8 text-center">
              <div className="relative mb-6 inline-block">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-slate-50 group-hover:ring-primary/20 transition-all duration-500">
                  <img
                    src={agent.profiles?.avatar_url || agent.profile_image || '/api/placeholder/128/128'}
                    alt={agent.profiles?.full_name || agent.title || 'Agent'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-bold text-slate-900">{agent.rating || '5.0'}</span>
                </div>
              </div>

              <h3 className="font-black text-2xl text-slate-900 mb-1 group-hover:text-primary transition-colors">
                {agent.profiles?.full_name || agent.title || 'Agent'}
              </h3>
              <p className="text-sm text-primary font-bold uppercase tracking-widest mb-4">{agent.title}</p>

              <div className="flex justify-center gap-6 py-4 border-y border-slate-50 mb-6">
                <div className="text-center">
                  <div className="font-black text-slate-900">{agent.experience_years || '8'}+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Years</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-slate-900">{agent.total_sales ? Math.floor(agent.total_sales / 1000000) : '45'}M+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sales</div>
                </div>
              </div>

              <Link
                href={`/agents/${agent.id}`}
                className="btn-outline !w-full !rounded-xl !py-3"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/agents" className="btn-primary !rounded-full !px-10">
          View All Agents
        </Link>
      </div>
    </div>
  )
}