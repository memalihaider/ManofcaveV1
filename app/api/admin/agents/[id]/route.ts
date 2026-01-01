'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ agent: { id, title: 'Mock Agent' } })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  return NextResponse.json({
    agent: {
      ...body,
      id,
      updated_at: new Date().toISOString()
    },
    message: 'Agent updated successfully'
  })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ message: 'Agent deleted successfully' })
}
