from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Set

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NodeModel(BaseModel):
    id: str
    data: Optional[Dict[str, Any]] = None
    type: Optional[str] = None

class EdgeModel(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class PipelineRequest(BaseModel):
    nodes: List[NodeModel]
    edges: List[EdgeModel]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

@app.get("/")
async def root():
    return {"status": "ok"}

@app.post("/pipelines/parse", response_model=PipelineResponse)
async def parse_pipeline(pipeline: PipelineRequest) -> PipelineResponse:
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    # Build adjacency list for nodes present
    node_ids: Set[str] = {n.id for n in pipeline.nodes}
    adj: Dict[str, List[str]] = {n: [] for n in node_ids}
    indeg: Dict[str, int] = {n: 0 for n in node_ids}
    for e in pipeline.edges:
        if e.source in node_ids and e.target in node_ids:
            adj[e.source].append(e.target)
            indeg[e.target] += 1
    # Kahn's algorithm for DAG check
    from collections import deque
    queue = deque([n for n, d in indeg.items() if d == 0])
    visited = 0
    while queue:
        u = queue.popleft()
        visited += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                queue.append(v)
    is_dag = visited == len(node_ids)
    return PipelineResponse(num_nodes=num_nodes, num_edges=num_edges, is_dag=is_dag)
