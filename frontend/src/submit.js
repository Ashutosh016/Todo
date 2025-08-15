export async function submitPipeline(nodes, edges) {
	const resp = await fetch('http://localhost:8000/pipelines/parse', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nodes, edges }),
	})
	if (!resp.ok) {
		const text = await resp.text()
		throw new Error(`HTTP ${resp.status}: ${text}`)
	}
	return resp.json()
}