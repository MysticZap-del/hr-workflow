import React, { useCallback } from 'react';
import { Trash2, X, MousePointerClick } from 'lucide-react';
import type { WorkflowNode, WorkflowNodeData } from '../types/workflow';
import {
  StartNodeForm,
  TaskNodeForm,
  ApprovalNodeForm,
  AutomatedStepNodeForm,
  EndNodeForm,
} from './forms';

interface Props {
  node: WorkflowNode | null;
  onUpdate: (id: string, patch: Partial<WorkflowNodeData>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const NODE_META: Record<string, { label: string; color: string; dot: string }> = {
  startNode:         { label: 'Start Node',     color: 'text-emerald-600', dot: 'bg-emerald-500' },
  taskNode:          { label: 'Task Node',       color: 'text-blue-600',    dot: 'bg-blue-500'    },
  approvalNode:      { label: 'Approval Node',   color: 'text-orange-600',  dot: 'bg-orange-500'  },
  automatedStepNode: { label: 'Automated Step',  color: 'text-purple-600',  dot: 'bg-purple-500'  },
  endNode:           { label: 'End Node',        color: 'text-rose-600',    dot: 'bg-rose-500'    },
};

export const NodeFormPanel: React.FC<Props> = ({ node, onUpdate, onDelete, onClose }) => {
  const handleChange = useCallback(
    (patch: Partial<WorkflowNodeData>) => {
      if (node) onUpdate(node.id, patch);
    },
    [node, onUpdate]
  );

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <MousePointerClick size={20} className="text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">No node selected</p>
          <p className="text-xs text-slate-400 mt-1">
            Click any node on the canvas to configure it here
          </p>
        </div>
      </div>
    );
  }

  const meta = NODE_META[node.type ?? ''] ?? { label: 'Node', color: 'text-slate-600', dot: 'bg-slate-400' };
  const d = node.data;

  const renderForm = () => {
    switch (d.nodeType) {
      case 'start':
        return <StartNodeForm data={d} onChange={handleChange} />;
      case 'task':
        return <TaskNodeForm data={d} onChange={handleChange} />;
      case 'approval':
        return <ApprovalNodeForm data={d} onChange={handleChange} />;
      case 'automatedStep':
        return <AutomatedStepNodeForm data={d} onChange={handleChange} />;
      case 'end':
        return <EndNodeForm data={d} onChange={handleChange} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
          <div>
            <p className="text-xs text-slate-400">Editing</p>
            <h3 className={`text-sm font-semibold ${meta.color}`}>{meta.label}</h3>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onDelete(node.id)}
            title="Delete node"
            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={onClose}
            title="Deselect"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto p-4">{renderForm()}</div>

      {/* Node ID footer */}
      <div className="px-4 py-2 border-t border-slate-100 shrink-0">
        <p className="text-xs text-slate-300 font-mono truncate">id: {node.id.slice(0, 12)}…</p>
      </div>
    </div>
  );
};
