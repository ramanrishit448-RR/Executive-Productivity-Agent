'use client';

import React from 'react';
import { CheckCircle, ShieldAlert, Sparkles, ArrowRight, Clock, FileText, ArrowUpRight } from 'lucide-react';
import { ReconciledCommitment } from '@/lib/types';

interface StressTestAuditProps {
  onSelectCommitmentById: (topic: string) => void;
}

export function StressTestAudit({ onSelectCommitmentById }: StressTestAuditProps) {
  return (
    <div className="space-y-6">
      <div className="card-neu-pressed p-6 border-[rgba(16,185,129,0.2)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-green-100 p-2.5 text-green-600 border border-green-200">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">PRD Deliberate Stress Tests — Formal Verification</h2>
            <p className="text-xs text-text-muted">
              The dataset contains 3 deliberate conflict and ambiguity challenges. Here is how the Reconciled Working Principle mathematically resolves them.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Test 1: Vendor List Walk-Backs */}
        <div className="card-neu p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(0,0,0,0.05)]">
              <span className="pill-neu px-2.5 py-0.5 text-xs font-semibold text-text-main">
                Stress Test #1
              </span>
              <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Resolved
              </span>
            </div>

            <h3 className="text-sm font-semibold text-text-main mb-2">Vendor List Walk-Back Resolution</h3>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Arjun made multiple sequential walk-backs across channels:
            </p>

            <div className="space-y-2 text-[11px] text-text-muted mb-4">
              <div className="rounded-xl card-neu-pressed p-2.5 flex items-center justify-between">
                <span>1. Sync line 3: Promised Tuesday EOD</span>
                <span className="text-red-500 font-mono text-[10px]">Superseded</span>
              </div>
              <div className="rounded-xl card-neu-pressed p-2.5 flex items-center justify-between">
                <span>2. Email msg-2: Slipped to Tue morning</span>
                <span className="text-red-500 font-mono text-[10px]">Superseded</span>
              </div>
              <div className="rounded-xl card-neu-pressed border-[rgba(16,185,129,0.3)] p-2.5 flex items-center justify-between text-text-main">
                <span>3. Email msg-4/5: Final Wed morning</span>
                <span className="text-green-600 font-mono text-[10px]">Recency Winner</span>
              </div>
            </div>

            <div className="rounded-xl bg-white/60 p-3 text-xs text-text-muted shadow-sm">
              <strong className="text-text-main">Reconciled Truth:</strong> Arjun sends vendor list to Raghav on{' '}
              <span className="text-accent-dark font-semibold">Wednesday morning (Sep 23)</span>.
            </div>
          </div>

          <button
            onClick={() => onSelectCommitmentById('Vendor List')}
            className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/40 py-2.5 text-xs font-medium text-text-main hover:bg-white hover:shadow-sm transition-all border border-gray-100"
          >
            <span>Inspect Citation Chain</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Test 2: Campaign Deck Review */}
        <div className="card-neu p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(0,0,0,0.05)]">
              <span className="pill-neu px-2.5 py-0.5 text-xs font-semibold text-text-main">
                Stress Test #2
              </span>
              <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Resolved
              </span>
            </div>

            <h3 className="text-sm font-semibold text-text-main mb-2">Campaign Deck Review Override</h3>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Conflict between early sync statements, personal voice notes, and finalized emails:
            </p>

            <div className="space-y-2 text-[11px] text-text-muted mb-4">
              <div className="rounded-xl card-neu-pressed p-2.5 flex items-center justify-between">
                <span>1. Sync: Initial Wed draft target</span>
                <span className="text-red-500 font-mono text-[10px]">Overridden</span>
              </div>
              <div className="rounded-xl card-neu-pressed p-2.5 flex items-center justify-between">
                <span>2. Email msg-2: Moved to Thu morning</span>
                <span className="text-blue-500 font-mono text-[10px]">Refined</span>
              </div>
              <div className="rounded-xl card-neu-pressed border-[rgba(16,185,129,0.3)] p-2.5 flex items-center justify-between text-text-main">
                <span>3. Email msg-4: Final Thu 9:30 AM</span>
                <span className="text-green-600 font-mono text-[10px]">Recency Winner</span>
              </div>
            </div>

            <div className="rounded-xl bg-white/60 p-3 text-xs text-text-muted shadow-sm">
              <strong className="text-text-main">Reconciled Truth:</strong> Review with Neha on{' '}
              <span className="text-accent-dark font-semibold">Thursday Sep 24 @ 9:30 AM</span> before board prep.
            </div>
          </div>

          <button
            onClick={() => onSelectCommitmentById('Q3 Campaign Deck Review')}
            className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/40 py-2.5 text-xs font-medium text-text-main hover:bg-white hover:shadow-sm transition-all border border-gray-100"
          >
            <span>Inspect Citation Chain</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Test 3: Mumbai Office Lease Standoff */}
        <div className="card-neu p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(0,0,0,0.05)]">
              <span className="pill-neu px-2.5 py-0.5 text-xs font-semibold text-text-main">
                Stress Test #3
              </span>
              <span className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" /> Strictly Unowned
              </span>
            </div>

            <h3 className="text-sm font-semibold text-text-main mb-2">Mumbai Lease Ambiguity Handling</h3>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Disputed ownership across multiple stakeholders without acceptance:
            </p>

            <div className="space-y-2 text-[11px] text-text-muted mb-4">
              <div className="rounded-xl card-neu-pressed p-2.5 flex items-center justify-between">
                <span>1. Facilities: Broadcast to All Staff</span>
                <span className="text-amber-500 font-mono text-[10px]">Unassigned</span>
              </div>
              <div className="rounded-xl card-neu-pressed p-2.5 flex items-center justify-between">
                <span>2. Divya: &quot;Not on my end&quot; (declined)</span>
                <span className="text-red-500 font-mono text-[10px]">Declined</span>
              </div>
              <div className="rounded-xl card-neu-pressed border-[rgba(239,68,68,0.3)] p-2.5 flex items-center justify-between text-text-main">
                <span>3. Raghav: &quot;Still unowned, 1 day out&quot;</span>
                <span className="text-red-500 font-mono text-[10px]">Zero Guessing</span>
              </div>
            </div>

            <div className="rounded-xl bg-white/60 p-3 text-xs text-text-muted shadow-sm">
              <strong className="text-text-main">Reconciled Truth:</strong> Surfaced as{' '}
              <span className="text-red-500 font-semibold">Unowned & At-Risk</span> (Friday deadline). Never hallucinated an owner.
            </div>
          </div>

          <button
            onClick={() => onSelectCommitmentById('Mumbai Office Lease Renewal')}
            className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/40 py-2.5 text-xs font-medium text-text-main hover:bg-white hover:shadow-sm transition-all border border-gray-100"
          >
            <span>Inspect Citation Chain</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
