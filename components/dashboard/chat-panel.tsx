'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserButton } from '@clerk/nextjs';
import { DailyBriefQuadrant } from '@/components/DailyBriefQuadrant';
import { QAAssistant } from '@/components/QAAssistant';
import { StressTestAudit } from '@/components/StressTestAudit';
import { CitationDrawer } from '@/components/CitationDrawer';
import { DailyBrief, ReconciledCommitment, ChatSession } from '@/lib/types';
import { Layers, Sparkles, ShieldCheck, RefreshCw, Plus } from 'lucide-react';

interface ChatPanelProps {
  sessionToken?: string;
  connections: React.ReactNode;
  footer: React.ReactNode;
  anchorDate: string;
  setAnchorDate: (date: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function ChatPanel({
  anchorDate,
  setAnchorDate,
  isRefreshing,
  onRefresh,
}: ChatPanelProps) {
  const [activeTab, setActiveTab] = useState<'brief' | 'qa' | 'stresstest' | 'pipeline' | 'sources'>('qa');
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [selectedCommitment, setSelectedCommitment] = useState<ReconciledCommitment | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/chats');
      const json = await res.json();
      if (json.success) {
        setChatSessions(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleNewChat = () => {
    setActiveSessionId(null);
    setActiveTab('qa');
  };

  const fetchBrief = useCallback(async (dateToFetch: string) => {
    try {
      const res = await fetch(`/api/brief?date=${dateToFetch}`);
      const json = await res.json();
      if (json.success) {
        setBrief(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch brief', err);
    }
  }, []);

  useEffect(() => {
    fetchBrief(anchorDate);
  }, [anchorDate, fetchBrief]);

  const handleSelectCommitmentByTopic = (topic: string) => {
    if (!brief) return;
    const all = [
      ...brief.sections.mine_today,
      ...brief.sections.waiting_on_others,
      ...brief.sections.overdue_at_risk,
      ...brief.sections.unowned,
    ];
    const found = all.find((c) => c.topic.toLowerCase().includes(topic.toLowerCase()));
    if (found) {
      setSelectedCommitment(found);
    }
  };

  return (
    <div className="flex h-full w-full bg-neu-base overflow-hidden border-0">
      
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4">
        <div className="space-y-8">
          {/* Brand & User */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 font-semibold text-sm text-gray-900 truncate">
              Executive Agent
            </div>
          </div>
          
          <div className="px-2">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 bg-gray-200 flex items-center justify-center">
                <UserButton appearance={{ elements: { avatarBox: "h-full w-full" } }} />
              </div>
              <div className="text-sm font-medium text-gray-700 truncate">Arjun Malhotra</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mt-6">
            <button
              onClick={() => setActiveTab('brief')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'brief'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'qa'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4" />
                <span>Assistant</span>
              </div>
              <div className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-600 text-[10px] font-bold">PRO</div>
            </button>
            <button
              onClick={() => setActiveTab('stresstest')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'stresstest'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Audit</span>
            </button>
          </nav>

          {/* Chat History */}
          <div className="mt-8 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent</span>
              <button onClick={handleNewChat} className="text-gray-400 hover:text-gray-700">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-1">
              {chatSessions.map((session) => (
                <li key={session.id}>
                  <button 
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setActiveTab('qa');
                    }}
                    className={`w-full text-left px-4 py-2 text-sm rounded-xl truncate transition-colors ${
                      activeSessionId === session.id
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {session.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <ShieldCheck className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <div className="px-4 py-2.5 mt-2">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Timeline:</span>
              <button onClick={onRefresh} className="hover:text-gray-700"><RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} /></button>
            </div>
            <select 
              value={anchorDate} 
              onChange={(e) => setAnchorDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 text-gray-600 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
            >
              <option value="2026-09-21">Mon 21</option>
              <option value="2026-09-22">Tue 22</option>
              <option value="2026-09-23">Wed 23</option>
              <option value="2026-09-24">Thu 24</option>
              <option value="2026-09-25">Fri 25</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Interactive Panel */}
      <main className="flex-1 flex flex-col bg-neu-base overflow-hidden">
        {/* Tab Body */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'brief' && (
            <div className="h-full">
              <DailyBriefQuadrant
                brief={brief}
                onSelectCommitment={(item) => setSelectedCommitment(item)}
              />
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="h-full max-w-4xl mx-auto flex flex-col">
              <QAAssistant
                anchorDate={anchorDate}
                onSelectCommitment={(item) => setSelectedCommitment(item)}
                sessionId={activeSessionId}
                onSessionCreated={(id) => {
                  setActiveSessionId(id);
                  fetchSessions();
                }}
              />
            </div>
          )}

          {activeTab === 'stresstest' && (
            <div className="h-full">
              <StressTestAudit
                onSelectCommitmentById={(topic) => handleSelectCommitmentByTopic(topic)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Citation Drawer / Audit Modal */}
      <CitationDrawer
        commitment={selectedCommitment}
        onClose={() => setSelectedCommitment(null)}
      />
    </div>
  );
}
