import React from 'react';
import type { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { StartNodeData } from '../../types/workflow';

const StartNode: React.FC<NodeProps<StartNodeData>> = ({ data, selected }) => (
  <BaseNode
    headerBg="bg-emerald-500"
    headerIcon={<Play size={12} fill="white" />}
    headerLabel="Start"
    selected={selected}
    hasTarget={false}
  >
    <p className="text-sm font-semibold text-slate-800 truncate">
      {data.title || 'Start'}
    </p>
    {data.metadata.length > 0 && (
      <p className="text-xs text-slate-400 mt-1">
        {data.metadata.length} metadata field(s)
      </p>
    )}
  </BaseNode>
);

export default StartNode;
