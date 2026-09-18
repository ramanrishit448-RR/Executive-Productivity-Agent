import { NextRequest, NextResponse } from 'next/server';
import { reconciledStore } from '@/lib/engine/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const anchorDate = searchParams.get('date') || '2026-09-23';

    const telemetry = await reconciledStore.getTelemetry();
    const commitments = await reconciledStore.getCommitments(anchorDate);

    return NextResponse.json({
      success: true,
      data: {
        telemetry,
        commitments,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
