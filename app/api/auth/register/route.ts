import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, password, role } = await request.json();

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Phone number must be at least 10 digits' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Save to database
    // 4. Send verification email

    // For now, we'll simulate a successful registration
    const userId = `user_${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: userId,
        email,
        fullName,
        phone,
        role: role || 'customer'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}