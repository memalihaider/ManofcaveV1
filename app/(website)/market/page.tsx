'use client'

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon, CurrencyDollarIcon, HomeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default function MarketInsightsPage() {
  const marketStats = [
    {
      title: 'Average Property Price',
      value: 'PKR 2.5M',
      change: '+12.5%',
      trend: 'up',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Properties Sold (Q4)',
      value: '3,247',
      change: '+8.2%',
      trend: 'up',
      icon: HomeIcon
    },
    {
      title: 'Average Days on Market',
      value: '28 days',
      change: '-5.1%',
      trend: 'down',
      icon: ChartBarIcon
    },
    {
      title: 'Commercial Spaces',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: BuildingOfficeIcon
    }
  ]

  const cityInsights = [
    {
      city: 'Lahore',
      avgPrice: 'PKR 3.2M',
      growth: '+18.5%',
      trend: 'up',
      hotAreas: ['Gulberg', 'DHA', 'Bahria Town'],
      description: 'Lahore continues to lead with strong demand in premium residential areas.'
    },
    {
      city: 'Karachi',
      avgPrice: 'PKR 2.8M',
      growth: '+14.2%',
      trend: 'up',
      hotAreas: ['Clifton', 'DHA', 'Bahria Town'],
      description: 'Karachi shows steady growth with increasing commercial development.'
    },
    {
      city: 'Islamabad',
      avgPrice: 'PKR 2.1M',
      growth: '+9.8%',
      trend: 'up',
      hotAreas: ['F-7', 'G-9', 'Bahria Enclave'],
      description: 'Islamabad maintains stability with growing expatriate population.'
    }
  ]

  const marketTrends = [
    {
      title: 'Luxury Segment Growth',
      description: 'High-end properties (PKR 10M+) showing 25% YoY growth',
      impact: 'High'
    },
    {
      title: 'Remote Work Impact',
      description: 'Increased demand for homes with dedicated workspaces',
      impact: 'Medium'
    },
    {
      title: 'Sustainable Properties',
      description: 'Green building certifications driving premium pricing',
      impact: 'High'
    },
    {
      title: 'Commercial Space Demand',
      description: 'Office spaces in business districts seeing 30% rental growth',
      impact: 'High'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Market <span className="text-[#d4af37]">Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed">
              Stay informed with the latest real estate market trends, pricing data,
              and investment opportunities in Pakistan.
            </p>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Market Overview</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketStats.map((stat, index) => (
            <div key={index} className="bg-[#141414] rounded-lg border border-[#333333] p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-8 w-8 text-[#d4af37]" />
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-[#a3a3a3] text-sm">{stat.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* City Insights */}
      <div className="bg-[#141414] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">City Insights</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {cityInsights.map((city, index) => (
              <div key={index} className="bg-[#262626] rounded-lg border border-[#333333] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{city.city}</h3>
                  <div className={`flex items-center space-x-1 text-sm ${
                    city.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                    <span>{city.growth}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[#d4af37] font-semibold">{city.avgPrice}</div>
                  <div className="text-[#a3a3a3] text-sm">Average Property Price</div>
                </div>

                <p className="text-[#a3a3a3] text-sm mb-4">{city.description}</p>

                <div>
                  <div className="text-[#f5f5f5] font-medium mb-2">Hot Areas:</div>
                  <div className="flex flex-wrap gap-2">
                    {city.hotAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Current Market Trends</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {marketTrends.map((trend, index) => (
              <div key={index} className="bg-[#141414] rounded-lg border border-[#333333] p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">{trend.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    trend.impact === 'High'
                      ? 'bg-red-900/20 text-red-400'
                      : 'bg-yellow-900/20 text-yellow-400'
                  }`}>
                    {trend.impact} Impact
                  </span>
                </div>
                <p className="text-[#a3a3a3]">{trend.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Opportunities */}
      <div className="bg-[#141414] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Investment Opportunities</h2>
            <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto">
              Discover high-potential areas and emerging markets for real estate investment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#262626] rounded-lg border border-[#333333] p-6">
              <h3 className="text-xl font-bold mb-4">Emerging Markets</h3>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li>• Rawalpindi - Growing IT sector</li>
                <li>• Faisalabad - Industrial expansion</li>
                <li>• Multan - Commercial development</li>
              </ul>
            </div>

            <div className="bg-[#262626] rounded-lg border border-[#333333] p-6">
              <h3 className="text-xl font-bold mb-4">High-Growth Areas</h3>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li>• DHA Developments</li>
                <li>• Bahria Town expansions</li>
                <li>• Smart city projects</li>
              </ul>
            </div>

            <div className="bg-[#262626] rounded-lg border border-[#333333] p-6">
              <h3 className="text-xl font-bold mb-4">Investment Types</h3>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li>• Residential plots</li>
                <li>• Commercial spaces</li>
                <li>• Rental properties</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-[#a3a3a3] text-lg mb-8">
            Get the latest market insights and investment opportunities delivered to your inbox.
          </p>

          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] placeholder-[#737373] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
              />
              <button className="bg-[#d4af37] hover:bg-[#b8941f] text-[#1a1a1a] font-semibold px-6 py-3 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}