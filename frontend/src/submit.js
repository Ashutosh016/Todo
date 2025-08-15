import axios from 'axios'

export async function submitPipeline(nodes, edges) {
	const url = 'http://127.0.0.1:8000/pipelines/parse'
	const payload = { nodes, edges }
	const { data } = await axios.post(url, payload)
	return data
}