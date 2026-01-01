import { NextRequest, NextResponse } from 'next/server'
import { mockProjects } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const projects = mockProjects.slice(offset, offset + limit)

    return NextResponse.json({
      projects,
      total: mockProjects.length,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create new project with mock data
    const newProject = {
      id: `proj-${Date.now()}`,
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      status: body.status || 'planned',
      developer_id: body.developer_id || 'dev-001',
      city: body.city || 'Dubai',
      area: body.area,
      district: body.district,
      address: body.address,
      hero_image_url: body.hero_image_url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      description: body.description,
      starting_price: body.starting_price,
      min_price: body.min_price,
      max_price: body.max_price,
      currency: body.currency || 'AED',
      total_units: body.total_units,
      available_units: body.available_units,
      amenities: body.amenities || [],
      facilities: body.facilities || [],
      property_types: body.property_types || [],
      featured: body.featured || false,
      published: body.published || false,
      launch_date: body.launch_date,
      completion_date: body.completion_date,
      handover_date: body.handover_date,
      payment_plan: body.payment_plan,
      payment_terms: body.payment_terms,
      brochure_url: body.brochure_url,
      video_url: body.video_url,
      images: body.images || [],
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      seo_keywords: body.seo_keywords || [],
      coords: body.coords,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      inquiries_count: 0,
      views_count: 0,
      sold_units: body.sold_units || 0
    }

    // In a real app, this would save to database
    mockProjects.unshift(newProject)

    return NextResponse.json({
      project: newProject,
      message: 'Project created successfully'
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}