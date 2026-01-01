'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ data: [], message: 'Mock data' })
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
