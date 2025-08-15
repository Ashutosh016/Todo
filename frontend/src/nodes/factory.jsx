import BaseNode from './BaseNode'
import { useState, useMemo } from 'react'

export function createNodeComponent(config) {
	const {
		title,
		accentColor,
		badge,
		inputs = [],
		outputs = [],
		renderContent,
		deriveDynamicInputs,
	} = config

	function NodeComponent({ data }) {
		const [local, setLocal] = useState(data || {})
		const dynamicInputs = useMemo(() => (deriveDynamicInputs ? deriveDynamicInputs(local) : []), [deriveDynamicInputs, local])
		return (
			<BaseNode title={title} accentColor={accentColor} badge={badge} inputs={inputs} outputs={outputs} dynamicInputs={dynamicInputs}>
				{renderContent ? renderContent({ local, setLocal }) : null}
			</BaseNode>
		)
	}

	return NodeComponent
}