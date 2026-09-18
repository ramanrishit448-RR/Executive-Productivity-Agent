import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatSessions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Failed to fetch chat sessions', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await req.json();

    const sessionId = uuidv4();
    await db.insert(chatSessions).values({
      id: sessionId,
      userId,
      title: title || 'New Chat',
    });

    const [newSession] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId));

    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error('Failed to create chat session', error);
    return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 500 });
  }
}
