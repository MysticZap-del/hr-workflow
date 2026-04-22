import React from 'react';
import { Play, ClipboardList, CheckCircle, Zap, StopCircle, GitBranch } from 'lucide-react';

const NODE_PALETTE = [
  {
    type: 'startNode',
    label: 'Start',
    description: 'Workflow entry point',
    icon: <Play size={14} fill="white" />,
    bg: 'bg-emerald-500',
    ring: 'ring-emerald-300',
  },
  {
    type: 'taskNode',
    label: 'Task',
    description: 'Human task / action',
    icon: <ClipboardList size={14} />,
    bg: 'bg-blue-500',
    ring: 'ring-blue-300',
  },
  {
    type: 'approvalNode',
    label: 'Approval',
    description: 'Manager / HR sign-off',
    icon: <CheckCircle size={14} />,
    bg: 'bg-orange-500',
    ring: 'ring-orange-300',
  },
  {
    type: 'automatedStepNode',
    label: 'Automated',
    description: 'System-triggered action',
    icon: <Zap size={14} fill="white" />,
    bg: 'bg-purple-500',
    ring: 'ring-purple-300',
  },
  {
    type: 'endNode',
    label: 'End',
    description: 'Workflow completion',
    icon: <StopCircle size={14} />,
    bg: 'bg-rose-500',
    ring: 'ring-rose-300',
  },
] as const;

const EXAMPLES = [
  { emoji: '👤', label: 'Employee Onboarding' },
  { emoji: '📅', label: 'Leave Approval' },
  { emoji: '📄', label: 'Document Verification' },
  { emoji: '🔑', label: 'Access Provisioning' },
];

export const Sidebar: React.FC = () => {
  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 bg-slate-900 flex flex-col h-full shrink-0 overflow-y-auto">
      {/* Brand header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
            <GitBranch size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">HR Workflow</p>
            <p className="text-slate-400 text-xs">Designer</p>
          </div>
        </div>
      </div>

      {/* Node palette */}
      <div className="px-3 py-4 flex-1">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-1 mb-1">
          Nodes
        </p>
        <p className="text-slate-600 text-xs px-1 mb-3">Drag onto canvas ↗</p>

        <div className="space-y-1.5">
          {NODE_PALETTE.map(node => (
            <div
              key={node.type}
              draggable
              onDragStart={e => onDragStart(e, node.type)}
              className="flex items-center gap-3 px-2.5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:border-slate-500 hover:bg-slate-750 cursor-grab active:cursor-grabbing transition-colors select-none"
            >
              <div
                className={`w-7 h-7 ${node.bg} rounded-md flex items-center justify-center shrink-0`}
              >
                <span className="text-white">{node.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold">{node.label}</p>
                <p className="text-slate-400 text-xs truncate">{node.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow examples list */}
      <div className="px-3 py-4 border-t border-slate-800">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-1 mb-3">
          Use-cases
        </p>
        <ul className="space-y-2">
          {EXAMPLES.map(ex => (
            <li key={ex.label} className="flex items-center gap-2 text-slate-500 text-xs px-1">
              <span>{ex.emoji}</span>
              <span>{ex.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hint */}
      <div className="px-3 py-3 border-t border-slate-800">
        <p className="text-slate-600 text-xs leading-relaxed">
          Press <kbd className="bg-slate-700 text-slate-300 rounded px-1 py-0.5 font-mono text-xs">Del</kbd> to remove selected nodes/edges
        </p>
      </div>
    </aside>
  );
};
