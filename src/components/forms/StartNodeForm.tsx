import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { StartNodeData, KeyValuePair } from '../../types/workflow';

interface Props {
  data: StartNodeData;
  onChange: (patch: Partial<StartNodeData>) => void;
}

export const StartNodeForm: React.FC<Props> = ({ data, onChange }) => {
  const addMeta = useCallback(() => {
    onChange({ metadata: [...data.metadata, { id: uuidv4(), key: '', value: '' }] });
  }, [data.metadata, onChange]);

  const updateMeta = useCallback(
    (id: string, field: keyof Omit<KeyValuePair, 'id'>, val: string) => {
      onChange({ metadata: data.metadata.map(m => (m.id === id ? { ...m, [field]: val } : m)) });
    },
    [data.metadata, onChange]
  );

  const removeMeta = useCallback(
    (id: string) => onChange({ metadata: data.metadata.filter(m => m.id !== id) }),
    [data.metadata, onChange]
  );

  return (
    <div className="space-y-5">
      <Field label="Start Title *">
        <Input
          value={data.title}
          onChange={v => onChange({ title: v })}
          placeholder="e.g. Employee Onboarding Start"
        />
      </Field>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label">Metadata (optional)</span>
          <AddBtn onClick={addMeta} />
        </div>
        {data.metadata.length === 0 && (
          <p className="text-xs text-slate-400 italic">No metadata added</p>
        )}
        {data.metadata.map(m => (
          <div key={m.id} className="flex gap-1.5 mb-2">
            <input
              className={kvInput}
              value={m.key}
              onChange={e => updateMeta(m.id, 'key', e.target.value)}
              placeholder="Key"
            />
            <input
              className={kvInput}
              value={m.value}
              onChange={e => updateMeta(m.id, 'value', e.target.value)}
              placeholder="Value"
            />
            <RemoveBtn onClick={() => removeMeta(m.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Shared mini-components ───────────────────────────────────────────────────
const inputCls =
  'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition-colors';
const kvInput =
  'flex-1 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition-colors';

export const Input: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    className={inputCls}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

export const Textarea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    className={`${inputCls} resize-none`}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
  />
);

export const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div>
    <label className="label">{label}</label>
    {children}
    {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
  </div>
);

export const AddBtn: React.FC<{ onClick: () => void; label?: string }> = ({
  onClick,
  label = '+ Add',
}) => (
  <button
    onClick={onClick}
    className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
  >
    {label}
  </button>
);

export const RemoveBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-1.5 text-slate-400 hover:text-rose-500 transition-colors text-sm leading-none"
    title="Remove"
  >
    ✕
  </button>
);
