'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockValuations } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  // Mock valuations for the current user
  return NextResponse.json({
    valuations: mockValuations,
    total: mockValuations.length
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Mock create valuation
  const newValuation = {
    id: `val-${Date.now()}`,
    user_id: 'user-001', // Mock user ID
    ...body,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({
    valuation: newValuation,
    message: 'Valuation request submitted successfully'
  })
}