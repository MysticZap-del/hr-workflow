import React, { useEffect, useState } from 'react';
import type { AutomatedStepNodeData, AutomationAction } from '../../types/workflow';
import { getAutomations } from '../../api/mockApi';
import { Field, Input } from './StartNodeForm';

interface Props {
  data: AutomatedStepNodeData;
  onChange: (patch: Partial<AutomatedStepNodeData>) => void;
}

const selectCls =
  'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-400 transition-colors bg-white';

export const AutomatedStepNodeForm: React.FC<Props> = ({ data, onChange }) => {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available automation actions once on mount
  useEffect(() => {
    getAutomations()
      .then(setActions)
      .finally(() => setLoading(false));
  }, []);

  const selectedAction = actions.find(a => a.id === data.actionId);

  // When the action changes, reset params to empty strings for each required param
  const handleActionChange = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    const fresh: Record<string, string> = {};
    action?.params.forEach(p => { fresh[p] = data.actionParams[p] ?? ''; });
    onChange({ actionId, actionParams: fresh });
  };

  const handleParamChange = (param: string, value: string) => {
    onChange({ actionParams: { ...data.actionParams, [param]: value } });
  };

  return (
    <div className="space-y-5">
      <Field label="Title">
        <Input value={data.title} onChange={v => onChange({ title: v })} placeholder="Step title" />
      </Field>

      <Field label="Action">
        {loading ? (
          <div className="flex items-center gap-2 py-2">
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400">Loading actions…</span>
          </div>
        ) : (
          <select
            className={selectCls}
            value={data.actionId}
            onChange={e => handleActionChange(e.target.value)}
          >
            <option value="">— Select an action —</option>
            {actions.map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        )}
      </Field>

      {/* Dynamic parameter inputs driven by the selected action's param list */}
      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <span className="label">Action Parameters</span>
          <div className="space-y-3">
            {selectedAction.params.map(param => (
              <div key={param}>
                <label className="block text-xs text-slate-500 mb-1 capitalize">{param}</label>
                <Input
                  value={data.actionParams[param] ?? ''}
                  onChange={v => handleParamChange(param, v)}
                  placeholder={`Enter ${param}…`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedAction && selectedAction.params.length === 0 && (
        <p className="text-xs text-slate-400 italic">This action requires no parameters.</p>
      )}
    </div>
  );
};
