'use client'

import { EyeIcon, PencilIcon, TrashIcon, PlusIcon, BuildingOfficeIcon, HomeModernIcon, MapIcon, BuildingStorefrontIcon, SparklesIcon, CubeIcon, WrenchScrewdriverIcon, TruckIcon, ShoppingBagIcon, Bars3Icon, LinkIcon, ChevronUpIcon, ChevronDownIcon, ChevronRightIcon, XMarkIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, CurrencyDollarIcon, PaperClipIcon, ArrowDownTrayIcon, EnvelopeIcon, EnvelopeOpenIcon, ClockIcon } from '@heroicons/react/24/outline'

interface DashboardProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  analyticsData: any
  selectedTimeRange: string
  setSelectedTimeRange: (range: string) => void
}

export default function Dashboard({ activeTab, setActiveTab, analyticsData, selectedTimeRange, setSelectedTimeRange }: DashboardProps) {
  if (activeTab !== 'dashboard') return null

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <div className="flex gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analyticsData.overview.totalProperties}</p>
              <p className="text-sm text-muted-foreground">Total Properties</p>
              <p className="text-xs text-green-500 mt-1">+12.5% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <EyeIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analyticsData.overview.totalViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Page Views</p>
              <p className="text-xs text-green-500 mt-1">+8.2% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analyticsData.overview.totalInquiries}</p>
              <p className="text-sm text-muted-foreground">Total Inquiries</p>
              <p className="text-xs text-green-500 mt-1">+15.7% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">AED {(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xs text-green-500 mt-1">+22.3% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Views by Category */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Property Views by Category</h3>
          <div className="space-y-4">
            {analyticsData.propertyAnalytics.viewsByCategory.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-foreground">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-3">
            {analyticsData.revenueAnalytics.monthlyRevenue.slice(-6).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.month}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(item.revenue / Math.max(...analyticsData.revenueAnalytics.monthlyRevenue.map((r: any) => r.revenue))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    AED {(item.revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Properties */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Properties</h3>
          <div className="space-y-4">
            {[
              { title: 'Dubai Marina Penthouse', views: 2847, inquiries: 23, value: 'AED 12M' },
              { title: 'Palm Jumeirah Villa', views: 2156, inquiries: 18, value: 'AED 25M' },
              { title: 'Downtown Dubai Apartment', views: 1893, inquiries: 15, value: 'AED 8.5M' },
              { title: 'Jumeirah Beach Residence', views: 1654, inquiries: 12, value: 'AED 15M' },
            ].map((property, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground text-sm">{property.title}</p>
                  <p className="text-xs text-muted-foreground">{property.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{property.views}</p>
                  <p className="text-xs text-muted-foreground">{property.inquiries} inquiries</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New property listed', item: 'Premium Villa in Emirates Hills', time: '2 hours ago', type: 'property' },
              { action: 'Inquiry received', item: '3BR Apartment Downtown', time: '4 hours ago', type: 'inquiry' },
              { action: 'Property updated', item: 'Commercial Office Space', time: '6 hours ago', type: 'update' },
              { action: 'New user registered', item: 'Sarah Johnson', time: '8 hours ago', type: 'user' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'property' ? 'bg-blue-500/10' :
                  activity.type === 'inquiry' ? 'bg-green-500/10' :
                  activity.type === 'update' ? 'bg-orange-500/10' : 'bg-purple-500/10'
                }`}>
                  {activity.type === 'property' && <BuildingOfficeIcon className="h-4 w-4 text-blue-500" />}
                  {activity.type === 'inquiry' && <ChatBubbleLeftRightIcon className="h-4 w-4 text-green-500" />}
                  {activity.type === 'update' && <PencilIcon className="h-4 w-4 text-orange-500" />}
                  {activity.type === 'user' && <EyeIcon className="h-4 w-4 text-purple-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.item}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('properties')}
            className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <PlusIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Add Property</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <EyeIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">View Users</span>
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <EnvelopeIcon className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Check Forms</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}