'use client';

import React from 'react';
import { Sparkles, Calendar, UserCheck, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'brief' | 'qa' | 'stresstest' | 'pipeline' | 'sources';
  setActiveTab: (tab: 'brief' | 'qa' | 'stresstest' | 'pipeline' | 'sources') => void;
  anchorDate: string;
  setAnchorDate: (date: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const DATES = [
  { label: 'Mon, Sep 21', value: '2026-09-21' },
  { label: 'Tue, Sep 22', value: '2026-09-22' },
  { label: 'Wed, Sep 23', value: '2026-09-23', isDefault: true },
  { label: 'Thu, Sep 24', value: '2026-09-24' },
  { label: 'Fri, Sep 25', value: '2026-09-25' },
];

export function Navbar({
  activeTab,
  setActiveTab,
  anchorDate,
  setAnchorDate,
  onRefresh,
  isRefreshing,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Executive Profile */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-white">Executive Productivity Agent</span>
                <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
                  Veridian Corp
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-medium text-slate-300">Arjun Malhotra</span>
                <span className="text-slate-600">•</span>
                <span>VP Sales</span>
              </div>
            </div>
          </div>

          {/* Date Anchor Selector */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-slate-900/90 p-1 border border-slate-800">
            <div className="flex items-center gap-1 px-2 text-xs font-medium text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span>Simulate Day:</span>
            </div>
            {DATES.map((d) => (
              <button
                key={d.value}
                onClick={() => setAnchorDate(d.value)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  anchorDate === d.value
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Action Button & Health */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Reconcile Brief</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-t border-slate-800/60 pt-1 pb-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('brief')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'brief'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>Daily Action Brief</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'qa'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>Reconciled Q&A Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('stresstest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'stresstest'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Stress Test Audit</span>
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-300">
              3 Verified
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'pipeline'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            <span>Pipeline Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'sources'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span>Source Pack Browser</span>
          </button>
        </div>
      </div>
    </header>
  );
}
