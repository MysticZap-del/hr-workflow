import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type ReactFlowInstance,
} from 'reactflow';
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData } from '../types/workflow';
import { nodeTypes } from './nodes';

interface Props {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: (c: NodeChange[]) => void;
  onEdgesChange: (c: EdgeChange[]) => void;
  onConnect: (c: Connection) => void;
  onNodeClick: (e: React.MouseEvent, node: WorkflowNode) => void;
  onPaneClick: () => void;
  onAddNode: (type: string, pos: { x: number; y: number }) => void;
}

export const WorkflowCanvas: React.FC<Props> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onAddNode,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!wrapperRef.current || !rfInstance) return;

      const type = e.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      onAddNode(type, position);
    },
    [rfInstance, onAddNode]
  );

  return (
    <div ref={wrapperRef} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        /* Cast needed because RF generic inference is imperfect */
        onNodeClick={onNodeClick as (e: React.MouseEvent, n: WorkflowNode) => void}
        onPaneClick={onPaneClick}
        onInit={setRfInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        deleteKeyCode="Delete"
        fitView
        fitViewOptions={{ padding: 0.25 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }}
        className="bg-slate-50"
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#cbd5e1"
          gap={22}
          size={1.2}
        />
        <Controls showInteractive={false} className="!shadow-sm !border !border-slate-200" />
        <MiniMap
          nodeColor={n => {
            switch (n.type) {
              case 'startNode':         return '#22c55e';
              case 'taskNode':          return '#3b82f6';
              case 'approvalNode':      return '#f97316';
              case 'automatedStepNode': return '#a855f7';
              case 'endNode':           return '#ef4444';
              default:                  return '#94a3b8';
            }
          }}
          className="!shadow-sm !border !border-slate-200 !rounded-lg"
          maskColor="rgba(241,245,249,0.7)"
        />
      </ReactFlow>
    </div>
  );
};
