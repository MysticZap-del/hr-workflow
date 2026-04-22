import type { Node, Edge } from 'reactflow';

// ─── Key-value pair (used in metadata / custom fields) ───────────────────────
export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

// ─── Per-node data shapes (discriminated union) ───────────────────────────────
export interface StartNodeData {
  nodeType: 'start';
  title: string;
  metadata: KeyValuePair[];
}

export interface TaskNodeData {
  nodeType: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

export interface ApprovalNodeData {
  nodeType: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number | '';
}

export interface AutomatedStepNodeData {
  nodeType: 'automatedStep';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  nodeType: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

// ─── React Flow node / edge aliases ──────────────────────────────────────────
export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

// ─── API types ────────────────────────────────────────────────────────────────
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: string;
  title: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
  summary: string;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
