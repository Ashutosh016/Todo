import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

function extractVariables(text) {
  const matches = new Set();
  const regex = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    matches.add(m[1]);
  }
  return Array.from(matches);
}

function TextNode({ id, data }) {
  const rf = useReactFlow();
  const [value, setValue] = useState(data?.value || '');
  const [vars, setVars] = useState(extractVariables(data?.value || ''));
  const [size, setSize] = useState({ width: 240, height: 120 });
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const { scrollWidth, scrollHeight } = el;
    const clampedWidth = Math.min(Math.max(scrollWidth + 24, 240), 520);
    const clampedHeight = Math.min(Math.max(scrollHeight + 24, 120), 400);
    setSize({ width: clampedWidth, height: clampedHeight });
  }, [value]);

  useEffect(() => {
    const found = extractVariables(value);
    setVars(found);
    rf.setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, variables: found, value } } : n));
  }, [value, id, rf]);

  const inputHandles = useMemo(() => vars.map((v, idx) => (
    <Handle key={`in-${v}`} type="target" position={Position.Left} id={v} style={{ top: 40 + idx * 20 }} />
  )), [vars]);

  return (
    <div className="card" style={{ padding: 12, minWidth: size.width, width: size.width, height: size.height }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Text</div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here. Use {{variable}} to add inputs."
        style={{ width: '100%', height: '100%', resize: 'none' }}
      />
      {inputHandles}
      <Handle type="source" position={Position.Right} id="text" style={{ top: size.height / 2 }} />
    </div>
  );
}

export default memo(TextNode);