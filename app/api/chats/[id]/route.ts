import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatMessages, chatSessions } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const authObj = await auth();
    let userId = authObj?.userId;
    if (!userId) {
      userId = req.headers.get('x-user-id') || null;
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const sessionId = params.id;

    // Verify session belongs to user
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)));
      
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt));

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Failed to fetch chat messages', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}
