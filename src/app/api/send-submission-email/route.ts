import { NextRequest, NextResponse } from 'next/server';
import { sendSubmissionConfirmationEmail, isEmailConfigured } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    const { 
      customerName, 
      customerEmail, 
      referenceNumber, 
      deviceType, 
      deviceBrand, 
      deviceModel, 
      conditionDescription 
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !referenceNumber || !deviceType || !deviceBrand || !deviceModel) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendSubmissionConfirmationEmail({
      customerName,
      customerEmail,
      referenceNumber,
      deviceType,
      deviceBrand,
      deviceModel,
      conditionDescription: conditionDescription || '',
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
