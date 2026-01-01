'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockCategories } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  return NextResponse.json(mockCategories)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({
    id: `cat-${Date.now()}`,
    name: body.name,
    slug: body.name.toLowerCase().replace(/\s+/g, '-'),
    description: body.description,
    created_at: new Date().toISOString()
  })
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ data: {}, message: 'Mock updated' })
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Mock deleted' })
}
