import { NextRequest, NextResponse } from 'next/server';
import { getCities, createCity } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

// GET - public: cities + their areas, used by the website forms
export async function GET() {
  try {
    const cities = await getCities();
    return NextResponse.json({ success: true, data: cities });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch locations' }, { status: 500 });
  }
}

// POST - admin: add a new city
export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const en = typeof body?.name?.en === 'string' ? body.name.en.trim() : '';
    const ar = typeof body?.name?.ar === 'string' ? body.name.ar.trim() : '';

    if (!en || !ar) {
      return NextResponse.json({ success: false, error: 'MISSING_NAME' }, { status: 400 });
    }

    const cities = await getCities();
    const exists = cities.some(
      (c) => c.name.en.toLowerCase() === en.toLowerCase() || c.name.ar === ar
    );
    if (exists) {
      return NextResponse.json({ success: false, error: 'DUPLICATE' }, { status: 409 });
    }

    const created = await createCity({ en, ar });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating city:', error);
    return NextResponse.json({ success: false, error: 'Failed to create city' }, { status: 500 });
  }
}
