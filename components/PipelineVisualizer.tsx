'use client';

import React, { useEffect, useState } from 'react';
import { Database, Filter, GitMerge, UserCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { PipelineTelemetry } from '@/lib/types';

export function PipelineVisualizer() {
  const [telemetry, setTelemetry] = useState<PipelineTelemetry[]>([]);
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pipeline')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTelemetry(json.data.telemetry);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Database className="h-5 w-5 text-indigo-400" />;
      case 2:
        return <Filter className="h-5 w-5 text-sky-400" />;
      case 3:
        return <GitMerge className="h-5 w-5 text-violet-400" />;
      case 4:
        return <UserCheck className="h-5 w-5 text-amber-400" />;
      case 5:
        return <Clock className="h-5 w-5 text-emerald-400" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-indigo-400" />;
    }
  };

  const currentStepData = telemetry.find((t) => t.step === selectedStep);

  return (
    <div className="space-y-6">
      <div className="card-neu-pressed p-6 border-[rgba(6,182,212,0.2)]">
        <h2 className="text-lg font-bold text-text-main mb-1">Interactive Pipeline Telemetry</h2>
        <p className="text-xs text-text-muted">
          Trace the exact mechanical transformations: Raw Inputs → Extracted Candidates → Deduplication & Recency-Wins Merge → Strict Ownership → Reconciled Store.
        </p>

        {/* Stepper Tabs */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {telemetry.map((step) => (
            <button
              key={step.step}
              onClick={() => setSelectedStep(step.step)}
              className={`rounded-xl p-3 text-left transition-all border ${
                selectedStep === step.step
                  ? 'card-neu border-[rgba(6,182,212,0.5)] shadow-sm'
                  : 'card-neu-pressed border-[rgba(0,0,0,0.05)] hover:bg-white/50 text-text-muted'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-semibold ${selectedStep === step.step ? 'text-cyan-600' : 'text-text-muted'}`}>Step {step.step}</span>
                {getStepIcon(step.step)}
              </div>
              <div className={`text-xs font-semibold truncate ${selectedStep === step.step ? 'text-text-main' : 'text-text-muted'}`}>{step.step_name}</div>
              <div className="text-[10px] text-text-muted mt-1">
                {step.output_count} items generated
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step Detail Card */}
      {currentStepData && (
        <div className="card-neu p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.05)] pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-cyan-100 p-2 text-cyan-600 border border-cyan-200">
                {getStepIcon(currentStepData.step)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-main">
                  Step {currentStepData.step}: {currentStepData.step_name}
                </h3>
                <p className="text-xs text-text-muted">{currentStepData.description}</p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-text-muted">Throughput: </span>
              <span className="font-mono font-bold text-cyan-600">
                {currentStepData.input_count} In → {currentStepData.output_count} Out
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Telemetry Sample Output (Step {currentStepData.step})
            </h4>
            <pre className="rounded-xl card-neu-pressed p-4 text-xs font-mono text-text-main overflow-x-auto border border-[rgba(0,0,0,0.05)] max-h-80">
              {JSON.stringify(currentStepData.sample_outputs, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
