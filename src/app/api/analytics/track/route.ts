import { NextRequest, NextResponse } from 'next/server';
import { recordAnalytics } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    
    // Determine device from userAgent
    let device: 'mobile' | 'desktop' | 'tablet' | 'other' = 'desktop';
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      device = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(userAgent)) {
      device = 'mobile';
    }

    await recordAnalytics({
      path: body.path || '/',
      propertyId: body.propertyId,
      referenceNumber: body.referenceNumber,
      referrer: body.referrer || request.headers.get('referer') || 'direct',
      device,
      language: body.language || 'en',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
