import { z } from 'zod';

export const CandidateCommitmentSchema = z.object({
  id: z.string().optional(),
  topic: z.string(),
  description: z.string(),
  made_by: z.string(),
  made_to: z.string(),
  due_date_hint: z.string(),
  source_id: z.string(),
  source_timestamp: z.string(),
  confidence: z.number().min(0).max(1).default(1),
  extracted_from: z.string(),
});

export const CandidateExtractionResultSchema = z.object({
  commitments: z.array(CandidateCommitmentSchema),
});

export const QAQuerySchema = z.object({
  query: z.string().min(1),
  anchor_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().default('2026-09-23'),
  sessionId: z.string().nullable().optional(),
});

export type CandidateCommitmentInput = z.infer<typeof CandidateCommitmentSchema>;
