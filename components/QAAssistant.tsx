'use client';

import React, { useState } from 'react';
import { Send, Bot, Sparkles, User, ShieldCheck, ArrowUpRight, HelpCircle, Layers } from 'lucide-react';
import { QAResult, ReconciledCommitment } from '@/lib/types';
import { useUser } from '@clerk/nextjs';

interface QAAssistantProps {
  anchorDate: string;
  onSelectCommitment: (item: ReconciledCommitment) => void;
  sessionId: string | null;
  onSessionCreated: (id: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  result?: QAResult;
  timestamp: string;
}

const PRESET_QUERIES = [
  'What did I promise Raghav?',
  'When is the campaign deck review?',
  'What is the status of the Mumbai lease?',
  'What needs action today?',
  'What did Divya promise?',
  'When is the Meridian Logistics call?',
];

export function QAAssistant({ anchorDate, onSelectCommitment, sessionId, onSessionCreated }: QAAssistantProps) {
  const { user } = useUser();
  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'User';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  React.useEffect(() => {
    if (sessionId && user?.id) {
      // Load messages for this session
      fetch(`/api/chats/${sessionId}`, {
        headers: {
          'x-user-id': user.id
        }
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setMessages(json.data.map((m: any) => ({
              role: m.role,
              content: m.content,
              result: m.metadata,
              timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            })));
          }
        });
    } else {
      setMessages([]);
    }
  }, [sessionId, user?.id]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let activeSessionId = sessionId;

      if (!activeSessionId) {
        // Create new session first
        const chatRes = await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: textToSend, userId: user?.id }),
        });
        const chatJson = await chatRes.json();
        if (chatJson.success) {
          activeSessionId = chatJson.data.id;
          onSessionCreated(chatJson.data.id);
        }
      }

      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          anchor_date: anchorDate,
          sessionId: activeSessionId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const qaRes: QAResult = json.data;
        const botMsg: Message = {
          role: 'assistant',
          content: qaRes.answer,
          result: qaRes,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(json.error || 'Failed to query agent');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error retrieving grounded answer: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const isChatEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl w-full max-w-4xl mx-auto shadow-sm border border-gray-100">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
        {isChatEmpty ? (
          <div className="flex flex-col items-center justify-center flex-1 h-full animate-fade-in">
            <div className="mb-10 flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-300 via-indigo-200 to-purple-200 mb-6 shadow-xl shadow-blue-500/20 blur-[1px]"></div>
              <h2 className="text-[32px] font-medium text-gray-800 tracking-tight">Hello, {firstName}</h2>
              <h3 className="text-[32px] font-medium text-gray-500 tracking-tight mt-1">
                How Can I <span className="text-blue-600">Assist You Today?</span>
              </h3>
            </div>

            {/* Empty state input overrides */}
            <div className="w-full max-w-3xl mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative bg-white border border-gray-100 shadow-sm rounded-3xl p-3 flex flex-col hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="flex items-start mb-4">
                  <Sparkles className="h-4 w-4 text-blue-500 mt-3.5 ml-2 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Initiate a query or send a command to the AI..."
                    className="w-full bg-transparent px-1 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                
                <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-3">
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="h-8 w-8 rounded-xl bg-blue-500 text-white flex items-center justify-center disabled:opacity-30 disabled:bg-gray-200 transition-colors shadow-sm shadow-blue-500/20"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-2xl mx-auto">
                {PRESET_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:text-gray-700 px-4 py-2 rounded-full transition-colors whitespace-nowrap shadow-sm shadow-gray-200/20"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-white border border-gray-100 shadow-sm text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.result && m.result.reconciled_matches.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium text-gray-700">Supporting Sources:</span>
                        <span>{m.result.cited_source_ids.length} citations</span>
                      </div>

                      {m.result.reconciled_matches.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onSelectCommitment(item)}
                          className="w-full flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 p-3 text-left hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900 text-xs">{item.topic}</div>
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              Due: {item.deadline_display} • Owner: {item.made_by}
                            </div>
                          </div>
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white shadow-sm text-gray-600">
                            <ArrowUpRight className="h-3 w-3" />
                          </div>
                        </button>
                      ))}

                      <div className="text-[11px] text-gray-400 italic bg-gray-50 px-3 py-2 rounded-lg border border-transparent">
                        {m.result.grounding_explanation}
                      </div>
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 animate-pulse mt-1">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-4 text-sm text-gray-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-ping"></span>
                  <span>Synthesizing response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area (Only show when chatting) */}
      {!isChatEmpty && (
        <div className="p-6 pt-2">
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative bg-white border border-gray-200 shadow-sm rounded-[24px] focus-within:ring-2 focus-within:ring-gray-200 focus-within:border-gray-300 transition-all p-2 flex flex-col"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can Executive Agent help you today?"
              className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none mb-2"
            />
            
            <div className="flex items-center justify-end px-2 pb-1">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-30 disabled:bg-gray-200 transition-colors"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
