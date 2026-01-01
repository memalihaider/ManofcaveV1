'use client'

import { EyeIcon, LockClosedIcon, UserGroupIcon, ShieldCheckIcon, DocumentCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: EyeIcon,
      title: 'Data Collection',
      content: 'We collect only essential information required to provide bespoke luxury property services.'
    },
    {
      icon: LockClosedIcon,
      title: 'Data Protection',
      content: 'Your data is encrypted using military-grade protocols and stored in secure global data centers.'
    },
    {
      icon: UserGroupIcon,
      title: 'Data Sharing',
      content: 'We never sell your data. Information is only shared with verified partners to facilitate your transactions.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
            alt="Privacy Security"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Data Sovereignty
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Privacy <span className="text-primary italic">Policy</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your privacy is our priority. Learn how we safeguard your digital legacy.
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
                    This Privacy Policy explains how RAGDOL ("we," "our," or "us") collects, uses, discloses, and safeguards
                    your information when you use our website, mobile application, and related services (collectively, the "Service").
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    By using our Service, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-secondary mb-6">2. Information We Collect</h2>
                  <div className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-3xl">
                      <h3 className="text-xl font-serif text-secondary mb-4 flex items-center gap-2">
                        <DocumentCheckIcon className="h-5 w-5 text-primary" />
                        Personal Information
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        We collect personal information that you provide to us, including:
                      </p>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {[
                          'Name and contact information',
                          'Account credentials',
                          'Property preferences',
                          'Search history',
                          'Communication preferences',
                          'Secure payment tokens'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl">
                      <h3 className="text-xl font-serif text-secondary mb-4 flex items-center gap-2">
                        <GlobeAltIcon className="h-5 w-5 text-primary" />
                        Usage Information
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        We automatically collect certain information when you use our Service:
                      </p>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {[
                          'Device and browser type',
                          'IP address and location',
                          'Pages visited',
                          'Time spent on site',
                          'Search queries',
                          'Cookie identifiers'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-secondary mb-6">3. Data Security</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We implement a variety of security measures to maintain the safety of your personal information. 
                    Your personal information is contained behind secured networks and is only accessible by a limited 
                    number of persons who have special access rights to such systems, and are required to keep the 
                    information confidential.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-serif text-secondary mb-6">Privacy Concerns?</h2>
          <p className="text-slate-500 mb-10">Our Data Protection Officer is here to help.</p>
          <button className="px-10 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300">
            Contact DPO
          </button>
        </div>
      </section>
    </div>
  )
}
