import { NextRequest, NextResponse } from 'next/server';
import { updateRentalRequestStatus, deleteRentalRequest } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { RentalRequestStatus } from '@/lib/types';

const VALID_STATUSES: RentalRequestStatus[] = ['new', 'contacted', 'archived'];

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
    const status = body.status as RentalRequestStatus;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const updated = await updateRentalRequestStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating rental request:', error);
    return NextResponse.json({ success: false, error: 'Failed to update request' }, { status: 500 });
  }
}

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
    const deleted = await deleteRentalRequest(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rental request:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete request' }, { status: 500 });
  }
}
