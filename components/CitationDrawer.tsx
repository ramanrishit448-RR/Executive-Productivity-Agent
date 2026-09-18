'use client';

import React from 'react';
import { X, Clock, FileText, ArrowRight, ShieldCheck, Mail, Mic, Calendar, Users } from 'lucide-react';
import { ReconciledCommitment } from '@/lib/types';

interface CitationDrawerProps {
  commitment: ReconciledCommitment | null;
  onClose: () => void;
}

export function CitationDrawer({ commitment, onClose }: CitationDrawerProps) {
  if (!commitment) return null;

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-sky-400" />;
      case 'voice_note':
        return <Mic className="h-4 w-4 text-purple-400" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 text-amber-400" />;
      case 'transcript':
      default:
        return <Users className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white card-neu shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.05)] px-6 py-4 bg-white/40">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-600 border border-blue-200">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-main">Citation & Reconciliation Audit</h3>
              <p className="text-xs text-text-muted">{commitment.topic}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-white hover:text-text-main transition-colors shadow-sm border border-transparent hover:border-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Reconciled Summary */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 card-neu-pressed">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
              <ShieldCheck className="h-4 w-4 text-blue-500" />
              <span>Reconciled Truth (Single Source of Truth)</span>
            </div>
            <p className="text-sm font-medium text-text-main">{commitment.final_description}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-muted">
              <div>
                <span>Owner:</span>{' '}
                <span className="font-semibold text-text-main">{commitment.made_by}</span>
              </div>
              <div>
                <span>Confirmed Due:</span>{' '}
                <span className="font-semibold text-text-main">{commitment.deadline_display}</span>
              </div>
              <div className="col-span-2">
                <span>Ownership Rule:</span>{' '}
                <span className="text-text-main">{commitment.ownership_reason}</span>
              </div>
            </div>
          </div>

          {/* Reconciliation Chain (Recency-Wins timeline) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Source Statements & Superseding Timeline ({commitment.citation_history.length} citations)
            </h4>
            <div className="space-y-3">
              {commitment.citation_history.map((cit, idx) => {
                const isLatest = idx === commitment.citation_history.length - 1;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3.5 transition-all ${
                      isLatest
                        ? 'border-green-300 bg-green-50/50 card-neu-pressed'
                        : 'border-[rgba(0,0,0,0.05)] bg-white/60 card-neu shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(cit.source_type)}
                        <span className="font-mono font-medium text-text-main">{cit.source_id}</span>
                        <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] text-text-muted capitalize border border-gray-100 shadow-sm">
                          {cit.source_type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>{cit.timestamp.replace('T', ' ')}</span>
                      </div>
                    </div>

                    <p className="text-xs text-text-main italic bg-white/80 p-2.5 rounded-lg border border-gray-100 shadow-sm mb-2">
                      &ldquo;{cit.quote}&rdquo;
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      <ArrowRight className={`h-3 w-3 ${isLatest ? 'text-green-600' : 'text-text-muted'}`} />
                      <span className={isLatest ? 'font-semibold text-green-700' : 'text-text-muted'}>
                        {cit.statement_effect}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[rgba(0,0,0,0.05)] px-6 py-3.5 bg-white/40 flex justify-end">
          <button
            onClick={onClose}
            className="btn-neu-active px-4 py-1.5 text-xs font-medium"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
}
