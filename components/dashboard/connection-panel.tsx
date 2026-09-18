'use client';

import React from 'react';
import {
  Mail,
  Calendar,
  Mic,
  Users,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ConnectionsPanelProps {
  anchorDate: string;
  setAnchorDate: (date: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalCommitments?: number;
  sessionToken?: string;
}

const TIMELINE_DAYS = [
  { label: 'Mon 21', full: 'Mon, Sep 21', value: '2026-09-21' },
  { label: 'Tue 22', full: 'Tue, Sep 22', value: '2026-09-22' },
  { label: 'Wed 23', full: 'Wed, Sep 23 (Default)', value: '2026-09-23' },
  { label: 'Thu 24', full: 'Thu, Sep 24', value: '2026-09-24' },
  { label: 'Fri 25', full: 'Fri, Sep 25 (Lease Due)', value: '2026-09-25' },
];

export default function ConnectionsPanel({
  anchorDate,
  setAnchorDate,
  onRefresh,
  isRefreshing,
  totalCommitments = 5,
}: ConnectionsPanelProps) {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col justify-between gap-6 p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.5)]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl card-neu-pressed text-accent-dark">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-main">
                Connected Sources
              </h3>
              <p className="text-[10px] text-text-muted">Arjun Malhotra Feed</p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-neu p-2 text-text-muted hover:text-text-main disabled:opacity-50"
            title="Re-run reconciliation pipeline"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Live Ingested Streams */}
        <div className="space-y-3">
          {/* Stream 1: Emails */}
          <div className="card-neu p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl card-neu-pressed p-2 text-accent-dark">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-main">Veridian Mail</div>
                <div className="text-[10px] text-text-muted">5 Threads • 25 Messages</div>
              </div>
            </div>
            <div className="flex items-center justify-center card-neu-pressed h-6 px-2 rounded-full">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>

          {/* Stream 2: Calendars */}
          <div className="card-neu p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl card-neu-pressed p-2 text-accent-dark">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-main">Corporate Cals</div>
                <div className="text-[10px] text-text-muted">4 Execs • 20 Events</div>
              </div>
            </div>
            <div className="flex items-center justify-center card-neu-pressed h-6 px-2 rounded-full">
               <span className="h-2 w-2 rounded-full bg-text-muted"></span>
            </div>
          </div>

          {/* Stream 3: Transcripts */}
          <div className="card-neu p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl card-neu-pressed p-2 text-accent-dark">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-main">Standup</div>
                <div className="text-[10px] text-text-muted">10 Dialogue Lines</div>
              </div>
            </div>
            <div className="flex items-center justify-center card-neu-pressed h-6 px-2 rounded-full text-green-500">
              <CheckCircle2 className="h-3 w-3" />
            </div>
          </div>

          {/* Stream 4: Voice Notes */}
          <div className="card-neu p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl card-neu-pressed p-2 text-accent-dark">
                <Mic className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-main">Audio Memos</div>
                <div className="text-[10px] text-text-muted">2 Personal Notes</div>
              </div>
            </div>
            <div className="flex items-center justify-center card-neu-pressed h-6 px-2 rounded-full text-green-500">
              <CheckCircle2 className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Timeline Simulation Control */}
        <div className="card-neu-pressed p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-main">
              <Sliders className="h-4 w-4 text-accent-dark" />
              <span>Evaluation Day</span>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {TIMELINE_DAYS.map((d) => (
              <button
                key={d.value}
                onClick={() => setAnchorDate(d.value)}
                className={`py-2 text-[10px] font-medium transition-all ${
                  anchorDate === d.value
                    ? 'btn-neu-active'
                    : 'btn-neu text-text-muted'
                }`}
                title={d.full}
              >
                {d.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
