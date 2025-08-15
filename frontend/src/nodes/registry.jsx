import { createNodeComponent } from './factory.jsx'

const InputNode = createNodeComponent({
	title: 'Input',
	accentColor: '#10b981',
	badge: 'Source',
	inputs: [],
	outputs: [{ id: 'out' }],
	renderContent: () => (
		<div>
			<div style={{ marginBottom: 8 }}>Provides a pipeline input.</div>
		</div>
	),
})

const OutputNode = createNodeComponent({
	title: 'Output',
	accentColor: '#ef4444',
	badge: 'Sink',
	inputs: [{ id: 'in' }],
	outputs: [],
	renderContent: () => (
		<div>
			<div style={{ marginBottom: 8 }}>Collects pipeline output.</div>
		</div>
	),
})

const LLMNode = createNodeComponent({
	title: 'LLM',
	accentColor: '#8b5cf6',
	badge: 'AI',
	inputs: [{ id: 'prompt' }],
	outputs: [{ id: 'response' }],
	renderContent: () => (
		<div>
			<select className="node-select" defaultValue="gpt-4o-mini">
				<option value="gpt-4o-mini">gpt-4o-mini</option>
				<option value="gpt-4">gpt-4</option>
				<option value="gpt-3.5">gpt-3.5</option>
			</select>
		</div>
	),
})

// Text node with variable handles and auto-resize
const TextNode = createNodeComponent({
	title: 'Text',
	accentColor: '#22c55e',
	badge: 'Rich',
	inputs: [],
	outputs: [{ id: 'text' }],
	deriveDynamicInputs: (local) => {
		const text = String(local.text || '')
		const vars = Array.from(text.matchAll(/\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g)).map((m) => m[1])
		const unique = Array.from(new Set(vars))
		return unique.map((name, idx) => ({ id: name, top: 20 + idx * 18 }))
	},
	renderContent: ({ local, setLocal }) => {
		const text = String(local.text || '')
		const lines = text.split('\n').length
		const cols = Math.min(60, Math.max(20, Math.floor((text.length % 60) + 20)))
		const height = Math.min(220, Math.max(60, lines * 18 + 24))
		const width = Math.min(360, Math.max(200, Math.floor(text.length * 4 + 200)))
		return (
			<div style={{ width }}>
				<textarea
					className="node-textarea"
					style={{ height }}
					value={text}
					onChange={(e) => setLocal({ ...local, text: e.target.value })}
					placeholder="Type text. Use {{ variable }} to add inputs."
				/>
			</div>
		)
	},
})

// Five new nodes
const MathNode = createNodeComponent({
	title: 'Math',
	accentColor: '#f59e0b',
	badge: 'Fn',
	inputs: [{ id: 'a' }, { id: 'b' }],
	outputs: [{ id: 'result' }],
	renderContent: () => (
		<div>
			<select className="node-select" defaultValue="add">
				<option value="add">Add</option>
				<option value="sub">Subtract</option>
				<option value="mul">Multiply</option>
				<option value="div">Divide</option>
			</select>
		</div>
	),
})

const FilterNode = createNodeComponent({
	title: 'Filter',
	accentColor: '#06b6d4',
	badge: 'Data',
	inputs: [{ id: 'items' }],
	outputs: [{ id: 'filtered' }],
	renderContent: () => (
		<div>
			<input className="node-input" placeholder="predicate: e.g., price > 10" />
		</div>
	),
})

const MergeNode = createNodeComponent({
	title: 'Merge',
	accentColor: '#0ea5e9',
	badge: 'Flow',
	inputs: [{ id: 'in1' }, { id: 'in2' }],
	outputs: [{ id: 'out' }],
	renderContent: () => <div>Merge two inputs.</div>,
})

const DelayNode = createNodeComponent({
	title: 'Delay',
	accentColor: '#a3e635',
	badge: 'Time',
	inputs: [{ id: 'in' }],
	outputs: [{ id: 'out' }],
	renderContent: () => (
		<div>
			<input className="node-input" type="number" min="0" placeholder="ms" />
		</div>
	),
})

const HttpNode = createNodeComponent({
	title: 'HTTP',
	accentColor: '#ef476f',
	badge: 'IO',
	inputs: [{ id: 'params' }],
	outputs: [{ id: 'response' }],
	renderContent: () => (
		<div>
			<input className="node-input" placeholder="https://api.example.com" />
		</div>
	),
})

export const nodeTypes = {
	Input: InputNode,
	Output: OutputNode,
	LLM: LLMNode,
	Text: TextNode,
	Math: MathNode,
	Filter: FilterNode,
	Merge: MergeNode,
	Delay: DelayNode,
	HTTP: HttpNode,
}