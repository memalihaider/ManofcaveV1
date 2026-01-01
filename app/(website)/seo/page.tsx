'use client'

import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  LinkIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CogIcon,
  ShareIcon,
  PhotoIcon,
  TagIcon,
  ClockIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  Bars3Icon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BellIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

// Types for SEO management
interface SEOMetrics {
  overallScore: number;
  keywords: number;
  backlinks: number;
  pagesIndexed: number;
  mobileScore: number;
  speedScore: number;
}

interface KeywordData {
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  trend: 'up' | 'down' | 'stable';
  impressions: number;
  clicks: number;
  ctr: number;
}

interface PageSEO {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  score: number;
  issues: string[];
  lastUpdated: string;
}

interface Backlink {
  url: string;
  domain: string;
  anchor: string;
  type: 'dofollow' | 'nofollow';
  status: 'active' | 'broken' | 'redirect';
  firstSeen: string;
  lastSeen: string;
}

interface SocialMetric {
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
  growth: number;
}

const SEOPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics>({
    overallScore: 78,
    keywords: 45,
    backlinks: 1234,
    pagesIndexed: 892,
    mobileScore: 85,
    speedScore: 92,
  })

  const [keywords, setKeywords] = useState<KeywordData[]>([
    { keyword: 'luxury apartments dubai', position: 3, volume: 8800, difficulty: 65, trend: 'up', impressions: 15420, clicks: 1234, ctr: 8.0 },
    { keyword: 'dubai property investment', position: 7, volume: 5400, difficulty: 72, trend: 'stable', impressions: 9876, clicks: 654, ctr: 6.6 },
    { keyword: 'furnished apartments dubai', position: 2, volume: 12100, difficulty: 58, trend: 'up', impressions: 22100, clicks: 1876, ctr: 8.5 },
    { keyword: 'dubai real estate market', position: 12, volume: 8100, difficulty: 78, trend: 'down', impressions: 7654, clicks: 432, ctr: 5.6 },
  ])

  const [pages, setPages] = useState<PageSEO[]>([
    {
      url: '/apartments',
      title: 'Luxury Apartments in Dubai | Premium Properties',
      description: 'Discover premium luxury apartments in Dubai with world-class amenities and stunning views.',
      keywords: ['luxury apartments', 'dubai', 'premium properties'],
      score: 92,
      issues: [],
      lastUpdated: '2024-01-15'
    },
    {
      url: '/villas',
      title: 'Exclusive Villas in Dubai | Luxury Living',
      description: 'Explore exclusive villas in Dubai offering unparalleled luxury and privacy.',
      keywords: ['villas', 'dubai', 'luxury living'],
      score: 88,
      issues: ['Missing alt text on images'],
      lastUpdated: '2024-01-12'
    },
  ])

  const [backlinks, setBacklinks] = useState<Backlink[]>([
    {
      url: 'https://realestateblog.com/dubai-market-trends',
      domain: 'realestateblog.com',
      anchor: 'Dubai luxury properties',
      type: 'dofollow',
      status: 'active',
      firstSeen: '2023-11-15',
      lastSeen: '2024-01-15'
    },
    {
      url: 'https://propertynews.ae/dubai-investments',
      domain: 'propertynews.ae',
      anchor: 'invest in Dubai',
      type: 'dofollow',
      status: 'active',
      firstSeen: '2023-10-20',
      lastSeen: '2024-01-14'
    },
  ])

  const [socialMetrics, setSocialMetrics] = useState<SocialMetric[]>([
    { platform: 'Facebook', followers: 15420, engagement: 3.2, posts: 45, growth: 8.5 },
    { platform: 'Instagram', followers: 12890, engagement: 4.1, posts: 67, growth: 12.3 },
    { platform: 'LinkedIn', followers: 5670, engagement: 2.8, posts: 23, growth: 5.7 },
    { platform: 'Twitter', followers: 8920, engagement: 3.9, posts: 89, growth: -2.1 },
  ])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'keywords', name: 'Keywords', icon: MagnifyingGlassIcon },
    { id: 'pages', name: 'Pages', icon: DocumentTextIcon },
    { id: 'backlinks', name: 'Backlinks', icon: LinkIcon },
    { id: 'social', name: 'Social Media', icon: ShareIcon },
    { id: 'tools', name: 'SEO Tools', icon: CogIcon },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500/10'
    if (score >= 70) return 'bg-yellow-500/10'
    return 'bg-red-500/10'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4 rounded-full bg-gray-400"></div>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">SEO Management</h1>
          <p className="text-muted-foreground">Optimize your website's search engine performance and visibility</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* SEO Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getScoreBg(seoMetrics.overallScore)}`}>
                      <ChartBarIcon className={`h-6 w-6 ${getScoreColor(seoMetrics.overallScore)}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{seoMetrics.overallScore}</p>
                      <p className="text-sm text-muted-foreground">Overall SEO Score</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <MagnifyingGlassIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{seoMetrics.keywords}</p>
                      <p className="text-sm text-muted-foreground">Keywords Tracked</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <LinkIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{seoMetrics.backlinks.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Backlinks</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <GlobeAltIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{seoMetrics.pagesIndexed}</p>
                      <p className="text-sm text-muted-foreground">Pages Indexed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <DevicePhoneMobileIcon className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{seoMetrics.mobileScore}</p>
                      <p className="text-sm text-muted-foreground">Mobile Score</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <CursorArrowRaysIcon className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{seoMetrics.speedScore}</p>
                      <p className="text-sm text-muted-foreground">Speed Score</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent SEO Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Keyword ranking improved</p>
                      <p className="text-sm text-muted-foreground">"luxury apartments dubai" moved from position 5 to 3</p>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <LinkIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">New backlink detected</p>
                      <p className="text-sm text-muted-foreground">realestateblog.com linked to your villas page</p>
                    </div>
                    <span className="text-sm text-muted-foreground">5 hours ago</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">SEO issue detected</p>
                      <p className="text-sm text-muted-foreground">Missing meta description on /projects page</p>
                    </div>
                    <span className="text-sm text-muted-foreground">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === 'keywords' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Keyword Tracking</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <PlusIcon className="h-4 w-4" />
                  Add Keyword
                </button>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search keywords..."
                        className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button className="px-4 py-2 bg-muted/30 text-foreground rounded-lg hover:bg-muted/50 transition-colors">
                      <FunnelIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Keyword</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Volume</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Difficulty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trend</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">CTR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {keywords.map((keyword, index) => (
                        <tr key={index} className="hover:bg-muted/30">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-foreground">{keyword.keyword}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              keyword.position <= 3 ? 'bg-green-500/10 text-green-500' :
                              keyword.position <= 10 ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              #{keyword.position}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {keyword.volume.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted/30 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    keyword.difficulty >= 70 ? 'bg-red-500' :
                                    keyword.difficulty >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${keyword.difficulty}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground">{keyword.difficulty}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTrendIcon(keyword.trend)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {keyword.ctr}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-muted-foreground hover:text-foreground">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-muted-foreground hover:text-foreground">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pages Tab */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Page Optimization</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <PlusIcon className="h-4 w-4" />
                  Analyze Page
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {pages.map((page, index) => (
                  <div key={index} className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{page.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{page.url}</p>
                        <p className="text-sm text-muted-foreground">{page.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(page.score)} ${getScoreColor(page.score)}`}>
                          {page.score}/100
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Keywords: {page.keywords.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Updated: {page.lastUpdated}
                        </span>
                      </div>
                    </div>

                    {page.issues.length > 0 && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-yellow-500">Issues Found</span>
                        </div>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {page.issues.map((issue, i) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                        <PencilIcon className="h-4 w-4" />
                        Edit SEO
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-muted/30 text-foreground rounded-lg hover:bg-muted/50 transition-colors text-sm">
                        <EyeIcon className="h-4 w-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backlinks Tab */}
          {activeTab === 'backlinks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Backlink Analysis</h2>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-muted/30 text-foreground rounded-lg hover:bg-muted/50 transition-colors">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <ArrowUpTrayIcon className="h-4 w-4" />
                    Import
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Domain</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Anchor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">First Seen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {backlinks.map((backlink, index) => (
                        <tr key={index} className="hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <a href={backlink.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {backlink.url.length > 50 ? `${backlink.url.substring(0, 50)}...` : backlink.url}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {backlink.domain}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            "{backlink.anchor}"
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              backlink.type === 'dofollow' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                            }`}>
                              {backlink.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              backlink.status === 'active' ? 'bg-green-500/10 text-green-500' :
                              backlink.status === 'broken' ? 'bg-red-500/10 text-red-500' :
                              'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {backlink.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {backlink.firstSeen}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Social Media Performance</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <PlusIcon className="h-4 w-4" />
                  Connect Platform
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {socialMetrics.map((metric, index) => (
                  <div key={index} className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{metric.platform}</h3>
                      <ShareIcon className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="text-2xl font-bold text-foreground">{metric.followers.toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Engagement Rate</p>
                        <p className="text-lg font-semibold text-foreground">{metric.engagement}%</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Posts</p>
                        <p className="text-lg font-semibold text-foreground">{metric.posts}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          metric.growth > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {metric.growth > 0 ? '+' : ''}{metric.growth}%
                        </span>
                        <span className="text-sm text-muted-foreground">growth</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media Posts */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                      <PhotoIcon className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Instagram Post</p>
                      <p className="text-sm text-muted-foreground">Luxury villa in Dubai Marina now available! 🌟 #DubaiRealEstate</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>2.3K likes</span>
                        <span>89 comments</span>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <LinkIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">LinkedIn Post</p>
                      <p className="text-sm text-muted-foreground">Market analysis: Dubai property investment trends for 2024 📈</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>156 likes</span>
                        <span>23 comments</span>
                        <span>5 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tools Tab */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">SEO Tools</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <MagnifyingGlassIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Keyword Research</h3>
                      <p className="text-sm text-muted-foreground">Find high-value keywords</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Start Research
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <DocumentTextIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Content Analysis</h3>
                      <p className="text-sm text-muted-foreground">Analyze content quality</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Analyze Content
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <LinkIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Backlink Checker</h3>
                      <p className="text-sm text-muted-foreground">Monitor backlink profile</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Check Backlinks
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <GlobeAltIcon className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Site Audit</h3>
                      <p className="text-sm text-muted-foreground">Comprehensive site analysis</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Run Audit
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <ChartBarIcon className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Rank Tracking</h3>
                      <p className="text-sm text-muted-foreground">Monitor keyword rankings</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Track Rankings
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <BellIcon className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">SEO Alerts</h3>
                      <p className="text-sm text-muted-foreground">Set up monitoring alerts</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Configure Alerts
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">Generate Sitemap</p>
                      <p className="text-sm text-muted-foreground">Create XML sitemap for search engines</p>
                    </div>
                    <GlobeAltIcon className="h-5 w-5 text-muted-foreground" />
                  </button>

                  <button className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">Submit to Search Engines</p>
                      <p className="text-sm text-muted-foreground">Submit sitemap to Google, Bing, etc.</p>
                    </div>
                    <ArrowUpTrayIcon className="h-5 w-5 text-muted-foreground" />
                  </button>

                  <button className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">Meta Tags Generator</p>
                      <p className="text-sm text-muted-foreground">Generate optimized meta tags</p>
                    </div>
                    <TagIcon className="h-5 w-5 text-muted-foreground" />
                  </button>

                  <button className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">SEO Report</p>
                      <p className="text-sm text-muted-foreground">Generate comprehensive SEO report</p>
                    </div>
                    <DocumentTextIcon className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SEOPage