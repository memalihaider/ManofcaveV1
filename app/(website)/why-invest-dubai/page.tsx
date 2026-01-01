'use client'

import { useState } from 'react'
import { ChartBarIcon, GlobeAltIcon, BuildingOfficeIcon, CurrencyDollarIcon, ShieldCheckIcon, ArrowTrendingUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const investmentReasons = [
  {
    title: 'Zero Capital Gains Tax',
    description: 'Dubai offers 0% capital gains tax on property sales, allowing investors to keep 100% of their profits.',
    icon: CurrencyDollarIcon,
    stats: 'Save up to 20-30% vs other markets'
  },
  {
    title: 'Stable Economy & Currency',
    description: 'Dubai\'s economy is pegged to the US Dollar, providing currency stability and economic predictability.',
    icon: ArrowTrendingUpIcon,
    stats: 'USD pegged since 1997'
  },
  {
    title: 'World-Class Infrastructure',
    description: 'Dubai boasts exceptional infrastructure including the world\'s busiest airport, modern metro, and smart city initiatives.',
    icon: BuildingOfficeIcon,
    stats: 'Dubai International Airport: 90M+ passengers/year'
  },
  {
    title: 'Strategic Location',
    description: 'Dubai serves as a gateway between East and West, with excellent connectivity to major global markets.',
    icon: GlobeAltIcon,
    stats: 'Direct flights to 280+ destinations'
  },
  {
    title: 'Strong Legal Framework',
    description: 'Dubai offers clear property laws, strong contract enforcement, and protection for foreign investors.',
    icon: ShieldCheckIcon,
    stats: 'Ranked #1 in MENA for investor protection'
  },
  {
    title: 'Growing Population & Demand',
    description: 'Dubai\'s population is growing rapidly, driving demand for residential and commercial properties.',
    icon: ChartBarIcon,
    stats: 'Population growth: 3.5M to 4.5M by 2030'
  }
]

const marketData = [
  { year: '2020', price: 100, rental: 100 },
  { year: '2021', price: 115, rental: 108 },
  { year: '2022', price: 135, rental: 118 },
  { year: '2023', price: 160, rental: 132 },
  { year: '2024', price: 190, rental: 148 },
  { year: '2025', price: 225, rental: 165 }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    country: 'UK',
    investment: 'AED 5M Portfolio',
    quote: 'Dubai property has been our best investment decision. The returns are consistent and the lifestyle is unmatched.',
    returns: '+45% in 3 years'
  },
  {
    name: 'Ahmed Al-Rashid',
    country: 'Saudi Arabia',
    investment: 'AED 8M Commercial',
    quote: 'The business environment in Dubai is world-class. Our commercial property investment has exceeded all expectations.',
    returns: '+60% in 4 years'
  },
  {
    name: 'Maria Gonzalez',
    country: 'Spain',
    investment: 'AED 3M Residential',
    quote: 'Moving to Dubai and investing in property was the best decision for our family. The growth potential is incredible.',
    returns: '+35% in 2 years'
  }
]

const benefits = [
  '100% foreign ownership in freehold areas',
  'No capital gains tax on property sales',
  'Stable currency pegged to USD',
  'World-class healthcare and education',
  'Tax-free income for many investors',
  'Modern infrastructure and smart city initiatives',
  'Strategic location for business expansion',
  'Growing tourism and business sectors',
  'Strong legal protection for investors',
  'Easy repatriation of profits'
]

export default function WhyInvestDubaiPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-white text-secondary">
      {/* Hero Section */}
      <div className="relative py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-secondary mb-6 tracking-tight">
              <span className="text-secondary">Why Invest in</span> <span className="text-primary">Dubai?</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-600">
              Discover why Dubai is the world's premier destination for property investment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Start Investing Today
              </button>
              <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                Download Investment Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-primary/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'market-data', 'testimonials', 'benefits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {tab.replace('-', ' ')}
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
              <h2 className="text-3xl md:text-4xl font-black text-secondary mb-6 tracking-tight">
                World's Leading Investment Destination
              </h2>
              <p className="text-lg max-w-3xl mx-auto text-slate-600">
                Dubai has established itself as the premier global destination for property investment,
                offering unparalleled opportunities for both individual and institutional investors.
              </p>
            </div>

            {/* Key Investment Reasons */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary text-center mb-12 tracking-tight">
                Why Dubai Stands Out
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {investmentReasons.map((reason, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary/40 text-center shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <reason.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold text-secondary mb-3">
                      {reason.title}
                    </h3>
                    <p className="mb-4 text-slate-600 leading-relaxed">
                      {reason.description}
                    </p>
                    <div className="text-sm font-semibold text-primary">
                      {reason.stats}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">125%</div>
                <div className="text-slate-600">Average Property Appreciation (5 years)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">7.2%</div>
                <div className="text-slate-600">Average Rental Yield</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">0%</div>
                <div className="text-slate-600">Capital Gains Tax</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">280+</div>
                <div className="text-slate-600">Direct Flight Destinations</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market-data' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary text-center mb-12 tracking-tight">
              Dubai Property Market Performance
            </h2>

            {/* Market Chart Simulation */}
            <div className="mb-12 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-6 text-center">
                Property Price & Rental Index (2020-2025)
              </h3>
              <div className="space-y-6">
                {marketData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="w-16 font-semibold text-secondary">{data.year}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="text-xs mb-1 text-slate-600">Property Price</div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${(data.price / 225) * 100}%`,
                                backgroundColor: '#c5a059'
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-semibold w-12 text-right text-primary">
                          {data.price}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex-1">
                          <div className="text-xs mb-1 text-slate-600">Rental Index</div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${(data.rental / 165) * 100}%`,
                                backgroundColor: '#1e293b'
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-semibold w-12 text-right text-secondary">
                          {data.rental}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-bold text-primary mb-3">Price Growth</h3>
                <p className="text-2xl font-black text-secondary mb-2">125%</p>
                <p className="text-slate-600">Average increase over 5 years</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-bold text-primary mb-3">Rental Yield</h3>
                <p className="text-2xl font-black text-secondary mb-2">7.2%</p>
                <p className="text-slate-600">Average gross rental yield</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-bold text-primary mb-3">Occupancy Rate</h3>
                <p className="text-2xl font-black text-secondary mb-2">92%</p>
                <p className="text-slate-600">Average property occupancy</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary text-center mb-12 tracking-tight">
              Success Stories from Dubai Investors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="mb-4">
                    <div className="text-lg font-bold text-primary mb-1">
                      {testimonial.returns}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.investment}
                    </div>
                  </div>
                  <blockquote className="mb-4 italic text-secondary leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-secondary">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary text-center mb-12 tracking-tight">
              Complete Investment Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0 text-primary" />
                  <span className="text-secondary font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4 tracking-tight">
            Ready to Start Your Dubai Investment Journey?
          </h2>
          <p className="text-lg mb-8 text-slate-600">
            Join thousands of successful investors who have discovered Dubai's unparalleled investment potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Get Investment Consultation
            </button>
            <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
              Schedule Property Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}