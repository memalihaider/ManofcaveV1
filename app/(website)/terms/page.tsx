'use client'

import { DocumentTextIcon, ScaleIcon, ShieldCheckIcon, LockClosedIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: DocumentTextIcon,
      title: 'Acceptance of Terms',
      content: 'By accessing RAGDOL, you agree to be bound by these elite service standards and legal frameworks.'
    },
    {
      icon: ScaleIcon,
      title: 'User Responsibilities',
      content: 'Clients are expected to provide accurate information for high-value property transactions.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Service Excellence',
      content: 'We maintain 99.9% uptime for our global property search and investment tools.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop"
            alt="Legal Terms"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Legal Framework
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Terms of <span className="text-primary italic">Service</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Ensuring transparency and excellence in every luxury property transaction.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {sections.map((section, index) => (
                <div key={index} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-primary/10 transition-colors">
                    <section.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-serif text-secondary mb-3">{section.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <div className="mb-12 pb-12 border-b border-slate-100">
                <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Last updated: December 6, 2025</p>
              </div>

              <div className="prose prose-slate prose-lg max-w-none space-y-12">
                <section>
                  <h2 className="text-3xl font-serif text-secondary mb-6">1. Introduction</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Welcome to RAGDOL ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website,
                    mobile application, and related services (collectively, the "Service"). By accessing or using our Service,
                    you agree to be bound by these Terms.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    If you do not agree to these Terms, please do not use our Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-secondary mb-6">2. Description of Service</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    RAGDOL is UAE's premier real estate platform that connects buyers, sellers, renters, and real estate
                    professionals. Our services include:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'Property listings and search functionality',
                      'Real estate agent connections',
                      'Property valuation tools',
                      'Mortgage calculators',
                      'Market insights and analytics',
                      'Property management services'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-600">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-secondary mb-6">3. User Accounts</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    To access certain features of our Service, you must create an account. You agree to:
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Provide accurate and complete information',
                      'Maintain the confidentiality of your account credentials',
                      'Be responsible for all activities under your account',
                      'Notify us immediately of any unauthorized use'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-600">
                        <div className="w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-xs font-bold text-primary">{i + 1}</span>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-serif text-secondary mb-6">Questions about our terms?</h2>
          <p className="text-slate-500 mb-10">Our legal team is available for clarification.</p>
          <button className="px-10 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300">
            Contact Legal Team
          </button>
        </div>
      </section>
    </div>
  )
}
