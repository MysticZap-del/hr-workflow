import React from 'react';
import { Handle, Position } from 'reactflow';

interface BaseNodeProps {
  children: React.ReactNode;
  headerBg: string;       // e.g. "bg-emerald-500"
  headerIcon: React.ReactNode;
  headerLabel: string;
  selected: boolean;
  hasTarget?: boolean;
  hasSource?: boolean;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  children,
  headerBg,
  headerIcon,
  headerLabel,
  selected,
  hasTarget = true,
  hasSource = true,
}) => (
  <div
    className={[
      'w-52 rounded-xl overflow-hidden shadow-md border-2 bg-white transition-shadow',
      selected
        ? 'border-orange-400 shadow-orange-100 shadow-lg'
        : 'border-slate-200 hover:border-slate-300',
    ].join(' ')}
  >
    {hasTarget && (
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
    )}

    {/* Coloured header */}
    <div className={`${headerBg} px-3 py-2 flex items-center gap-2`}>
      <span className="text-white opacity-90">{headerIcon}</span>
      <span className="text-white text-xs font-bold uppercase tracking-wide">
        {headerLabel}
      </span>
    </div>

    {/* Body */}
    <div className="px-3 py-2.5">{children}</div>

    {hasSource && (
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
    )}
  </div>
);
