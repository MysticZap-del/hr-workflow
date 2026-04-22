import type { AutomationAction, SimulationResult, WorkflowGraph } from '../types/workflow';

// Simulates network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── GET /automations ─────────────────────────────────────────────────────────
export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300);
  return [
    { id: 'send_email',    label: 'Send Email',              params: ['to', 'subject'] },
    { id: 'generate_doc',  label: 'Generate Document',       params: ['template', 'recipient'] },
    { id: 'send_slack',    label: 'Send Slack Notification', params: ['channel', 'message'] },
    { id: 'update_hris',   label: 'Update HRIS Record',      params: ['employeeId', 'field', 'value'] },
    { id: 'create_ticket', label: 'Create IT Ticket',        params: ['summary', 'priority'] },
    { id: 'send_sms',      label: 'Send SMS',                params: ['phone', 'message'] },
  ];
}

// ─── POST /simulate ───────────────────────────────────────────────────────────
export async function simulateWorkflow(workflow: WorkflowGraph): Promise<SimulationResult> {
  await delay(900);

  const { nodes, edges } = workflow;
  const errors: string[] = [];

  if (nodes.length === 0) {
    return { success: false, steps: [], errors: ['Workflow has no nodes'], summary: 'Validation failed' };
  }

  // Basic structural validation
  const startNodes = nodes.filter(n => n.type === 'startNode');
  const endNodes   = nodes.filter(n => n.type === 'endNode');

  if (startNodes.length === 0) errors.push('Workflow must have exactly one Start node');
  if (startNodes.length  > 1) errors.push('Workflow can only have one Start node');
  if (endNodes.length    === 0) errors.push('Workflow must have at least one End node');

  // Disconnected-node check (skip for single-node workflows)
  if (nodes.length > 1) {
    const connectedIds = new Set<string>();
    edges.forEach(e => { connectedIds.add(e.source); connectedIds.add(e.target); });
    nodes.forEach(n => {
      if (!connectedIds.has(n.id)) {
        const label = (n.data as { title?: string }).title || n.type || n.id;
        errors.push(`Node "${label}" is not connected to the workflow`);
      }
    });
  }

  // Cycle detection
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => { if (adj[e.source]) adj[e.source].push(e.target); });
  if (hasCycle(adj, nodes.map(n => n.id))) {
    errors.push('Workflow contains a cycle — workflows must be acyclic (DAG)');
  }

  if (errors.length > 0) {
    return {
      success: false,
      steps: [],
      errors,
      summary: `Validation failed with ${errors.length} error(s)`,
    };
  }

  // Execute in topological order
  const ordered = topoSort(adj, nodes.map(n => n.id));
  const steps = ordered.map((nodeId, idx) => {
    const node = nodes.find(n => n.id === nodeId)!;
    const d = node.data as Record<string, unknown>;
    let message = '';

    switch (node.type) {
      case 'startNode':
        message = `Workflow "${d.title}" initiated`;
        break;
      case 'taskNode':
        message = `Task "${d.title}" assigned to ${(d.assignee as string) || 'Unassigned'}${d.dueDate ? `, due ${d.dueDate}` : ''}`;
        break;
      case 'approvalNode':
        message = `Approval requested from ${(d.approverRole as string) || 'Manager'}. Auto-approve threshold: ${d.autoApproveThreshold ?? 'N/A'}`;
        break;
      case 'automatedStepNode':
        message = `Automated action "${d.title}" (ID: ${(d.actionId as string) || 'unset'}) triggered`;
        break;
      case 'endNode':
        message = `Workflow complete. ${(d.endMessage as string) || ''}${d.summaryFlag ? ' Summary report generated.' : ''}`;
        break;
      default:
        message = 'Step executed';
    }

    return {
      nodeId,
      nodeType: node.type || '',
      title: (d.title as string) || node.type || nodeId,
      status: 'success' as const,
      message,
      timestamp: new Date(Date.now() + idx * 1200).toISOString(),
    };
  });

  return {
    success: true,
    steps,
    errors: [],
    summary: `Workflow executed successfully — ${steps.length} step(s) completed`,
  };
}

// ─── Graph helpers ────────────────────────────────────────────────────────────
function hasCycle(adj: Record<string, string[]>, nodes: string[]): boolean {
  const visited = new Set<string>();
  const stack   = new Set<string>();

  function dfs(node: string): boolean {
    visited.add(node);
    stack.add(node);
    for (const neighbour of (adj[node] ?? [])) {
      if (!visited.has(neighbour) && dfs(neighbour)) return true;
      if (stack.has(neighbour)) return true;
    }
    stack.delete(node);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node) && dfs(node)) return true;
  }
  return false;
}

function topoSort(adj: Record<string, string[]>, nodes: string[]): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function dfs(node: string) {
    visited.add(node);
    for (const n of (adj[node] ?? [])) {
      if (!visited.has(n)) dfs(n);
    }
    result.unshift(node);
  }

  for (const node of nodes) {
    if (!visited.has(node)) dfs(node);
  }
  return result;
}
