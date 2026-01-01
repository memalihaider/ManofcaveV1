'use client'

import { useState } from 'react'
import { BriefcaseIcon, ClockIcon, MapPinIcon, CurrencyDollarIcon, UserGroupIcon, AcademicCapIcon, CheckCircleIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { mockJobs } from '@/lib/mock-data'
import AgentSlider from '@/components/agent/AgentSlider'
import { getTopAgents } from '@/lib/mock-data'

const benefits = [
  { title: 'Elite Compensation', desc: 'Industry-leading commission structures and performance bonuses.', icon: CurrencyDollarIcon },
  { title: 'Global Network', desc: 'Access to the world\'s most exclusive property networks and events.', icon: UserGroupIcon },
  { title: 'Mastery Training', desc: 'Continuous education from world-class real estate mentors.', icon: AcademicCapIcon },
  { title: 'Luxury Lifestyle', desc: 'Work from Dubai\'s most prestigious locations with premium perks.', icon: SparklesIcon }
]

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Office"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Join the Elite
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Craft Your <span className="text-primary italic">Legacy</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            RAGDOL is more than a company; it's a collective of the world's most ambitious real estate professionals.
          </p>
        </div>
      </section>

      {/* Top Agents Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
              Join Our <span className="text-primary italic">Elite Team</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Work alongside Dubai's top-performing real estate professionals and build your legacy in luxury property.
            </p>
          </div>
          <AgentSlider agents={getTopAgents(4)} showCount={4} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 -mt-24 relative z-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif text-secondary mb-3">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">Current <span className="text-primary italic">Opportunities</span></h2>
              <p className="text-slate-500 text-lg">
                We are always looking for exceptional talent to join our ranks. Explore our current openings in Dubai's most dynamic real estate environment.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="px-4 py-2 bg-slate-100 text-secondary text-sm font-bold rounded-full">All Departments</span>
              <span className="px-4 py-2 bg-slate-100 text-secondary text-sm font-bold rounded-full">Dubai, UAE</span>
            </div>
          </div>

          <div className="grid gap-6">
            {mockJobs.map((job, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-lg shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {job.department}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" /> {job.location}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif text-secondary group-hover:text-primary transition-colors">{job.title}</h3>
                    <p className="text-slate-600 max-w-2xl leading-relaxed">{job.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-right hidden lg:block mr-8">
                      <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Compensation</div>
                      <div className="text-secondary font-bold">{job.salary}</div>
                    </div>
                    <button 
                      onClick={() => setSelectedJob(selectedJob === index ? null : index)}
                      className="w-full sm:w-auto px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300"
                    >
                      {selectedJob === index ? 'Close Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {selectedJob === index && (
                  <div className="mt-12 pt-12 border-t border-slate-100 grid md:grid-cols-2 gap-12 animate-fadeIn">
                    <div>
                      <h4 className="text-lg font-serif text-secondary mb-6 flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-primary" />
                        Requirements
                      </h4>
                      <ul className="space-y-4">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl">
                      <h4 className="text-lg font-serif text-secondary mb-4">Ready to apply?</h4>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Send your portfolio and CV to our talent acquisition team. We review all applications within 48 hours.
                      </p>
                      <Link 
                        href="/apply" 
                        className="inline-flex items-center gap-2 text-secondary font-bold group"
                      >
                        Submit Application
                        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
            alt="Dubai Architecture"
            fill
            className="object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">A Culture of <span className="text-primary italic">Excellence</span></h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              We believe that the best work happens when talented people are given the freedom to innovate and the support to excel. Our culture is built on transparency, ambition, and a shared passion for luxury real estate.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-serif text-primary mb-2">95%</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">Employee Retention</div>
              </div>
              <div>
                <div className="text-4xl font-serif text-primary mb-2">15+</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">Nationalities</div>
              </div>
              <div>
                <div className="text-4xl font-serif text-primary mb-2">Top 1%</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">Industry Talent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-8">Don't See the <span className="italic">Perfect</span> Role?</h2>
              <p className="text-xl text-secondary/80 mb-12">
                We are always looking for exceptional people. Send us your CV and tell us how you can make a difference at RAGDOL.
              </p>
              <Link
                href="/apply"
                className="inline-block px-12 py-5 bg-secondary text-white font-bold rounded-2xl hover:bg-white hover:text-secondary transition-all duration-300 shadow-2xl shadow-secondary/20"
              >
                General Application
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
