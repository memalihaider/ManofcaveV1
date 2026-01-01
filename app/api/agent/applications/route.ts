'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockEnquiries, mockProperties } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const status = searchParams.get('status')

  // For demo purposes, return all enquiries as if they belong to the current agent
  let applications = mockEnquiries.map(enquiry => {
    const property = mockProperties.find(p => p.id === enquiry.property_id)
    return {
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      message: enquiry.message,
      property_title: property?.title || 'Unknown Property',
      property_id: enquiry.property_id,
      status: enquiry.status,
      created_at: enquiry.created_at,
      responded_at: enquiry.status !== 'pending' ? new Date().toISOString() : undefined
    }
  })

  if (status && status !== 'all') {
    applications = applications.filter(a => a.status === status)
  }

  const paginatedApplications = applications.slice(offset, offset + limit)

  return NextResponse.json({
    applications: paginatedApplications,
    total: applications.length,
    limit,
    offset
  })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ data: {}, message: 'Mock created' })
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ data: {}, message: 'Mock updated' })
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Mock deleted' })
}
