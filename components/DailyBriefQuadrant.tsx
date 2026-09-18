'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  FileSearch,
  ArrowUpRight,
  User,
  Send,
} from 'lucide-react';
import { DailyBrief, ReconciledCommitment } from '@/lib/types';

interface DailyBriefQuadrantProps {
  brief: DailyBrief | null;
  onSelectCommitment: (item: ReconciledCommitment) => void;
}

export function DailyBriefQuadrant({ brief, onSelectCommitment }: DailyBriefQuadrantProps) {
  if (!brief) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
        <div className="text-center">
          <Clock className="mx-auto h-8 w-8 text-slate-500 animate-spin" />
          <p className="mt-2 text-sm text-slate-400">Loading Reconciled Daily Brief...</p>
        </div>
      </div>
    );
  }

  const { mine_today, waiting_on_others, overdue_at_risk, unowned } = brief.sections;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'due_today':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
            <Clock className="h-3 w-3" /> Due Today
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300 ring-1 ring-inset ring-rose-500/30 animate-pulse">
            <AlertTriangle className="h-3 w-3" /> Overdue
          </span>
        );
      case 'at_risk':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 ring-1 ring-inset ring-amber-500/30 animate-pulse-slow">
            <AlertTriangle className="h-3 w-3" /> At Risk
          </span>
        );
      case 'upcoming':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
            <Clock className="h-3 w-3 text-slate-400" /> Upcoming
          </span>
        );
    }
  };

  const renderCommitmentCard = (item: ReconciledCommitment, borderTone: string) => {
    return (
      <div
        key={item.id}
        className={`group relative rounded-xl border ${borderTone} bg-white/40 p-4 transition-all hover:bg-white hover:shadow-sm`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {item.topic}
              </span>
              {renderStatusBadge(item.deadline_status)}
            </div>

            <p className="text-sm font-medium text-text-main leading-snug">
              {item.final_description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>Owner:</span>
                <span className="font-semibold text-text-main">{item.made_by}</span>
              </div>
              <div className="flex items-center gap-1">
                <Send className="h-3.5 w-3.5" />
                <span>For:</span>
                <span className="text-text-main">{item.made_to}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-accent-dark" />
                <span>Deadline:</span>
                <span className="font-medium text-accent-dark">{item.deadline_display}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Citation Badges */}
        <div className="mt-3.5 pt-3 border-t border-[rgba(0,0,0,0.05)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-text-muted">Sources:</span>
            {item.all_source_ids.map((srcId) => (
              <button
                key={srcId}
                onClick={() => onSelectCommitment(item)}
                className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-text-main shadow-sm border border-gray-100 hover:bg-accent-dark hover:text-white transition-colors"
                title="Click to view message citation and audit trail"
              >
                <span>{srcId}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => onSelectCommitment(item)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-text-main hover:text-accent-dark group-hover:underline"
          >
            <span>Audit</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-neu-pressed p-3.5 flex flex-col justify-between">
          <span className="text-xs font-medium text-text-muted">My Actions Today</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-text-main">{mine_today.length}</span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="card-neu-pressed p-3.5 flex flex-col justify-between">
          <span className="text-xs font-medium text-text-muted">Waiting on Others</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-text-main">{waiting_on_others.length}</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
        </div>

        <div className="card-neu-pressed p-3.5 flex flex-col justify-between">
          <span className="text-xs font-medium text-text-muted">Overdue / At-Risk</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-red-500">{overdue_at_risk.length}</span>
            <AlertTriangle className="h-4 w-4 text-red-500/70" />
          </div>
        </div>

        <div className="card-neu-pressed p-3.5 flex flex-col justify-between">
          <span className="text-xs font-medium text-text-muted">Unowned Needs Assignment</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-500">{unowned.length}</span>
            <HelpCircle className="h-4 w-4 text-amber-500/70" />
          </div>
        </div>
      </div>

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: My Actions Today */}
        <div className="card-neu p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-1.5 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-text-main">1. My Actions Today</h3>
            </div>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600 border border-green-200">
              {mine_today.length} items
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {mine_today.length > 0 ? (
              mine_today.map((item) => renderCommitmentCard(item, 'border-green-500/20'))
            ) : (
              <p className="text-xs text-text-muted italic py-6 text-center">No personal deliverables due today.</p>
            )}
          </div>
        </div>

        {/* Section 2: Waiting on Others */}
        <div className="card-neu p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-text-main">2. Waiting on Others</h3>
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
              {waiting_on_others.length} items
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {waiting_on_others.length > 0 ? (
              waiting_on_others.map((item) => renderCommitmentCard(item, 'border-blue-500/20'))
            ) : (
              <p className="text-xs text-text-muted italic py-6 text-center">No pending items from colleagues.</p>
            )}
          </div>
        </div>

        {/* Section 3: Overdue / At-Risk */}
        <div className="card-neu p-5 flex flex-col border-[rgba(239,68,68,0.2)]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-red-100 p-1.5 text-red-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-text-main">3. Overdue / At-Risk</h3>
            </div>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
              {overdue_at_risk.length} items
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {overdue_at_risk.length > 0 ? (
              overdue_at_risk.map((item) => renderCommitmentCard(item, 'border-red-500/30'))
            ) : (
              <p className="text-xs text-text-muted italic py-6 text-center">No overdue commitments detected.</p>
            )}
          </div>
        </div>

        {/* Section 4: Unowned — Needs Assignment */}
        <div className="card-neu p-5 flex flex-col border-[rgba(245,158,11,0.2)]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-100 p-1.5 text-amber-600">
                <HelpCircle className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-text-main">4. Unowned — Needs Assignment</h3>
            </div>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600 border border-amber-200">
              {unowned.length} items
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {unowned.length > 0 ? (
              unowned.map((item) => renderCommitmentCard(item, 'border-amber-500/30'))
            ) : (
              <p className="text-xs text-text-muted italic py-6 text-center">All commitments have designated owners.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
