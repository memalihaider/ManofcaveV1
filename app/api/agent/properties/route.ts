'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockProperties } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const status = searchParams.get('status')

  // For demo purposes, return all properties as if they belong to the current agent
  let agentProperties = mockProperties

  if (status) {
    agentProperties = agentProperties.filter(p =>
      status === 'published' ? p.published : !p.published
    )
  }

  const paginatedProperties = agentProperties.slice(offset, offset + limit)

  return NextResponse.json({
    properties: paginatedProperties,
    total: agentProperties.length,
    limit,
    offset
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  // Set default review status for new submissions
  const propertyData = {
    ...body,
    review_status: body.review_status || 'pending_review',
    published: body.published || false,
    id: `prop-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // In a real app, this would be saved to the database
  // For now, we'll just return the mock response
  return NextResponse.json(propertyData)
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ data: {}, message: 'Mock updated' })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  // In a real app, this would update the property in the database
  return NextResponse.json({ 
    success: true, 
    message: 'Property updated successfully',
    data: body 
  })
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Mock deleted' })
}
