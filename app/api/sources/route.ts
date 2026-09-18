import { NextResponse } from 'next/server';
import { reconciledStore } from '@/lib/engine/store';
import sourcePack from '@/data/source-pack.json';

export async function GET() {
  try {
    const rawItems = await reconciledStore.getSources();

    return NextResponse.json({
      success: true,
      data: {
        raw_pack: sourcePack,
        normalized_sources: rawItems,
        stats: {
          total_items: rawItems.length,
          transcripts: rawItems.filter(r => r.source_type === 'transcript').length,
          emails: rawItems.filter(r => r.source_type === 'email').length,
          calendars: rawItems.filter(r => r.source_type === 'calendar').length,
          voice_notes: rawItems.filter(r => r.source_type === 'voice_note').length,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
