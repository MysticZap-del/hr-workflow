import React from 'react';
import type { EndNodeData } from '../../types/workflow';
import { Field, Textarea } from './StartNodeForm';

interface Props {
  data: EndNodeData;
  onChange: (patch: Partial<EndNodeData>) => void;
}

export const EndNodeForm: React.FC<Props> = ({ data, onChange }) => (
  <div className="space-y-5">
    <Field label="End Message">
      <Textarea
        value={data.endMessage}
        onChange={v => onChange({ endMessage: v })}
        placeholder="Message shown when workflow completes…"
        rows={3}
      />
    </Field>

    {/* Toggle */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange({ summaryFlag: !data.summaryFlag })}
        className={[
          'relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none',
          data.summaryFlag ? 'bg-orange-500' : 'bg-slate-200',
        ].join(' ')}
        role="switch"
        aria-checked={data.summaryFlag}
      >
        <span
          className={[
            'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
            data.summaryFlag ? 'left-5' : 'left-1',
          ].join(' ')}
        />
      </button>
      <div>
        <p className="text-sm font-medium text-slate-700">Generate Summary Report</p>
        <p className="text-xs text-slate-400">Create a summary when the workflow finishes</p>
      </div>
    </div>
  </div>
);
