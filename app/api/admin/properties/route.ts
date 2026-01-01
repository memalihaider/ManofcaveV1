'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockProperties } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  return NextResponse.json({ properties: mockProperties })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({
    id: `prop-${Date.now()}`,
    ...body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ data: {}, message: 'Mock updated' })
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Mock deleted' })
}
