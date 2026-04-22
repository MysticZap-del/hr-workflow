import { useState, useCallback } from 'react';
import type { SimulationResult, WorkflowGraph } from '../types/workflow';
import { simulateWorkflow } from '../api/mockApi';

export function useSimulate() {
  const [result, setResult]   = useState<SimulationResult | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const simulate = useCallback(async (graph: WorkflowGraph) => {
    setLoading(true);
    setError(null);
    try {
      const res = await simulateWorkflow(graph);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed unexpectedly');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, simulate, reset };
}
