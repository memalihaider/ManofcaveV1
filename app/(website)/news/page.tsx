'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NewspaperIcon, CalendarDaysIcon, UserIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const newsArticles = [
  {
    id: 1,
    title: 'Dubai Real Estate Market Shows Strong Q4 Growth',
    excerpt: 'The Dubai property market continues to demonstrate resilience with significant growth in both residential and commercial sectors.',
    date: 'December 5, 2025',
    author: 'Market Analysis Team',
    category: 'Market Report',
    readTime: '5 min read',
    featured: true,
    image: '/api/placeholder/600/400'
  },
  {
    id: 2,
    title: 'New Luxury Developments Launch in Dubai Marina',
    excerpt: 'Several high-end residential projects have been announced in Dubai Marina, offering premium waterfront living options.',
    date: 'December 3, 2025',
    author: 'Development News',
    category: 'New Developments',
    readTime: '4 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  },
  {
    id: 3,
    title: 'Commercial Property Investment Trends in 2026',
    excerpt: 'Analysis of emerging trends in commercial real estate investment and their impact on Dubai\'s business landscape.',
    date: 'December 1, 2025',
    author: 'Investment Team',
    category: 'Investment',
    readTime: '6 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  },
  {
    id: 4,
    title: 'Dubai Ranks Top Global Real Estate Destination',
    excerpt: 'Dubai maintains its position as the world\'s most attractive real estate market according to latest global rankings.',
    date: 'November 28, 2025',
    author: 'International Reports',
    category: 'Global Rankings',
    readTime: '3 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  },
  {
    id: 5,
    title: 'Sustainable Building Practices in UAE Real Estate',
    excerpt: 'How green building initiatives are transforming the construction industry and property values in the UAE.',
    date: 'November 25, 2025',
    author: 'Sustainability Team',
    category: 'Sustainability',
    readTime: '7 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  },
  {
    id: 6,
    title: 'Holiday Season Property Market Update',
    excerpt: 'Seasonal trends and opportunities in Dubai\'s real estate market during the holiday period.',
    date: 'November 22, 2025',
    author: 'Seasonal Analysis',
    category: 'Market Update',
    readTime: '4 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  }
]

const categories = ['All', 'Market Report', 'New Developments', 'Investment', 'Global Rankings', 'Sustainability', 'Market Update']

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState('latest')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticle = newsArticles.find(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-primary/5 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-secondary mb-6 tracking-tight">
              <span className="text-secondary">Real Estate</span> <span className="text-primary">News</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-600 max-w-3xl mx-auto">
              Stay informed with the latest Dubai real estate market insights and industry updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
                Latest Updates
              </button>
              <button className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all">
                Market Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['latest', 'market-reports', 'developments', 'insights'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-600 hover:text-primary'
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
        {activeTab === 'latest' && (
          <div className="space-y-12">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-secondary'
                        : 'bg-slate-100 text-slate-700 hover:bg-primary hover:text-secondary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Article */}
            {featuredArticle && (
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div
                      className="h-64 md:h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${featuredArticle.image})` }}
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-primary text-secondary rounded-full text-xs font-bold uppercase tracking-widest">
                        Featured
                      </span>
                      <span className="ml-4 text-sm text-slate-500">
                        {featuredArticle.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-secondary mb-4 tracking-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="mb-6 text-slate-600 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-500">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {featuredArticle.author}
                        <span className="mx-2">•</span>
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        {featuredArticle.date}
                        <span className="mx-2">•</span>
                        {featuredArticle.readTime}
                      </div>
                      <Link
                        href={`/news/${featuredArticle.id}`}
                        className="flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        Read More
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg group"
                >
                  <div
                    className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm mb-4 text-slate-600 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'market-reports' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight text-center mb-12">
              <span className="text-secondary">Market Reports</span> <span className="text-primary">& Analysis</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsArticles.filter(article => article.category === 'Market Report' || article.category === 'Market Update').map((article) => (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-3 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-slate-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{article.date}</span>
                    <Link
                      href={`/news/${article.id}`}
                      className="font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      Read Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'developments' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight text-center mb-12">
              <span className="text-secondary">New Developments</span> <span className="text-primary">& Projects</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsArticles.filter(article => article.category === 'New Developments').map((article) => (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-3 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-slate-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{article.date}</span>
                    <Link
                      href={`/news/${article.id}`}
                      className="font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight text-center mb-12">
              <span className="text-secondary">Investment Insights</span> <span className="text-primary">& Trends</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsArticles.filter(article => article.category === 'Investment' || article.category === 'Global Rankings' || article.category === 'Sustainability').map((article) => (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
                  <h3 className="text-xl font-bold text-secondary mb-3 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-slate-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{article.date}</span>
                    <Link
                      href={`/news/${article.id}`}
                      className="font-bold text-primary hover:text-secondary transition-colors"
                    >
                      Read Analysis
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <NewspaperIcon className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight mb-4">
            <span className="text-secondary">Stay Updated</span> <span className="text-primary">with Latest News</span>
          </h2>
          <p className="text-lg mb-8 text-slate-300 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive market insights and property updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-primary/30 bg-slate-800 text-white rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <button className="px-8 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}