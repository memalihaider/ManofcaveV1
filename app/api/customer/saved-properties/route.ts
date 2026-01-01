'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockSavedProperties, mockProperties } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  // Mock saved properties for the current user
  const savedProperties = mockSavedProperties.map(saved => {
    const property = mockProperties.find(p => p.id === saved.property_id)
    return {
      id: saved.id,
      property_id: saved.property_id,
      saved_at: saved.saved_at,
      property: property ? {
        id: property.id,
        title: property.title,
        slug: property.slug,
        type: property.type,
        status: property.status,
        price: property.price,
        currency: property.currency,
        beds: property.beds,
        baths: property.baths,
        sqft: property.sqft,
        image: property.image,
        location: property.location,
        area: property.area,
        city: property.city,
        featured: property.featured,
      } : null
    }
  })

  return NextResponse.json({
    savedProperties,
    total: savedProperties.length
  })
}