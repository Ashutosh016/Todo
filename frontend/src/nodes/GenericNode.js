import { memo } from 'react';
import NodeBase from './nodeBase';

function GenericNode({ data }) {
  return <NodeBase data={data} />;
}

export default memo(GenericNode);