'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { 
  Users, Building2, Briefcase, MessageSquare, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Plus, Search, Filter,
  MoreVertical, Download, Star, ShieldCheck
} from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeAgents: 0,
    totalInquiries: 0,
    revenue: 0,
    propertyGrowth: 12.5,
    agentGrowth: 5.2,
    inquiryGrowth: -2.4,
    revenueGrowth: 8.1
  })

  const [revenueData, setRevenueData] = useState([
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ])

  const [propertyTypeData, setPropertyTypeData] = useState([
    { name: 'Apartment', value: 400 },
    { name: 'Villa', value: 300 },
    { name: 'Penthouse', value: 100 },
    { name: 'Townhouse', value: 200 },
  ])

  const [recentInquiries, setRecentInquiries] = useState([
    { id: 1, name: 'John Doe', property: 'Palm Jumeirah Villa', date: '2024-12-28', status: 'New' },
    { id: 2, name: 'Sarah Smith', property: 'Dubai Marina Apt', date: '2024-12-27', status: 'Contacted' },
    { id: 3, name: 'Mike Johnson', property: 'Business Bay Office', date: '2024-12-26', status: 'Qualified' },
  ])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [propsRes, agentsRes, inquiriesRes] = await Promise.all([
          fetch('/api/admin/properties'),
          fetch('/api/admin/agents'),
          fetch('/api/admin/download-interests')
        ])

        if (propsRes.ok) {
          const props = await propsRes.ok ? await propsRes.json() : []
          setStats(prev => ({ ...prev, totalProperties: Array.isArray(props) ? props.length : 0 }))
        }
        if (agentsRes.ok) {
          const agents = await agentsRes.json()
          setStats(prev => ({ ...prev, activeAgents: agents.agents?.length || 0 }))
        }
        if (inquiriesRes.ok) {
          const inquiries = await inquiriesRes.json()
          setStats(prev => ({ ...prev, totalInquiries: inquiries.download_interests?.length || 0 }))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to Ragdol Property Management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
          <Link href="/admin/properties" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Properties" 
          value={stats.totalProperties} 
          growth={stats.propertyGrowth} 
          icon={<Building2 className="h-5 w-5 text-blue-500" />} 
        />
        <StatCard 
          title="Active Agents" 
          value={stats.activeAgents} 
          growth={stats.agentGrowth} 
          icon={<Users className="h-5 w-5 text-green-500" />} 
        />
        <StatCard 
          title="Total Inquiries" 
          value={stats.totalInquiries} 
          growth={stats.inquiryGrowth} 
          icon={<MessageSquare className="h-5 w-5 text-purple-500" />} 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          growth={stats.revenueGrowth} 
          icon={<TrendingUp className="h-5 w-5 text-orange-500" />} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <select className="text-sm border rounded-md px-2 py-1 bg-background">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Distribution */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Property Types</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {propertyTypeData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Inquiries</h3>
            <Link href="/admin/download-interests" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{inquiry.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inquiry.property}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inquiry.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                        inquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top Performing Agents</h3>
            <Link href="/admin/agents" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Sarah Johnson', sales: '12.4M', properties: 18, rating: 4.9 },
              { name: 'Mohammed Al-Farsi', sales: '10.2M', properties: 15, rating: 4.8 },
              { name: 'Emily Chen', sales: '8.7M', properties: 12, rating: 4.7 },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.properties} Properties Listed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">${agent.sales}</p>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{agent.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, growth, icon }: { title: string, value: string | number, growth: number, icon: React.ReactNode }) {
  const isPositive = growth >= 0
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-muted rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {Math.abs(growth)}%
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
      </div>
    </div>
  )
}
