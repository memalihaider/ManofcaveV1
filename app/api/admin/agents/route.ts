'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockAgents } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  return NextResponse.json({ agents: mockAgents })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({
    id: `agent-${Date.now()}`,
    title: body.title,
    office: body.office,
    license_no: body.license_no,
    brokerage: body.brokerage,
    bio: body.bio,
    whatsapp: body.whatsapp,
    profile_image: body.profile_image,
    approved: body.approved || false,
    verified: body.verified || false,
    rating: body.rating || 4.5,
    review_count: body.review_count || 0,
    experience_years: body.experience_years || 5,
    created_at: new Date().toISOString()
  })
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ data: {}, message: 'Mock updated' })
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Mock deleted' })
}
