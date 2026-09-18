import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk User ID
  email: text('email').notNull(),
  role: text('role'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const commitments = pgTable('commitments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  description: text('description').notNull(),
  source: text('source').notNull(),
  status: text('status').notNull(), // 'pending', 'completed'
  anchorDate: text('anchor_date').notNull(), // YYYY-MM-DD
  dueDate: text('due_date'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const briefs = pgTable('briefs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  anchorDate: text('anchor_date').notNull(), // YYYY-MM-DD
  content: text('content').notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

export const chatSessions = pgTable('chat_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  metadata: jsonb('metadata'), // To store QAResult like citations
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
