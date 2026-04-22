# HR Workflow Designer
### Tredence AI Engineering Internship — Case Study Submission

A visual workflow designer where an HR admin can build, configure, and test internal workflows (onboarding, leave approval, document verification, etc.) using a drag-and-drop canvas.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

```bash
npm run build   # production build
npm run preview # preview the build
```

---

## 🎥 Feature Walkthrough

| Feature | How to use |
|---|---|
| **Add nodes** | Drag from the left panel onto the canvas |
| **Connect nodes** | Drag from a node's bottom handle to another's top handle |
| **Edit a node** | Click it — the Configure panel opens on the right |
| **Delete nodes/edges** | Select, then press `Delete` |
| **Test the workflow** | Click **Test Workflow** (top bar) or **Run Simulation** (Sandbox tab) |
| **Export** | Click **Export** → downloads `workflow.json` |
| **Import** | Click **Import** → pick a previously exported JSON |

---

## 🏗️ Architecture

### Tech Stack
| Tool | Purpose |
|---|---|
| React 18 + TypeScript | UI framework, full type safety |
| Vite | Fast dev server & bundler |
| React Flow (v11) | Drag-and-drop canvas, custom nodes, edge management |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon set |
| uuid | Stable IDs for key-value pair items |

### Folder Structure

```
src/
├── types/
│   └── workflow.ts             # All TS types — discriminated union for node data
├── api/
│   └── mockApi.ts              # Mock GET /automations + POST /simulate
│                               # Contains DFS cycle detection & topological sort
├── hooks/
│   ├── useWorkflow.ts          # Central state: nodes, edges, selection, CRUD
│   └── useSimulate.ts          # Simulation state + async API call
└── components/
    ├── nodes/                  # Custom React Flow node components
    │   ├── BaseNode.tsx        # Shared wrapper (handles, header, selection ring)
    │   ├── StartNode.tsx
    │   ├── TaskNode.tsx
    │   ├── ApprovalNode.tsx
    │   ├── AutomatedStepNode.tsx
    │   ├── EndNode.tsx
    │   └── index.ts            # nodeTypes map → passed to <ReactFlow>
    ├── forms/                  # Per-node-type configuration forms
    │   ├── StartNodeForm.tsx   # Also exports shared Input/Textarea/Field helpers
    │   ├── TaskNodeForm.tsx
    │   ├── ApprovalNodeForm.tsx
    │   ├── AutomatedStepNodeForm.tsx  # Fetches /automations, renders dynamic params
    │   ├── EndNodeForm.tsx
    │   └── index.ts
    ├── WorkflowCanvas.tsx      # ReactFlow wrapper — handles drag-drop creation
    ├── Sidebar.tsx             # Node palette + use-case list
    ├── NodeFormPanel.tsx       # Right panel — dispatches to correct form
    └── SandboxPanel.tsx        # Simulation UI — execution timeline
```

---

## 🎯 Key Design Decisions

### 1 — `useWorkflow` as the single source of truth
All node/edge state, selection, and mutations live in one hook. Components only receive the slice they need, keeping them pure and easy to test.

### 2 — Discriminated union for node data
```ts
type WorkflowNodeData =
  | StartNodeData        // { nodeType: 'start'; ... }
  | TaskNodeData         // { nodeType: 'task';  ... }
  | ApprovalNodeData     // { nodeType: 'approval'; ... }
  | AutomatedStepNodeData
  | EndNodeData;
```
`NodeFormPanel` switches on `nodeType` to render the right form with full TypeScript inference — no `as any` casts needed in the forms themselves.

### 3 — `BaseNode` prevents duplication
All five node components delegate layout, handles, and selection styling to `BaseNode`. Adding a sixth node type is a matter of creating one component + one form, then adding a single entry to `nodeTypes`.

### 4 — Mock API as pure async functions
`mockApi.ts` exports plain functions with simulated `delay()`. Swapping in a real HTTP client means changing only this file — all consumers stay identical.

### 5 — Graph validation lives in the API layer
Cycle detection (iterative DFS) and topological sort are colocated with `simulateWorkflow` because they are concerns of execution correctness, not UI state.

### 6 — Dynamic parameter forms
`AutomatedStepNodeForm` calls `GET /automations` once on mount. When the user picks an action, its `params` array is iterated to render exactly the right number of input fields — no hardcoding.

---

## ✅ Completed Features

- [x] 5 custom node types with colour-coded React Flow components
- [x] Drag-and-drop node creation from sidebar palette
- [x] Node editing forms — controlled components, TypeScript-typed
- [x] Dynamic key-value pair fields (metadata, custom fields)
- [x] Dynamic action-param fields driven by mock API
- [x] Mock `GET /automations` endpoint
- [x] Mock `POST /simulate` with full workflow serialisation
- [x] Structural validation (start/end presence, disconnected nodes, cycle detection)
- [x] Step-by-step execution log in a timeline UI
- [x] Export workflow as JSON
- [x] Import workflow from JSON
- [x] MiniMap + Controls + dot-grid background
- [x] `Delete` key to remove selected nodes/edges
- [x] Toast notifications for user actions

---

## 🔮 What I'd Add With More Time

- [ ] **Undo / Redo** — `useReducer` with a history stack (or `zustand` with `temporal` middleware)
- [ ] **Auto-layout** — Dagre or ELK for automatic node positioning
- [ ] **Validation badges** — visual error indicators rendered directly on nodes
- [ ] **Conditional edges** — branch logic with labelled edges (e.g. "Approved / Rejected")
- [ ] **Node templates** — pre-built sub-graphs for common HR patterns
- [ ] **Unit tests** — Jest + React Testing Library for hooks and forms
- [ ] **E2E tests** — Playwright for the full drag-drop + simulate flow
- [ ] **Backend persistence** — REST API + PostgreSQL for saving workflows by ID
- [ ] **Real-time collaboration** — WebSockets / CRDT for multi-user editing

---

## 📝 Assumptions

1. No authentication or backend persistence was required per the spec.
2. "Import" deserialises the JSON and logs the graph; re-populating the canvas from imported state was considered out of scope for the time-box (would need `setNodes`/`setEdges` called from App).
3. The mock `/simulate` endpoint performs topological-order execution. In a real system this would be driven by a backend workflow engine.
