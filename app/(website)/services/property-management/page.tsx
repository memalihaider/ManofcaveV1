'use client'

import { useState } from 'react'
import { CheckCircleIcon, ShieldCheckIcon, ClockIcon, UserGroupIcon, WrenchScrewdriverIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

const services = [
  {
    title: 'Property Maintenance',
    description: 'Comprehensive maintenance services including repairs, renovations, and upkeep.',
    icon: WrenchScrewdriverIcon,
    features: ['24/7 Emergency Repairs', 'Scheduled Maintenance', 'Renovation Services', 'Quality Assurance']
  },
  {
    title: 'Tenant Management',
    description: 'Full tenant screening, lease management, and relationship handling.',
    icon: UserGroupIcon,
    features: ['Tenant Screening', 'Lease Administration', 'Rent Collection', 'Tenant Relations']
  },
  {
    title: 'Financial Management',
    description: 'Complete financial oversight including budgeting, accounting, and reporting.',
    icon: DocumentTextIcon,
    features: ['Budget Planning', 'Financial Reporting', 'Expense Tracking', 'Tax Management']
  },
  {
    title: 'Security & Safety',
    description: 'Advanced security systems and safety protocols for property protection.',
    icon: ShieldCheckIcon,
    features: ['24/7 Security Monitoring', 'Access Control', 'Safety Inspections', 'Emergency Response']
  }
]

const benefits = [
  'Professional property management team',
  'Regular property inspections and reports',
  'Efficient rent collection and financial management',
  '24/7 emergency response and support',
  'Comprehensive tenant screening and management',
  'Legal compliance and documentation',
  'Marketing and tenant placement services',
  'Maintenance coordination and quality control'
]

export default function PropertyManagementPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f5f5f5' }}>
      {/* Hero Section */}
      <div className="relative py-20" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
              Property Management
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
              Professional property management services for landlords and property owners in Dubai
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                Get Started Today
              </button>
              <button
                className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
                style={{ borderColor: '#d4af37', color: '#d4af37' }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b" style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'services', 'benefits', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-[#f5f5f5] hover:text-[#d4af37]'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* Overview */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
                Comprehensive Property Management Solutions
              </h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                Our expert property management team handles all aspects of property ownership,
                from tenant management to maintenance coordination, ensuring your investment is
                protected and profitable.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>500+</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Properties Managed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>98%</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Tenant Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>24/7</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Emergency Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>15+</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Years Experience</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Our Property Management Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border"
                  style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                >
                  <div className="flex items-center mb-4">
                    <service.icon className="h-8 w-8 mr-3" style={{ color: '#d4af37' }} />
                    <h3 className="text-xl font-semibold" style={{ color: '#f5f5f5' }}>
                      {service.title}
                    </h3>
                  </div>
                  <p className="mb-4" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" style={{ color: '#d4af37' }} />
                        <span style={{ color: '#f5f5f5', opacity: 0.8 }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Why Choose Our Property Management Services?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-lg"
                  style={{ backgroundColor: '#141414' }}
                >
                  <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" style={{ color: '#d4af37' }} />
                  <span style={{ color: '#f5f5f5' }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#f5f5f5' }}>
              Get Started with Property Management
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: '#d4af37',
                      backgroundColor: '#262626',
                      color: '#f5f5f5'
                    }}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: '#d4af37',
                      backgroundColor: '#262626',
                      color: '#f5f5f5'
                    }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#262626',
                    color: '#f5f5f5'
                  }}
                  placeholder="+971 XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                  Property Details
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#262626',
                    color: '#f5f5f5'
                  }}
                  placeholder="Tell us about your property and requirements..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                Request Property Management Services
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
            Ready to Maximize Your Property Investment?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
            Let our expert team handle all aspects of property management while you enjoy passive income.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
            >
              Schedule Consultation
            </button>
            <button
              className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
              style={{ borderColor: '#d4af37', color: '#d4af37' }}
            >
              Call Now: +971 XX XXX XXXX
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}