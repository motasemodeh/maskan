import { NextRequest, NextResponse } from 'next/server';
import {
  updateCity,
  deleteCity,
  addDistrict,
  updateDistrict,
  deleteDistrict,
  getCities,
} from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

/**
 * PATCH /api/locations/[id]
 * Body actions:
 *  { action: 'rename-city',     name: { en, ar } }
 *  { action: 'add-district',    name: { en, ar } }
 *  { action: 'rename-district', districtId, name: { en, ar } }
 *  { action: 'delete-district', districtId }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const action = body?.action as string;

    const name = {
      en: typeof body?.name?.en === 'string' ? body.name.en.trim() : '',
      ar: typeof body?.name?.ar === 'string' ? body.name.ar.trim() : '',
    };

    if (action === 'rename-city') {
      if (!name.en || !name.ar) {
        return NextResponse.json({ success: false, error: 'MISSING_NAME' }, { status: 400 });
      }
      const updated = await updateCity(id, { name });
      if (!updated) {
        return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'add-district' || action === 'rename-district') {
      if (!name.en || !name.ar) {
        return NextResponse.json({ success: false, error: 'MISSING_NAME' }, { status: 400 });
      }

      if (action === 'add-district') {
        const cities = await getCities();
        const city = cities.find((c) => c.id === id);
        if (!city) {
          return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
        }
        const duplicate = city.districts.some(
          (d) => d.name.en.toLowerCase() === name.en.toLowerCase() || d.name.ar === name.ar
        );
        if (duplicate) {
          return NextResponse.json({ success: false, error: 'DUPLICATE' }, { status: 409 });
        }

        const updated = await addDistrict(id, name);
        return NextResponse.json({ success: true, data: updated });
      }

      const districtId = body?.districtId as string;
      if (!districtId) {
        return NextResponse.json({ success: false, error: 'MISSING_DISTRICT' }, { status: 400 });
      }
      const updated = await updateDistrict(id, districtId, name);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'delete-district') {
      const districtId = body?.districtId as string;
      if (!districtId) {
        return NextResponse.json({ success: false, error: 'MISSING_DISTRICT' }, { status: 400 });
      }
      const updated = await deleteDistrict(id, districtId);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ success: false, error: 'Failed to update location' }, { status: 500 });
  }
}

// DELETE - admin: remove a whole city with its areas
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteCity(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting city:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete city' }, { status: 500 });
  }
}
