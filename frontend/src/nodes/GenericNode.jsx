import { useEffect, useMemo, useRef, useState } from 'react'
import { Handle, Position, useReactFlow } from 'reactflow'
import classNames from 'classnames'

const containerStyle = {
	borderRadius: 12,
	border: '1px solid #e5e7eb',
	background: 'white',
	boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
	minWidth: 220,
}

const headerStyle = {
	padding: '8px 12px',
	borderBottom: '1px solid #f3f4f6',
	fontWeight: 600,
	fontSize: 14,
	background: '#f9fafb',
	borderTopLeftRadius: 12,
	borderTopRightRadius: 12,
}

const bodyStyle = {
	padding: 12,
}

function parseVariables(text) {
	const re = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g
	const vars = new Set()
	let m
	while ((m = re.exec(text)) !== null) {
		vars.add(m[1])
	}
	return Array.from(vars)
}

export default function GenericNode({ id, data }) {
	const { setNodes } = useReactFlow()
	const [text, setText] = useState(data.value ?? '')
	const [textareaSize, setTextareaSize] = useState({ width: 260, height: 80 })
	const textareaRef = useRef(null)

	const variables = useMemo(() => data.kind === 'text' ? parseVariables(text) : [], [data.kind, text])

	useEffect(() => {
		if (data.kind !== 'text') return
		setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, variables } } : n))
	}, [variables, data.kind, id, setNodes])

	useEffect(() => {
		if (data.kind !== 'text') return
		const el = textareaRef.current
		if (!el) return
		el.style.height = 'auto'
		el.style.width = 'auto'
		const newHeight = Math.min(320, Math.max(80, el.scrollHeight))
		const lines = text.split('\n')
		const longest = Math.min(60, Math.max(20, ...lines.map((l) => l.length)))
		const newWidth = Math.min(520, Math.max(220, longest * 7))
		setTextareaSize({ width: newWidth, height: newHeight })
		setNodes((nds) => nds.map((n) => n.id === id ? { ...n, style: { ...n.style, width: newWidth + 32, height: newHeight + 90 } } : n))
	}, [text, data.kind, id, setNodes])

	const onChangeField = (field, value) => {
		setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n))
	}

	return (
		<div style={containerStyle}>
			<div style={headerStyle}>{data.title}</div>
			<div style={bodyStyle}>
				{data.kind === 'input' && (
					<input
						value={data.value ?? ''}
						onChange={(e) => onChangeField('value', e.target.value)}
						placeholder="Input value"
						style={{ width: 240, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8 }}
					/>
				)}

				{data.kind === 'output' && (
					<div style={{ width: 260, minHeight: 40, padding: 10, border: '1px dashed #e5e7eb', borderRadius: 8, color: '#6b7280' }}>
						{(data.value ?? '').toString() || 'Output will appear here'}
					</div>
				)}

				{data.kind === 'llm' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<label style={{ fontSize: 12, color: '#6b7280' }}>Model</label>
						<select
							value={data.model ?? 'gpt-4o-mini'}
							onChange={(e) => onChangeField('model', e.target.value)}
							style={{ width: 260, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8 }}
						>
							<option value="gpt-4o-mini">gpt-4o-mini</option>
							<option value="gpt-4o">gpt-4o</option>
							<option value="o4-mini">o4-mini</option>
						</select>
					</div>
				)}

				{data.kind === 'text' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						<textarea
							ref={textareaRef}
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Type text. Use {{variable}} to create inputs."
							style={{ width: textareaSize.width, height: textareaSize.height, padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, resize: 'none' }}
						/>
						{variables.length > 0 && (
							<div style={{ fontSize: 12, color: '#6b7280' }}>Inputs: {variables.join(', ')}</div>
						)}
					</div>
				)}

				{data.kind === 'math' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<label style={{ fontSize: 12, color: '#6b7280' }}>Expression</label>
						<input
							value={data.expression ?? ''}
							onChange={(e) => onChangeField('expression', e.target.value)}
							placeholder="e.g. a + b * 2"
							style={{ width: 260, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8 }}
						/>
					</div>
				)}

				{data.kind === 'concat' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<label style={{ fontSize: 12, color: '#6b7280' }}>Separator</label>
						<input
							value={data.separator ?? ''}
							onChange={(e) => onChangeField('separator', e.target.value)}
							placeholder="," style={{ width: 260, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8 }}
						/>
					</div>
				)}

				{data.kind === 'uppercase' && (
					<div style={{ fontSize: 12, color: '#6b7280' }}>Converts input to UPPERCASE</div>
				)}

				{data.kind === 'http' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<label style={{ fontSize: 12, color: '#6b7280' }}>URL</label>
						<input
							value={data.url ?? ''}
							onChange={(e) => onChangeField('url', e.target.value)}
							placeholder="https://api.example.com"
							style={{ width: 260, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8 }}
						/>
					</div>
				)}

				{data.kind === 'note' && (
					<div style={{ width: 260, padding: 8, background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 8, color: '#92400e' }}>
						{data.value}
					</div>
				)}
			</div>

			{data.kind === 'text' && variables.map((v) => (
				<Handle key={`var:${v}`} type="target" position={Position.Left} id={`input:{{${v}}}`} style={{ top: 'auto', bottom: 12 + 20 * variables.indexOf(v) }}>
					<div style={{ fontSize: 10, background: '#f3f4f6', padding: '2px 4px', borderRadius: 4, border: '1px solid #e5e7eb' }}>{v}</div>
				</Handle>
			))}
			{(data.inputs ?? []).map((h, idx) => (
				<Handle key={h.id} type="target" position={Position.Left} id={h.id} style={{ top: 60 + 18 * idx }}>
					<div style={{ fontSize: 10, background: '#f3f4f6', padding: '2px 4px', borderRadius: 4, border: '1px solid #e5e7eb' }}>{h.label ?? h.id}</div>
				</Handle>
			))}

			{(data.outputs ?? []).map((h, idx) => (
				<Handle key={h.id} type="source" position={Position.Right} id={h.id} style={{ top: 60 + 18 * idx }}>
					<div style={{ fontSize: 10, background: '#eef2ff', color: '#4338ca', padding: '2px 4px', borderRadius: 4, border: '1px solid #e5e7eb' }}>{h.label ?? h.id}</div>
				</Handle>
			))}
		</div>
	)
}