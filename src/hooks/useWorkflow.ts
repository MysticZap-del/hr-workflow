import { useCallback, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeData,
  WorkflowGraph,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
} from '../types/workflow';

// Default data when a new node is dropped onto the canvas
const DEFAULT_NODE_DATA: Record<string, WorkflowNodeData> = {
  startNode: {
    nodeType: 'start',
    title: 'Start',
    metadata: [],
  } satisfies StartNodeData,

  taskNode: {
    nodeType: 'task',
    title: 'New Task',
    description: '',
    assignee: '',
    dueDate: '',
    customFields: [],
  } satisfies TaskNodeData,

  approvalNode: {
    nodeType: 'approval',
    title: 'Approval Step',
    approverRole: 'Manager',
    autoApproveThreshold: '',
  } satisfies ApprovalNodeData,

  automatedStepNode: {
    nodeType: 'automatedStep',
    title: 'Automated Action',
    actionId: '',
    actionParams: {},
  } satisfies AutomatedStepNodeData,

  endNode: {
    nodeType: 'end',
    endMessage: 'Workflow completed successfully.',
    summaryFlag: false,
  } satisfies EndNodeData,
};

export function useWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge['data']>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  // Connect two nodes with an animated edge
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges(eds =>
        addEdge({ ...connection, animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds)
      ),
    [setEdges]
  );

  // Add a new node at a given canvas position
  const addNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const id = uuidv4();
      const newNode: WorkflowNode = {
        id,
        type,
        position,
        data: { ...(DEFAULT_NODE_DATA[type] ?? DEFAULT_NODE_DATA.taskNode) },
      };
      setNodes(nds => [...nds, newNode]);
    },
    [setNodes]
  );

  // Patch a node's data by id
  const updateNodeData = useCallback(
    (nodeId: string, patch: Partial<WorkflowNodeData>) => {
      setNodes(nds =>
        nds.map(n =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, ...patch } as WorkflowNodeData }
            : n
        )
      );
      // Keep selectedNode in sync
      setSelectedNode(prev =>
        prev?.id === nodeId
          ? { ...prev, data: { ...prev.data, ...patch } as WorkflowNodeData }
          : prev
      );
    },
    [setNodes]
  );

  // Remove a node and its connected edges
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes(nds => nds.filter(n => n.id !== nodeId));
      setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(prev => (prev?.id === nodeId ? null : prev));
    },
    [setNodes, setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: WorkflowNode) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  // Serialise the current canvas to a WorkflowGraph
  const getWorkflowGraph = useCallback((): WorkflowGraph => ({ nodes, edges }), [nodes, edges]);

  return {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    deleteNode,
    onNodeClick,
    onPaneClick,
    getWorkflowGraph,
  };
}
