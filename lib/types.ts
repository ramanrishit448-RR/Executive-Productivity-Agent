export type SourceType = 'transcript' | 'calendar' | 'email' | 'voice_note';

export type OwnershipType = 'mine' | 'waiting_on_others' | 'unowned';

export type DeadlineStatus = 'overdue' | 'due_today' | 'upcoming' | 'at_risk';

export interface SourceItem {
  source_type: SourceType;
  source_id: string;
  timestamp: string; // ISO datetime or YYYY-MM-DD
  title?: string;
  speaker_or_sender: string;
  recipient?: string;
  raw_text: string;
  thread_id?: string;
  metadata?: Record<string, any>;
}

export interface CandidateCommitment {
  id: string;
  topic: string; // e.g., "Vendor List", "Q3 Campaign Deck Review", "Mumbai Office Lease Renewal"
  description: string;
  made_by: string; // normalized person name or email
  made_to: string; // normalized person name or email
  due_date_hint: string; // raw relative string e.g. "by end of day tomorrow", "Thursday 9:30 AM"
  source_id: string;
  source_timestamp: string;
  confidence: number;
  extracted_from: string; // quote
}

export interface ReconciledCommitment {
  id: string;
  topic: string;
  final_description: string;
  made_by: string;
  made_to: string;
  ownership: OwnershipType;
  ownership_reason: string;
  resolved_deadline: string | null; // ISO Date "2026-09-23" or datetime "2026-09-24T09:30:00"
  deadline_display: string; // "Wed, Sep 23 (Morning)"
  deadline_status: DeadlineStatus;
  status_reason: string;
  final_source_id: string;
  final_timestamp: string;
  all_source_ids: string[];
  citation_history: Array<{
    source_id: string;
    source_type: SourceType;
    timestamp: string;
    quote: string;
    statement_effect: string; // e.g. "Initial promise: Tuesday EOD", "Superseded: Thursday 9:30 AM", "Ownership declined"
  }>;
}

export interface DailyBriefSection {
  title: string;
  key: OwnershipType | 'overdue_at_risk';
  description: string;
  items: ReconciledCommitment[];
}

export interface DailyBrief {
  date: string; // e.g. "2026-09-23"
  generated_at: string;
  sections: {
    mine_today: ReconciledCommitment[];
    waiting_on_others: ReconciledCommitment[];
    overdue_at_risk: ReconciledCommitment[];
    unowned: ReconciledCommitment[];
  };
  summary_stats: {
    total_commitments: number;
    actions_today: number;
    waiting_count: number;
    overdue_count: number;
    unowned_count: number;
  };
}

export interface QAResult {
  query: string;
  answer: string;
  reconciled_matches: ReconciledCommitment[];
  cited_source_ids: string[];
  grounding_explanation: string;
}

export interface PipelineTelemetry {
  step: number;
  step_name: string;
  description: string;
  input_count: number;
  output_count: number;
  sample_outputs: any[];
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: any;
  createdAt: Date;
}
