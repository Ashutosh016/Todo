import { useCallback, useMemo, useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'
import GenericNode from './nodes/GenericNode.jsx'
import { submitPipeline } from './submit.js'

const initialNodes = [
	{
		id: 'input-1',
		type: 'generic',
		position: { x: 50, y: 50 },
		data: {
			title: 'Input',
			kind: 'input',
			inputs: [],
			outputs: [{ id: 'out', label: 'out' }],
			value: 'Hello from Input'
		}
	},
	{
		id: 'text-1',
		type: 'generic',
		position: { x: 350, y: 40 },
		data: {
			title: 'Text',
			kind: 'text',
			inputs: [],
			outputs: [{ id: 'text', label: 'text' }],
			value: 'Type here... Use {{name}} and {{city}}'
		}
	},
	{
		id: 'llm-1',
		type: 'generic',
		position: { x: 350, y: 220 },
		data: {
			title: 'LLM',
			kind: 'llm',
			inputs: [{ id: 'prompt', label: 'prompt' }],
			outputs: [{ id: 'response', label: 'response' }],
			model: 'gpt-4o-mini'
		}
	},
	{
		id: 'math-1',
		type: 'generic',
		position: { x: 650, y: 40 },
		data: {
			title: 'Math',
			kind: 'math',
			inputs: [{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }],
			outputs: [{ id: 'sum', label: 'sum' }],
			expression: 'a + b'
		}
	},
	{
		id: 'concat-1',
		type: 'generic',
		position: { x: 650, y: 220 },
		data: {
			title: 'Concat',
			kind: 'concat',
			inputs: [{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }],
			outputs: [{ id: 'result', label: 'result' }],
			separator: ' '
		}
	},
	{
		id: 'upper-1',
		type: 'generic',
		position: { x: 650, y: 360 },
		data: {
			title: 'Uppercase',
			kind: 'uppercase',
			inputs: [{ id: 'in', label: 'in' }],
			outputs: [{ id: 'out', label: 'out' }]
		}
	},
	{
		id: 'http-1',
		type: 'generic',
		position: { x: 950, y: 40 },
		data: {
			title: 'HTTP',
			kind: 'http',
			inputs: [{ id: 'body', label: 'body' }],
			outputs: [{ id: 'response', label: 'response' }],
			url: 'https://api.example.com'
		}
	},
	{
		id: 'note-1',
		type: 'generic',
		position: { x: 950, y: 220 },
		data: {
			title: 'Note',
			kind: 'note',
			inputs: [],
			outputs: [],
			value: 'This is a decorative note node.'
		}
	},
	{
		id: 'output-1',
		type: 'generic',
		position: { x: 1250, y: 120 },
		data: {
			title: 'Output',
			kind: 'output',
			inputs: [{ id: 'in', label: 'in' }],
			outputs: [],
			value: ''
		}
	}
]

const initialEdges = [
	{ id: 'e1', source: 'input-1', target: 'text-1', sourceHandle: 'out', targetHandle: 'input:{{name}}' },
	{ id: 'e2', source: 'text-1', target: 'llm-1', sourceHandle: 'text', targetHandle: 'prompt' },
	{ id: 'e3', source: 'input-1', target: 'math-1', sourceHandle: 'out', targetHandle: 'a' },
	{ id: 'e4', source: 'llm-1', target: 'output-1', sourceHandle: 'response', targetHandle: 'in' }
]

export default function Graph() {
	const nodeTypes = useMemo(() => ({ generic: GenericNode }), [])
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const onConnect = useCallback((connection) => {
		setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
	}, [setEdges])

	const handleSubmit = useCallback(async () => {
		try {
			const res = await submitPipeline(nodes, edges)
			alert(`Nodes: ${res.num_nodes}\nEdges: ${res.num_edges}\nIs DAG: ${res.is_dag}`)
		} catch (err) {
			alert('Failed to submit pipeline. See console for details.')
			console.error(err)
		}
	}, [nodes, edges])

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative' }}>
			<div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', gap: 8 }}>
				<button onClick={handleSubmit} style={{ padding: '8px 12px', borderRadius: 8, background: '#111827', color: 'white', border: '1px solid #374151' }}>Submit</button>
			</div>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				fitView
			>
				<MiniMap />
				<Controls showInteractive={false} />
				<Background gap={12} color="#e5e7eb" />
			</ReactFlow>
		</div>
	)
}