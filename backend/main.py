from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic import ConfigDict
from typing import List, Dict, Any, Set


class Edge(BaseModel):
    id: str | None = None
    source: str
    target: str
    model_config = ConfigDict(extra='ignore')


class Node(BaseModel):
    id: str
    type: str | None = None
    data: Dict[str, Any] | None = None
    model_config = ConfigDict(extra='ignore')


class PipelinePayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    model_config = ConfigDict(extra='ignore')


app = FastAPI()

# Allow local dev origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    # Kahn's algorithm for cycle detection
    node_ids: Set[str] = {n.id for n in nodes}
    adjacency: Dict[str, Set[str]] = {n: set() for n in node_ids}
    indegree: Dict[str, int] = {n: 0 for n in node_ids}

    for e in edges:
        if e.source in node_ids and e.target in node_ids:
            if e.target not in adjacency[e.source]:
                adjacency[e.source].add(e.target)
                indegree[e.target] += 1

    zero_indegree = [n for n, d in indegree.items() if d == 0]
    visited_count = 0

    while zero_indegree:
        current = zero_indegree.pop()
        visited_count += 1
        for neighbor in list(adjacency[current]):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                zero_indegree.append(neighbor)

    return visited_count == len(node_ids)


@app.post("/pipelines/parse")
async def parse_pipeline(payload: PipelinePayload):
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    dag = is_dag(payload.nodes, payload.edges)
    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": dag}