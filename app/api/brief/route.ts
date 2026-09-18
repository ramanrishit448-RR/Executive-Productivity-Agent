import { NextRequest, NextResponse } from 'next/server';
import { reconciledStore } from '@/lib/engine/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const anchorDate = searchParams.get('date') || '2026-09-23';

    const brief = await reconciledStore.generateDailyBrief(anchorDate);
    return NextResponse.json({ success: true, data: brief });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate brief' }, { status: 500 });
  }
}
