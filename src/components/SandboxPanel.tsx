import React from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { SimulationResult } from '../types/workflow';

interface Props {
  result: SimulationResult | null;
  isLoading: boolean;
  error: string | null;
  onSimulate: () => void;
  onReset: () => void;
}

const NODE_EMOJI: Record<string, string> = {
  startNode: '▶',
  taskNode: '📋',
  approvalNode: '✅',
  automatedStepNode: '⚡',
  endNode: '⏹',
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const SandboxPanel: React.FC<Props> = ({ result, isLoading, error, onSimulate, onReset }) => (
  <div className="flex flex-col h-full">
    {/* Panel header */}
    <div className="px-4 py-3 border-b border-slate-100 shrink-0">
      <h3 className="text-sm font-semibold text-slate-800">Workflow Sandbox</h3>
      <p className="text-xs text-slate-400 mt-0.5">
        Serialise, validate &amp; simulate execution
      </p>
    </div>

    {/* Controls */}
    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 shrink-0">
      <button
        onClick={onSimulate}
        disabled={isLoading}
        className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
      >
        {isLoading ? (
          <>
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Simulating…
          </>
        ) : (
          <>
            <Play size={12} fill="white" />
            Run Simulation
          </>
        )}
      </button>
      {result && (
        <button
          onClick={onReset}
          title="Clear results"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
        >
          <RotateCcw size={13} />
        </button>
      )}
    </div>

    {/* Results */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* API / unexpected error */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-rose-600">Error</p>
          <p className="text-xs text-rose-500 mt-0.5">{error}</p>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-10">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Executing workflow graph…</p>
        </div>
      )}

      {/* Simulation result */}
      {result && !isLoading && (
        <>
          {/* Summary banner */}
          <div
            className={[
              'rounded-lg p-3 border flex items-start gap-2',
              result.success
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200',
            ].join(' ')}
          >
            {result.success ? (
              <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`text-xs font-semibold ${result.success ? 'text-emerald-700' : 'text-rose-700'}`}
              >
                {result.success ? 'Simulation Passed' : 'Validation Failed'}
              </p>
              <p className={`text-xs mt-0.5 ${result.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                {result.summary}
              </p>
            </div>
          </div>

          {/* Validation errors */}
          {result.errors.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Issues Found
              </p>
              <ul className="space-y-1.5">
                {result.errors.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle size={12} className="text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Execution timeline */}
          {result.steps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Execution Log
              </p>
              <ol className="relative space-y-4 pl-8 before:absolute before:left-3.5 before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                {result.steps.map((step, idx) => (
                  <li key={step.nodeId} className="relative">
                    {/* Step badge */}
                    <div className="absolute -left-8 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {idx + 1}
                    </div>
                    {/* Step card */}
                    <div className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm leading-none">
                            {NODE_EMOJI[step.nodeType] ?? '•'}
                          </span>
                          <p className="text-xs font-semibold text-slate-800">{step.title}</p>
                        </div>
                        <span className="text-xs text-slate-400 font-mono shrink-0 ml-2">
                          {fmt(step.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.message}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!result && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Play size={18} className="text-slate-400 ml-0.5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Ready to simulate</p>
            <p className="text-xs text-slate-400 mt-1">
              Build your workflow, then click Run
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);
