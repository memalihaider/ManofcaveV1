'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockAgents } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  const agents = mockAgents.slice(offset, offset + limit)

  return NextResponse.json({
    agents,
    total: mockAgents.length,
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
