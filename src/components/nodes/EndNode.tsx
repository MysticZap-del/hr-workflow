import React from 'react';
import type { NodeProps } from 'reactflow';
import { StopCircle } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { EndNodeData } from '../../types/workflow';

const EndNode: React.FC<NodeProps<EndNodeData>> = ({ data, selected }) => (
  <BaseNode
    headerBg="bg-rose-500"
    headerIcon={<StopCircle size={12} />}
    headerLabel="End"
    selected={selected}
    hasSource={false}
  >
    <p className="text-sm font-semibold text-slate-800 truncate">
      {data.endMessage || 'Workflow End'}
    </p>
    {data.summaryFlag && (
      <span className="inline-block mt-1 text-xs bg-rose-100 text-rose-600 rounded-full px-2 py-0.5">
        Summary enabled
      </span>
    )}
  </BaseNode>
);

export default EndNode;
