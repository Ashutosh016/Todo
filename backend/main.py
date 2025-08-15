from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional, Set, Tuple

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
	data: Dict[str, Any] = {}
	type: Optional[str] = None
	position: Optional[Dict[str, float]] = None
	style: Optional[Dict[str, Any]] = None

class EdgeModel(BaseModel):
	id: str
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


def is_dag(node_ids: Set[str], edges: List[Tuple[str, str]]) -> bool:
	from collections import defaultdict, deque

	in_degree: Dict[str, int] = defaultdict(int)
	graph: Dict[str, List[str]] = defaultdict(list)

	for n in node_ids:
		in_degree[n] = 0
		graph[n] = []

	for u, v in edges:
		graph[u].append(v)
		in_degree[v] += 1

	queue: deque[str] = deque([n for n, d in in_degree.items() if d == 0])
	visited = 0
	while queue:
		n = queue.popleft()
		visited += 1
		for nei in graph[n]:
			in_degree[nei] -= 1
			if in_degree[nei] == 0:
				queue.append(nei)

	return visited == len(in_degree)


@app.post("/pipelines/parse", response_model=PipelineResponse)
async def parse_pipeline(req: PipelineRequest):
	num_nodes = len(req.nodes)
	num_edges = len(req.edges)
	node_ids: Set[str] = {n.id for n in req.nodes}
	edge_pairs = [(e.source, e.target) for e in req.edges]
	return PipelineResponse(num_nodes=num_nodes, num_edges=num_edges, is_dag=is_dag(node_ids, edge_pairs))