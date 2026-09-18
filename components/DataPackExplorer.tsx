'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Mic, Calendar, Users, FileCode, Search } from 'lucide-react';

export function DataPackExplorer() {
  const [data, setData] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<'transcripts' | 'emails' | 'calendars' | 'voice_notes'>(
    'emails'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sources')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data.raw_pack);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <div className="glass-panel rounded-2xl border-slate-800 p-8 text-center text-slate-400">
        Loading source pack data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 card-neu-pressed p-4 border-[rgba(0,0,0,0.05)]">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('emails')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === 'emails'
                ? 'bg-accent-main text-white shadow-[2px_2px_5px_rgba(0,0,0,0.1)]'
                : 'bg-white/60 text-text-muted hover:text-text-main hover:bg-white shadow-sm'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>5 Email Threads ({data.email_threads?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveCategory('transcripts')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === 'transcripts'
                ? 'bg-accent-main text-white shadow-[2px_2px_5px_rgba(0,0,0,0.1)]'
                : 'bg-white/60 text-text-muted hover:text-text-main hover:bg-white shadow-sm'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Leadership Sync ({data.meeting_transcripts?.[0]?.lines?.length || 0} lines)</span>
          </button>

          <button
            onClick={() => setActiveCategory('calendars')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === 'calendars'
                ? 'bg-accent-main text-white shadow-[2px_2px_5px_rgba(0,0,0,0.1)]'
                : 'bg-white/60 text-text-muted hover:text-text-main hover:bg-white shadow-sm'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>4 Calendars</span>
          </button>

          <button
            onClick={() => setActiveCategory('voice_notes')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === 'voice_notes'
                ? 'bg-accent-main text-white shadow-[2px_2px_5px_rgba(0,0,0,0.1)]'
                : 'bg-white/60 text-text-muted hover:text-text-main hover:bg-white shadow-sm'
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>2 Voice Memos</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search raw messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl card-neu border border-white pl-9 pr-3 py-2 text-xs text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-main/50 transition-shadow"
          />
        </div>
      </div>

      {/* Content Rendering */}
      <div className="card-neu p-6 space-y-4 border-[rgba(0,0,0,0.05)]">
        {/* Email Threads */}
        {activeCategory === 'emails' && (
          <div className="space-y-6">
            {data.email_threads.map((th: any) => (
              <div key={th.thread_id} className="rounded-2xl border border-[rgba(0,0,0,0.05)] card-neu-pressed p-4">
                <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.05)] pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-text-main">Thread: {th.subject}</h3>
                    <span className="font-mono text-[10px] text-text-muted">({th.thread_id})</span>
                  </div>
                  <span className="text-xs text-text-muted">{th.emails.length} messages</span>
                </div>

                <div className="space-y-3">
                  {th.emails.map((msg: any) => (
                    <div
                      key={msg.source_id}
                      className="rounded-xl bg-white/70 p-3 text-xs border border-white shadow-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-text-muted">
                        <div>
                          <span className="font-mono text-blue-500 font-semibold">{msg.source_id}</span> •{' '}
                          <span className="text-text-main">From: {msg.from}</span> →{' '}
                          <span className="text-text-muted">To: {msg.to}</span>
                        </div>
                        <span className="text-[11px] font-mono text-text-muted">
                          {msg.datetime.replace('T', ' ')}
                        </span>
                      </div>
                      <p className="text-text-main pl-3 border-l-2 border-blue-200 font-normal">
                        {msg.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Meeting Transcript */}
        {activeCategory === 'transcripts' && (
          <div className="space-y-4">
            {data.meeting_transcripts.map((mt: any) => (
              <div key={mt.source_id} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.05)] pb-2">
                  <h3 className="text-sm font-semibold text-text-main">{mt.title} ({mt.date} • {mt.time})</h3>
                  <span className="text-xs text-text-muted">Attendees: {mt.attendees.join(', ')}</span>
                </div>

                <div className="space-y-2">
                  {mt.lines.map((line: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl bg-white/70 p-3 text-xs border border-white shadow-sm"
                    >
                      <span className="font-mono text-[11px] text-accent-dark font-semibold w-24 flex-shrink-0">
                        {line.speaker}:
                      </span>
                      <p className="text-text-main flex-1">{line.text}</p>
                      <span className="text-[10px] font-mono text-text-muted">Line {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendars */}
        {activeCategory === 'calendars' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.calendars).map(([person, events]: [string, any]) => (
              <div key={person} className="rounded-2xl border border-[rgba(0,0,0,0.05)] card-neu-pressed p-4">
                <h4 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span>{person}</span>
                </h4>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {events.map((evt: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl bg-white/70 p-2.5 text-xs border border-white shadow-sm"
                    >
                      <div>
                        <div className="font-medium text-text-main">{evt.event}</div>
                        <div className="text-[10px] text-text-muted">{evt.date}</div>
                      </div>
                      <span className="font-mono text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {evt.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voice Notes */}
        {activeCategory === 'voice_notes' && (
          <div className="space-y-4">
            {data.voice_notes.map((vn: any) => (
              <div key={vn.source_id} className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-2 card-neu-pressed">
                <div className="flex items-center justify-between border-b border-purple-200/50 pb-2">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-semibold text-text-main font-mono">{vn.source_id}</span>
                    <span className="text-xs text-purple-600">({vn.speaker})</span>
                  </div>
                  <span className="text-[11px] font-mono text-text-muted">{vn.datetime.replace('T', ' ')}</span>
                </div>
                <p className="text-sm text-text-main italic">&ldquo;{vn.text}&rdquo;</p>
                <div className="text-[10px] text-text-muted font-mono bg-white/60 p-2 rounded-lg mt-2 inline-block shadow-sm">
                  Context: {vn.note}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
