import React from 'react';
import type { ApprovalNodeData } from '../../types/workflow';
import { Field, Input } from './StartNodeForm';

interface Props {
  data: ApprovalNodeData;
  onChange: (patch: Partial<ApprovalNodeData>) => void;
}

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'C-Level', 'Team Lead', 'Custom…'];

const selectCls =
  'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-400 transition-colors bg-white';

export const ApprovalNodeForm: React.FC<Props> = ({ data, onChange }) => {
  const isCustom = !APPROVER_ROLES.slice(0, -1).includes(data.approverRole);

  return (
    <div className="space-y-5">
      <Field label="Title">
        <Input value={data.title} onChange={v => onChange({ title: v })} placeholder="Approval step title" />
      </Field>

      <Field label="Approver Role">
        <select
          className={selectCls}
          value={isCustom ? 'Custom…' : data.approverRole}
          onChange={e => {
            if (e.target.value !== 'Custom…') onChange({ approverRole: e.target.value });
            else onChange({ approverRole: '' });
          }}
        >
          {APPROVER_ROLES.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {isCustom && (
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition-colors mt-2"
            value={data.approverRole}
            onChange={e => onChange({ approverRole: e.target.value })}
            placeholder="Enter custom role…"
          />
        )}
      </Field>

      <Field
        label="Auto-Approve Threshold"
        hint="Leave blank to require manual approval always"
      >
        <input
          type="number"
          min={0}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition-colors"
          value={data.autoApproveThreshold}
          onChange={e =>
            onChange({ autoApproveThreshold: e.target.value ? Number(e.target.value) : '' })
          }
          placeholder="e.g. 1000"
        />
      </Field>
    </div>
  );
};
