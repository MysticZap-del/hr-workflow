import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { TaskNodeData, KeyValuePair } from '../../types/workflow';
import { Field, Input, Textarea, AddBtn, RemoveBtn } from './StartNodeForm';

interface Props {
  data: TaskNodeData;
  onChange: (patch: Partial<TaskNodeData>) => void;
}

export const TaskNodeForm: React.FC<Props> = ({ data, onChange }) => {
  const addField = useCallback(() => {
    onChange({ customFields: [...data.customFields, { id: uuidv4(), key: '', value: '' }] });
  }, [data.customFields, onChange]);

  const updateField = useCallback(
    (id: string, field: keyof Omit<KeyValuePair, 'id'>, val: string) => {
      onChange({ customFields: data.customFields.map(f => (f.id === id ? { ...f, [field]: val } : f)) });
    },
    [data.customFields, onChange]
  );

  const removeField = useCallback(
    (id: string) => onChange({ customFields: data.customFields.filter(f => f.id !== id) }),
    [data.customFields, onChange]
  );

  return (
    <div className="space-y-5">
      <Field label="Title *">
        <Input value={data.title} onChange={v => onChange({ title: v })} placeholder="Task title (required)" />
      </Field>

      <Field label="Description">
        <Textarea
          value={data.description}
          onChange={v => onChange({ description: v })}
          placeholder="Describe what needs to be done…"
          rows={3}
        />
      </Field>

      <Field label="Assignee">
        <Input value={data.assignee} onChange={v => onChange({ assignee: v })} placeholder="Name or email address" />
      </Field>

      <Field label="Due Date">
        <Input type="date" value={data.dueDate} onChange={v => onChange({ dueDate: v })} />
      </Field>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label">Custom Fields</span>
          <AddBtn onClick={addField} />
        </div>
        {data.customFields.length === 0 && (
          <p className="text-xs text-slate-400 italic">No custom fields</p>
        )}
        {data.customFields.map(f => (
          <div key={f.id} className="flex gap-1.5 mb-2">
            <input
              className="flex-1 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition-colors"
              value={f.key}
              onChange={e => updateField(f.id, 'key', e.target.value)}
              placeholder="Field name"
            />
            <input
              className="flex-1 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition-colors"
              value={f.value}
              onChange={e => updateField(f.id, 'value', e.target.value)}
              placeholder="Value"
            />
            <RemoveBtn onClick={() => removeField(f.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};
