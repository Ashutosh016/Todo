import { useCallback, useMemo } from 'react'
import ReactFlow, {
	MiniMap,
	Controls,
	Background,
	useEdgesState,
	useNodesState,
	addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'
import { nodeTypes } from './nodes/registry.jsx'
import { submitPipeline } from './submit'

const initialNodes = []
const initialEdges = []

function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
		[setEdges]
	)

	const addNode = useCallback(
		(type) => {
			const id = `${type}-${Date.now()}`
			const position = { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 }
			setNodes((nds) => [
				...nds,
				{
					id,
					type,
					position,
					data: { label: type },
				},
			])
		},
		[setNodes]
	)

	const handleSubmit = useCallback(async () => {
		try {
			const res = await submitPipeline(nodes, edges)
			alert(`Pipeline summary\nNodes: ${res.num_nodes}\nEdges: ${res.num_edges}\nIs DAG: ${res.is_dag ? 'Yes' : 'No'}`)
		} catch (e) {
			alert('Failed to submit pipeline: ' + (e?.message || String(e)))
		}
	}, [nodes, edges])

	const availableTypes = useMemo(() => Object.keys(nodeTypes), [])

	return (
		<div className="app-root">
			<div className="toolbar">
				<div className="toolbar-title">VectorShift Builder</div>
				<div className="toolbar-buttons">
					{availableTypes.map((t) => (
						<button key={t} className="btn" onClick={() => addNode(t)}>
							+ {t}
						</button>
					))}
					<button className="btn primary" onClick={handleSubmit}>
						Submit
					</button>
				</div>
			</div>
			<div className="flow-container">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					fitView
				>
					<MiniMap pannable zoomable />
					<Controls />
					<Background variant="dots" gap={16} size={1} />
				</ReactFlow>
			</div>
		</div>
	)
}

export default App
