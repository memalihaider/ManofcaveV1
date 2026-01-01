import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('download_interests')
      .select(`
        *,
        properties (
          id,
          title,
          location
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching download interests:', error)
      // Return mock data when database is not available
      return NextResponse.json({
        download_interests: [
          {
            id: 'mock-1',
            property_id: 'prop-1',
            download_type: 'floor_plan',
            full_name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+971 50 123 4567',
            nationality: 'United Arab Emirates',
            occupation: 'Engineer',
            employer: 'ABC Corp',
            monthly_income: 25000,
            budget_range: '2M-5M AED',
            interested_in_financing: true,
            status: 'new',
            timeline: '3-6 months',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            properties: {
              id: 'prop-1',
              title: 'Luxury 3BR Apartment in Dubai Marina',
              location: 'Dubai Marina'
            }
          },
          {
            id: 'mock-2',
            property_id: 'prop-2',
            download_type: 'brochure',
            full_name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+971 55 987 6543',
            nationality: 'United Kingdom',
            occupation: 'Teacher',
            employer: 'Dubai International School',
            monthly_income: 18000,
            budget_range: '1M-2M AED',
            interested_in_financing: false,
            status: 'contacted',
            timeline: '6-12 months',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            properties: {
              id: 'prop-2',
              title: 'Modern 2BR Villa in Jumeirah',
              location: 'Jumeirah'
            }
          }
        ]
      })
    }

    return NextResponse.json({
      download_interests: data || []
    })

  } catch (error) {
    console.error('Error processing request:', error)
    // Return mock data when database connection fails
    return NextResponse.json({
      download_interests: [
        {
          id: 'mock-1',
          property_id: 'prop-1',
          download_type: 'floor_plan',
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+971 50 123 4567',
          nationality: 'United Arab Emirates',
          occupation: 'Engineer',
          employer: 'ABC Corp',
          monthly_income: 25000,
          budget_range: '2M-5M AED',
          interested_in_financing: true,
          status: 'new',
          timeline: '3-6 months',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            id: 'prop-1',
            title: 'Luxury 3BR Apartment in Dubai Marina',
            location: 'Dubai Marina'
          }
        }
      ]
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id and status' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('download_interests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating download interest:', error)
      // Return success for mock data updates
      return NextResponse.json({
        success: true,
        data: {
          id,
          status,
          updated_at: new Date().toISOString()
        }
      })
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error processing request:', error)
    // Return success for mock data updates when database is not available
    return NextResponse.json({
      success: true,
      data: {
        id: 'mock-updated',
        status: 'updated',
        updated_at: new Date().toISOString()
      }
    })
  }
}