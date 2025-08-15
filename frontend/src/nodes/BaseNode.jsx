import { Handle, Position } from 'reactflow'

export default function BaseNode({ title, accentColor = '#4f46e5', badge, inputs = [], outputs = [], children, dynamicInputs = [] }) {
	return (
		<div className="node-card" style={{ borderColor: accentColor + '55' }}>
			<div className="node-header" style={{ background: accentColor + '1a', borderBottomColor: accentColor + '33' }}>
				<div style={{ width: 8, height: 8, background: accentColor, borderRadius: 2 }} />
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span>{title}</span>
					{badge ? <span className="node-badge">{badge}</span> : null}
				</div>
			</div>
			<div className="node-body">
				{children}
			</div>
			{[...inputs, ...dynamicInputs].map((h) => (
				<Handle key={`in-${h.id}`} id={h.id} type="target" position={Position.Left} style={{ top: h.top ?? '50%', background: accentColor }} />
			))}
			{outputs.map((h) => (
				<Handle key={`out-${h.id}`} id={h.id} type="source" position={Position.Right} style={{ top: h.top ?? '50%', background: accentColor }} />
			))}
		</div>
	)
}