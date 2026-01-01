// @ts-nocheck - Supabase type inference issues with complex admin schema
import { createClient } from '@/lib/supabase-server'
import { Database } from '@/lib/database.types'

// Type helpers for admin schema
type SystemSettings = Database['public']['Tables']['system_settings']['Row']
type SystemSettingsUpdate = Database['public']['Tables']['system_settings']['Update']
type SystemLogs = Database['public']['Tables']['system_logs']['Row']
type SystemHealth = Database['public']['Tables']['system_health']['Row']
type SEOKeywords = Database['public']['Tables']['seo_keywords']['Row']
type SEOBacklinks = Database['public']['Tables']['seo_backlinks']['Row']
type SEOPages = Database['public']['Tables']['seo_pages']['Row']
type AnalyticsEvents = Database['public']['Tables']['analytics_events']['Row']
type DashboardMetrics = Database['public']['Tables']['dashboard_metrics']['Row']

// Import Json type
type Json = Database['public']['Tables']['system_settings']['Row']['value']

// System Settings Functions
export async function getSystemSettings(category?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('system_settings')
    .select('*')
    .order('category', { ascending: true })
    .order('key', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) throw error
  return data as SystemSettings[]
}

// @ts-ignore - Supabase type inference issues with admin schema updates
export async function updateSystemSetting(
  category: string,
  key: string,
  value: any,
  updatedBy?: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('system_settings')
    .update({
      value: value,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    })
    .eq('category', category)
    .eq('key', key)
    .select()
    .single()

  if (error) throw error
  return data as SystemSettings
}

// System Logs Functions
export async function createSystemLog(
  level: 'error' | 'warning' | 'info' | 'debug',
  message: string,
  source: string,
  meta?: any,
  userId?: string,
  ipAddress?: string,
  userAgent?: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('system_logs')
    .insert({
      level,
      message,
      source,
      user_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
      meta
    })
    .select()
    .single()

  if (error) throw error
  return data as SystemLogs
}

export async function getSystemLogs(
  limit = 100,
  level?: string,
  source?: string,
  startDate?: string,
  endDate?: string
) {
  const supabase = await createClient()

  let query = supabase
    .from('system_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (level) {
    query = query.eq('level', level)
  }

  if (source) {
    query = query.eq('source', source)
  }

  if (startDate) {
    query = query.gte('created_at', startDate)
  }

  if (endDate) {
    query = query.lte('created_at', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data as SystemLogs[]
}

// System Health Functions
export async function recordSystemHealth(
  metricType: 'cpu' | 'memory' | 'disk' | 'network' | 'response_time' | 'uptime',
  value: number,
  unit?: string,
  status: 'healthy' | 'warning' | 'critical' = 'healthy'
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('system_health')
    .insert({
      metric_type: metricType,
      value,
      unit,
      status,
      recorded_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data as SystemHealth
}

export async function getSystemHealth(hours = 24) {
  const supabase = await createClient()
  const startTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('system_health')
    .select('*')
    .gte('recorded_at', startTime)
    .order('recorded_at', { ascending: false })

  if (error) throw error
  return data as SystemHealth[]
}

// SEO Functions
export async function getSEOKeywords(limit = 100, sortBy: 'position' | 'volume' | 'difficulty' = 'position') {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('seo_keywords')
    .select('*')
    .order(sortBy, { ascending: sortBy === 'position' })
    .limit(limit)

  if (error) throw error
  return data as SEOKeywords[]
}

// @ts-ignore - Supabase type inference issues with admin schema updates
export async function updateKeywordPosition(keyword: string, position: number, previousPosition?: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('seo_keywords')
    .update({
      position,
      previous_position: previousPosition,
      last_updated: new Date().toISOString()
    })
    .eq('keyword', keyword)
    .select()
    .single()

  if (error) throw error
  return data as SEOKeywords
}

export async function getSEOBacklinks(limit = 100, status?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('seo_backlinks')
    .select('*')
    .order('last_seen', { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw error
  return data as SEOBacklinks[]
}

export async function getSEOPages(limit = 100, sortBy: 'seo_score' | 'last_crawled' = 'seo_score') {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('seo_pages')
    .select('*')
    .order(sortBy, { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as SEOPages[]
}

// @ts-ignore - Supabase type inference issues with admin schema updates
export async function updateSEOPage(url: string, updates: Partial<SEOPages>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('seo_pages')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('url', url)
    .select()
    .single()

  if (error) throw error
  return data as SEOPages
}

// Analytics Functions
export async function trackAnalyticsEvent(
  eventType: 'page_view' | 'property_view' | 'enquiry' | 'search' | 'signup' | 'login',
  meta?: any,
  userId?: string,
  pageUrl?: string,
  referrer?: string,
  userAgent?: string,
  ipAddress?: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('analytics_events')
    .insert({
      event_type: eventType,
      user_id: userId,
      page_url: pageUrl,
      referrer,
      user_agent: userAgent,
      ip_address: ipAddress,
      meta
    })
    .select()
    .single()

  if (error) throw error
  return data as AnalyticsEvents
}

export async function getAnalyticsEvents(
  eventType?: string,
  startDate?: string,
  endDate?: string,
  limit = 1000
) {
  const supabase = await createClient()

  let query = supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (eventType) {
    query = query.eq('event_type', eventType)
  }

  if (startDate) {
    query = query.gte('created_at', startDate)
  }

  if (endDate) {
    query = query.lte('created_at', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data as AnalyticsEvents[]
}

// Dashboard Metrics Functions
export async function getDashboardMetrics(
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily',
  days = 30
) {
  const supabase = await createClient()
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('dashboard_metrics')
    .select('*')
    .eq('period', period)
    .gte('date', startDate)
    .order('date', { ascending: true })

  if (error) throw error
  return data as DashboardMetrics[]
}

// @ts-ignore - Supabase type inference issues with admin schema updates
export async function updateDashboardMetric(
  metricType: 'total_properties' | 'active_listings' | 'total_enquiries' | 'conversion_rate' | 'revenue' | 'user_registrations',
  value: number,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily',
  date?: string
) {
  const supabase = await createClient()
  const metricDate = date || new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('dashboard_metrics')
    .upsert({
      metric_type: metricType,
      value,
      period,
      date: metricDate
    })
    .select()
    .single()

  if (error) throw error
  return data as DashboardMetrics
}

// Utility function to get current dashboard overview
export async function getDashboardOverview() {
  const supabase = await createClient()

  // Get latest metrics
  const { data: metrics, error: metricsError } = await supabase
    .from('dashboard_metrics')
    .select('*')
    .eq('period', 'daily')
    .eq('date', new Date().toISOString().split('T')[0])

  if (metricsError) throw metricsError

  // Get recent enquiries count
  const { count: enquiriesCount, error: enquiriesError } = await supabase
    .from('enquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  if (enquiriesError) throw enquiriesError

  // Get active properties count
  const { count: propertiesCount, error: propertiesError } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  if (propertiesError) throw propertiesError

  return {
    metrics: metrics || [],
    newEnquiries: enquiriesCount || 0,
    activeProperties: propertiesCount || 0
  }
}