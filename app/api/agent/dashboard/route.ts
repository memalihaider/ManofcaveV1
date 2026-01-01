'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockProperties, mockEnquiries } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  // Mock dashboard data
  const totalProperties = mockProperties.length
  const activeProperties = mockProperties.filter(p => p.status === 'active').length
  const totalEnquiries = mockEnquiries.length
  const pendingEnquiries = mockEnquiries.filter(e => e.status === 'pending').length

  const recentProperties = mockProperties.slice(0, 5).map((p, index) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(), // Mock recent dates
    price: p.price
  }))

  const recentEnquiries = mockEnquiries.slice(0, 5).map(e => {
    const property = mockProperties.find(p => p.id === e.property_id)
    return {
      id: e.id,
      name: e.name,
      email: e.email,
      property_title: property?.title || 'Unknown Property',
      status: e.status,
      created_at: e.created_at
    }
  })

  return NextResponse.json({
    stats: {
      totalProperties,
      activeProperties,
      totalEnquiries,
      pendingEnquiries
    },
    recentProperties,
    recentEnquiries
  })
}