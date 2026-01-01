import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const {
      property_id,
      download_type,
      full_name,
      email,
      phone,
      nationality,
      occupation,
      employer,
      monthly_income,
      interested_in_financing,
      budget_range,
      timeline,
      additional_notes
    } = body

    // Validate required fields
    if (!property_id || !download_type || !full_name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get client IP address
    const ip_address = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'

    // Get user agent
    const user_agent = request.headers.get('user-agent') || 'unknown'

    // Insert into download_interests table
    const { data, error } = await supabase
      .from('download_interests')
      .insert({
        property_id,
        download_type,
        full_name,
        email,
        phone,
        nationality: nationality || null,
        occupation: occupation || null,
        employer: employer || null,
        monthly_income: monthly_income ? parseFloat(monthly_income) : null,
        interested_in_financing,
        budget_range: budget_range || null,
        timeline: timeline || null,
        additional_notes: additional_notes || null,
        ip_address,
        user_agent,
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting download interest:', error)
      return NextResponse.json(
        { error: 'Failed to save download interest' },
        { status: 500 }
      )
    }

    // In a real application, you would:
    // 1. Send an email with the download link
    // 2. Notify agents about the new lead
    // 3. Log the activity

    return NextResponse.json({
      success: true,
      message: 'Download interest recorded successfully',
      data
    })

  } catch (error) {
    console.error('Error processing download interest:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}