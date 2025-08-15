import './App.css';
import './index.css';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Background, Controls, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { submitPipeline } from './submit';
import { makeNodeFactories, defaultNodeTypes } from './nodes/nodeRegistry';

const initialNodes = [];
const initialEdges = [];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const idRef = useRef(1);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  const nodeTypes = useMemo(() => defaultNodeTypes, []);
  const factories = useMemo(() => makeNodeFactories(() => `${idRef.current++}`), []);

  const addNode = useCallback((kind) => {
    const { node, position } = factories[kind]();
    setNodes((nds) => nds.concat({ ...node, position }));
  }, [factories]);

  const handleSubmit = async () => {
    try {
      const result = await submitPipeline(nodes, edges);
      alert(`Nodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nDAG: ${result.is_dag ? 'Yes' : 'No'}`);
    } catch (e) {
      alert(`Submit failed: ${e?.message || e}`);
    }
  };

  return (
    <div className="App">
      <div className="editor-shell">
        <aside className="sidebar">
          <h3>Nodes</h3>
          <div className="node-list">
            <button onClick={() => addNode('input')}>Add Input</button>
            <button onClick={() => addNode('output')}>Add Output</button>
            <button onClick={() => addNode('llm')}>Add LLM</button>
            <button onClick={() => addNode('text')}>Add Text</button>
            <button onClick={() => addNode('tool')}>Add Tool</button>
            <button onClick={() => addNode('prompt')}>Add Prompt</button>
            <button onClick={() => addNode('transform')}>Add Transform</button>
            <button onClick={() => addNode('filter')}>Add Filter</button>
            <button onClick={() => addNode('branch')}>Add Branch</button>
          </div>
        </aside>
        <div className="canvas-area">
          <div className="toolbar">
            <button className="submit" onClick={handleSubmit}>Submit</button>
            <button className="reset" onClick={() => { setNodes([]); setEdges([]); idRef.current = 1; }}>Reset</button>
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
              <Background />
              <MiniMap />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
