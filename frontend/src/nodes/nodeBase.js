import { memo, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';

function NodeBase({ data }) {
  const { title, subtitle, icon, inputs = [], outputs = [], content } = data || {};

  const inputHandles = useMemo(() => inputs.map((key, idx) => (
    <Handle key={`in-${key}-${idx}`} type="target" position={Position.Left} id={String(key)} style={{ top: 30 + idx * 20 }} />
  )), [inputs]);

  const outputHandles = useMemo(() => outputs.map((key, idx) => (
    <Handle key={`out-${key}-${idx}`} type="source" position={Position.Right} id={String(key)} style={{ top: 30 + idx * 20 }} />
  )), [outputs]);

  return (
    <div className="card" style={{ padding: 12, minWidth: 220, maxWidth: 360 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 18 }}>{icon}</div>
        <div>
          <div style={{ fontWeight: 700 }}>{title}</div>
          {subtitle ? <div style={{ color: 'var(--muted)', fontSize: 12 }}>{subtitle}</div> : null}
        </div>
      </div>
      <div>
        {typeof content === 'function' ? content() : content}
      </div>
      {inputHandles}
      {outputHandles}
    </div>
  );
}

export default memo(NodeBase);