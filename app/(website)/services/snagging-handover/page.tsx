'use client'

import { useState } from 'react'
import { CheckCircleIcon, ClipboardDocumentListIcon, CameraIcon, WrenchScrewdriverIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const services = [
  {
    title: 'Pre-Handover Inspection',
    description: 'Comprehensive inspection of the property before handover to identify any issues.',
    icon: ClipboardDocumentListIcon,
    features: ['Detailed Property Assessment', 'Quality Control Check', 'Documentation Review', 'Issue Identification']
  },
  {
    title: 'Snagging Report',
    description: 'Detailed report of all defects, damages, and incomplete work found during inspection.',
    icon: CameraIcon,
    features: ['Photographic Evidence', 'Detailed Descriptions', 'Priority Classification', 'Cost Estimates']
  },
  {
    title: 'Defect Rectification',
    description: 'Coordination with developers/contractors to fix identified issues.',
    icon: WrenchScrewdriverIcon,
    features: ['Contractor Coordination', 'Progress Monitoring', 'Quality Assurance', 'Final Verification']
  },
  {
    title: 'Handover Documentation',
    description: 'Complete documentation package for property handover and warranty claims.',
    icon: ShieldCheckIcon,
    features: ['Legal Documentation', 'Warranty Information', 'Maintenance Records', 'Contact Details']
  }
]

const process = [
  {
    step: '01',
    title: 'Initial Consultation',
    description: 'We discuss your property details and specific requirements for the snagging inspection.'
  },
  {
    step: '02',
    title: 'Property Inspection',
    description: 'Our certified inspectors conduct a thorough examination of your property.'
  },
  {
    step: '03',
    title: 'Report Generation',
    description: 'Detailed snagging report with photographs and recommendations is prepared.'
  },
  {
    step: '04',
    title: 'Issue Resolution',
    description: 'We coordinate with developers to ensure all identified issues are resolved.'
  },
  {
    step: '05',
    title: 'Final Handover',
    description: 'Complete documentation and verification for successful property handover.'
  }
]

const benefits = [
  'Certified and experienced inspectors',
  'Comprehensive snagging checklist',
  'Detailed photographic evidence',
  'Priority-based issue classification',
  'Developer coordination and follow-up',
  'Legal documentation and warranty protection',
  'Cost estimation for repairs',
  'Peace of mind during property handover'
]

export default function SnaggingHandoverPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f5f5f5' }}>
      {/* Hero Section */}
      <div className="relative py-20" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6">
              Snagging & Handover Services
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
              Professional property inspection and handover services in Dubai
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                Book Inspection
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
            {['overview', 'services', 'process', 'benefits', 'contact'].map((tab) => (
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
              <h2 className="text-3xl font-bold text-secondary mb-6">
                Expert Snagging & Property Handover Services
              </h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                Our professional snagging inspection services ensure you receive your property in perfect condition.
                We identify defects, coordinate repairs, and facilitate smooth property handover.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>1000+</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Inspections Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>95%</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Issues Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>48hrs</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Average Response</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>10+</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Years Experience</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h2 className="text-3xl font-bold text-secondary text-center mb-12">
              Our Snagging & Handover Services
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
                    <h3 className="text-xl font-semibold text-secondary">
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

        {activeTab === 'process' && (
          <div>
            <h2 className="text-3xl font-bold text-secondary text-center mb-12">
              Our Snagging Process
            </h2>
            <div className="space-y-8">
              {process.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-6"
                    style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary mb-2">
                      {item.title}
                    </h3>
                    <p style={{ color: '#f5f5f5', opacity: 0.8 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div>
            <h2 className="text-3xl font-bold text-secondary text-center mb-12">
              Why Choose Our Snagging Services?
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
            <h2 className="text-3xl font-bold text-secondary text-center mb-8">
              Book Your Snagging Inspection
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
                  placeholder="Property location, developer, handover date, specific concerns..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                Request Snagging Inspection
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
            Don't Accept Defects in Your New Property
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
            Protect your investment with our professional snagging inspection services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
            >
              Book Inspection Now
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