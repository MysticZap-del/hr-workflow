import React, { useState } from 'react';
import { Download, Upload, FlaskConical, Settings, Info } from 'lucide-react';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { Sidebar } from './components/Sidebar';
import { NodeFormPanel } from './components/NodeFormPanel';
import { SandboxPanel } from './components/SandboxPanel';
import { useWorkflow } from './hooks/useWorkflow';
import { useSimulate } from './hooks/useSimulate';

type RightTab = 'configure' | 'sandbox';

export default function App() {
  const wf  = useWorkflow();
  const sim = useSimulate();
  const [tab, setTab] = useState<RightTab>('configure');
  const [toast, setToast] = useState<string | null>(null);

  // Show a brief toast notification
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Export workflow graph as JSON
  const handleExport = () => {
    const json = JSON.stringify(wf.getWorkflowGraph(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workflow exported as JSON');
  };

  // Import workflow graph from JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const graph = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) throw new Error();
        showToast('Workflow imported ✓  (open console for graph data)');
        console.info('[HR Workflow Designer] Imported graph:', graph);
      } catch {
        showToast('Invalid workflow JSON file');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-imported
    e.target.value = '';
  };

  // Kick off simulation and switch to sandbox tab
  const handleSimulate = () => {
    setTab('sandbox');
    sim.simulate(wf.getWorkflowGraph());
  };

  const nodeCount = wf.nodes.length;
  const edgeCount = wf.edges.length;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">

      {/* ── Left: node palette ─────────────────────────────────────────────── */}
      <Sidebar />

      {/* ── Centre: canvas ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 h-12 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-sm font-semibold text-slate-800 truncate">
              Untitled Workflow
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="bg-slate-100 rounded px-2 py-0.5">
                {nodeCount} node{nodeCount !== 1 ? 's' : ''}
              </span>
              <span className="bg-slate-100 rounded px-2 py-0.5">
                {edgeCount} connection{edgeCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
              <Upload size={11} />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download size={11} />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleSimulate}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
            >
              <FlaskConical size={11} />
              Test Workflow
            </button>
          </div>
        </header>

        {/* Canvas */}
        <WorkflowCanvas
          nodes={wf.nodes}
          edges={wf.edges}
          onNodesChange={wf.onNodesChange}
          onEdgesChange={wf.onEdgesChange}
          onConnect={wf.onConnect}
          onNodeClick={wf.onNodeClick}
          onPaneClick={wf.onPaneClick}
          onAddNode={wf.addNode}
        />

        {/* Empty canvas hint */}
        {nodeCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
               style={{ left: 224, right: 288, top: 48 }}>
            <div className="text-center">
              <p className="text-slate-400 text-sm font-medium">Drag nodes from the left panel to start</p>
              <p className="text-slate-300 text-xs mt-1">Connect nodes by dragging from the bottom handle of one to the top of another</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: configure / sandbox ─────────────────────────────────────── */}
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0">

        {/* Tab bar */}
        <div className="flex border-b border-slate-100 shrink-0">
          {([
            { id: 'configure', icon: <Settings size={11} />, label: 'Configure' },
            { id: 'sandbox',   icon: <FlaskConical size={11} />, label: 'Sandbox' },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors',
                tab === t.id
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          {tab === 'configure' ? (
            <NodeFormPanel
              node={wf.selectedNode}
              onUpdate={wf.updateNodeData}
              onDelete={wf.deleteNode}
              onClose={wf.onPaneClick}
            />
          ) : (
            <SandboxPanel
              result={sim.result}
              isLoading={sim.isLoading}
              error={sim.error}
              onSimulate={handleSimulate}
              onReset={sim.reset}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-slate-100 flex items-center gap-1.5 shrink-0">
          <Info size={11} className="text-slate-300" />
          <p className="text-xs text-slate-300">HR Workflow Designer · Tredence</p>
        </div>
      </aside>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
