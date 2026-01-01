'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockProperties } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  let filteredProperties = mockProperties

  if (type) {
    filteredProperties = filteredProperties.filter(p => p.type === type)
  }

  if (status) {
    filteredProperties = filteredProperties.filter(p => p.status === status)
  }

  if (minPrice) {
    filteredProperties = filteredProperties.filter(p => p.price >= parseInt(minPrice))
  }

  if (maxPrice) {
    filteredProperties = filteredProperties.filter(p => p.price <= parseInt(maxPrice))
  }

  const paginatedProperties = filteredProperties.slice(offset, offset + limit)

  return NextResponse.json({
    properties: paginatedProperties,
    total: filteredProperties.length,
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
