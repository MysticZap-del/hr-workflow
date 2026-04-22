import React from 'react';
import type { NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { AutomatedStepNodeData } from '../../types/workflow';

const AutomatedStepNode: React.FC<NodeProps<AutomatedStepNodeData>> = ({ data, selected }) => (
  <BaseNode
    headerBg="bg-purple-500"
    headerIcon={<Zap size={12} fill="white" />}
    headerLabel="Automated"
    selected={selected}
  >
    <p className="text-sm font-semibold text-slate-800 truncate">
      {data.title || 'Automated Step'}
    </p>
    {data.actionId ? (
      <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 truncate max-w-full">
        {data.actionId}
      </span>
    ) : (
      <p className="text-xs text-slate-400 mt-1">No action selected</p>
    )}
  </BaseNode>
);

export default AutomatedStepNode;
