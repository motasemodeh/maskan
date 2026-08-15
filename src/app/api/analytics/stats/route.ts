import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const summary = await getAnalyticsSummary();
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
