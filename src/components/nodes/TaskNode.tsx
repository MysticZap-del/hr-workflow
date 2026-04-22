import React from 'react';
import type { NodeProps } from 'reactflow';
import { ClipboardList } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { TaskNodeData } from '../../types/workflow';

const TaskNode: React.FC<NodeProps<TaskNodeData>> = ({ data, selected }) => (
  <BaseNode
    headerBg="bg-blue-500"
    headerIcon={<ClipboardList size={12} />}
    headerLabel="Task"
    selected={selected}
  >
    <p className="text-sm font-semibold text-slate-800 truncate">
      {data.title || 'Task'}
    </p>
    {data.assignee && (
      <p className="text-xs text-slate-500 mt-1 truncate">👤 {data.assignee}</p>
    )}
    {data.dueDate && (
      <p className="text-xs text-slate-400 truncate">📅 {data.dueDate}</p>
    )}
  </BaseNode>
);

export default TaskNode;
