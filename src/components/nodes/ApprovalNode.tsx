import React from 'react';
import type { NodeProps } from 'reactflow';
import { CheckCircle } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ApprovalNodeData } from '../../types/workflow';

const ApprovalNode: React.FC<NodeProps<ApprovalNodeData>> = ({ data, selected }) => (
  <BaseNode
    headerBg="bg-orange-500"
    headerIcon={<CheckCircle size={12} />}
    headerLabel="Approval"
    selected={selected}
  >
    <p className="text-sm font-semibold text-slate-800 truncate">
      {data.title || 'Approval'}
    </p>
    {data.approverRole && (
      <p className="text-xs text-slate-500 mt-1 truncate">🏷️ {data.approverRole}</p>
    )}
    {data.autoApproveThreshold !== '' && (
      <p className="text-xs text-slate-400 truncate">
        Threshold: {data.autoApproveThreshold}
      </p>
    )}
  </BaseNode>
);

export default ApprovalNode;
