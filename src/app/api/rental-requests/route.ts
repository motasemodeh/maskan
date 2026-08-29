import { NextRequest, NextResponse } from 'next/server';
import { createRentalRequest, getRentalRequests } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

// GET - admin only: list all submitted rental requests
export async function GET() {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const requests = await getRentalRequests();
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching rental requests:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rental requests' }, { status: 500 });
  }
}

// POST - public: save a rental request submitted from the website form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const area = typeof body.area === 'string' ? body.area.trim() : '';
    const district = typeof body.district === 'string' ? body.district.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

    if (!fullName || !phone || !area || !district) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      return NextResponse.json({ success: false, error: 'INVALID_PHONE' }, { status: 400 });
    }

    if (fullName.length > 120 || area.length > 120 || district.length > 120 || notes.length > 1000) {
      return NextResponse.json({ success: false, error: 'TOO_LONG' }, { status: 400 });
    }

    const created = await createRentalRequest({ fullName, phone, area, district, notes });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating rental request:', error);
    return NextResponse.json({ success: false, error: 'Failed to save request' }, { status: 500 });
  }
}
