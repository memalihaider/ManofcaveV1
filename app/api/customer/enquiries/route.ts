'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockCustomerEnquiries, mockProperties } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  // Mock enquiries for the current user
  const enquiries = mockCustomerEnquiries.map(enquiry => {
    const property = mockProperties.find(p => p.id === enquiry.property_id)
    return {
      id: enquiry.id,
      property_id: enquiry.property_id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      message: enquiry.message,
      status: enquiry.status,
      created_at: enquiry.created_at,
      responded_at: enquiry.responded_at,
      property: property ? {
        id: property.id,
        title: property.title,
        slug: property.slug,
        image: property.image,
        location: property.location,
        price: property.price,
        currency: property.currency,
      } : null
    }
  })

  return NextResponse.json({
    enquiries,
    total: enquiries.length
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Mock create enquiry
  const newEnquiry = {
    id: `enq-${Date.now()}`,
    user_id: 'user-001', // Mock user ID
    ...body,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({
    enquiry: newEnquiry,
    message: 'Enquiry submitted successfully'
  })
}