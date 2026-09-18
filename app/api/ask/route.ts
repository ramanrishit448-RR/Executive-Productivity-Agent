import { NextRequest, NextResponse } from 'next/server';
import { reconciledStore } from '@/lib/engine/store';
import { QAQuerySchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text();
    let body = {};
    if (rawText) {
      try {
        body = JSON.parse(rawText);
      } catch (pErr) {
        return NextResponse.json({ success: false, error: 'Malformed JSON in request body' }, { status: 400 });
      }
    }

    const validation = QAQuerySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query payload', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { query, anchor_date, sessionId } = validation.data;
    const result = await reconciledStore.answerQuery(query, anchor_date);

    // Save messages to database
    if (sessionId) {
      const { db } = await import('@/lib/db');
      const { chatMessages, chatSessions } = await import('@/lib/db/schema');
      const { v4: uuidv4 } = await import('uuid');

      // Update session title if it's "New Chat" and this is the first message
      await db.update(chatSessions)
        .set({ updatedAt: new Date() })
        .where(
          (await import('drizzle-orm')).eq(chatSessions.id, sessionId)
        );

      // Insert User Message
      await db.insert(chatMessages).values({
        id: uuidv4(),
        sessionId,
        role: 'user',
        content: query,
      });

      // Insert Assistant Message
      await db.insert(chatMessages).values({
        id: uuidv4(),
        sessionId,
        role: 'assistant',
        content: result.answer,
        metadata: result,
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('API /api/ask error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
