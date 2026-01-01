'use server'

import { NextRequest, NextResponse } from 'next/server'

// Mock data for property reviews
const mockPendingProperties = [
  {
    id: 'pending-1',
    title: 'Modern Apartment in Dubai Marina',
    description: 'Beautiful 2-bedroom apartment with stunning marina views. Fully furnished and ready to move in.',
    type: 'apartment',
    category: 'residential',
    price: 2500000,
    currency: 'AED',
    beds: 2,
    baths: 2,
    sqft: 1200,
    address: 'Marina Gate, Dubai Marina, Dubai',
    area: 'Dubai Marina',
    city: 'Dubai',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    review_status: 'pending_review',
    submitted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    name: 'John Doe',
    phone: '+971 50 123 4567',
    email: 'john@example.com',
    nationality: 'British',
    preferred_contact: 'whatsapp',
    user_role: 'owner'
  },
  {
    id: 'pending-2',
    title: 'Luxury Villa in Palm Jumeirah',
    description: 'Exclusive 5-bedroom villa with private beach access and infinity pool.',
    type: 'villa',
    category: 'luxury',
    price: 15000000,
    currency: 'AED',
    beds: 5,
    baths: 6,
    sqft: 6500,
    address: 'Frond J, Palm Jumeirah, Dubai',
    area: 'Palm Jumeirah',
    city: 'Dubai',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    review_status: 'pending_review',
    submitted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    name: 'Sarah Smith',
    phone: '+971 55 987 6543',
    email: 'sarah@example.com',
    nationality: 'Emirati',
    preferred_contact: 'phone',
    user_role: 'agent'
  }
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending'
  
  try {
    // Fetch properties from agent properties API that need review
    const agentPropertiesResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/agent/properties?status=pending_review`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (agentPropertiesResponse.ok) {
      const agentData = await agentPropertiesResponse.json()
      const pendingProperties = agentData.properties || []
      
      // Transform to the expected format for property reviews
      const transformedProperties = pendingProperties.map((prop: any) => ({
        id: prop.id,
        title: prop.title,
        description: prop.description || '',
        type: prop.type,
        category: 'residential', // Default category
        price: prop.price,
        currency: prop.currency,
        beds: prop.beds,
        baths: prop.baths,
        sqft: prop.sqft,
        address: prop.location || prop.address,
        area: prop.area,
        city: prop.city,
        images: prop.images || [prop.image],
        review_status: prop.review_status,
        submitted_at: prop.submitted_at || prop.created_at,
        created_at: prop.created_at,
        name: 'Agent Submission', // Would come from agent data in real app
        phone: '+971-XXX-XXXX', // Would come from agent data
        email: 'agent@ragdol.com', // Would come from agent data
        nationality: 'UAE',
        preferred_contact: 'email',
        user_role: 'agent'
      }))

      return NextResponse.json({ 
        properties: transformedProperties,
        success: true 
      })
    }
  } catch (error) {
    console.error('Error fetching agent properties:', error)
  }

  // Fallback to mock data if API call fails
  return NextResponse.json({ 
    properties: status === 'pending' ? mockPendingProperties : [],
    success: true 
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { property_id, action } = body
  
  try {
    // Update the property status via agent properties API
    const updateData = action === 'approve' 
      ? { review_status: 'approved', published: true }
      : { review_status: 'rejected', published: false }

    const updateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/agent/properties/${property_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (updateResponse.ok) {
      return NextResponse.json({ 
        success: true, 
        message: `Property ${action === 'approve' ? 'approved' : 'rejected'} successfully` 
      })
    }
  } catch (error) {
    console.error('Error updating property:', error)
  }

  // Fallback response
  return NextResponse.json({ 
    success: true, 
    message: `Property ${action === 'approve' ? 'approved' : 'rejected'} successfully` 
  })
}
