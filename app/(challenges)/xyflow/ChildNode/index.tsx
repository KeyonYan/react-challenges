import { Handle, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import BaseNode, { findAllSubNodeAndEdgeIds } from "../BaseNode";
import { getLayoutedElements, type CustomNodeType } from "../nodes-edges";

import styles from './index.module.css';
import { Cross2Icon } from "@radix-ui/react-icons";

function ChildNode(props: NodeProps<CustomNodeType>) {
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();
  const { id, data } = props;
  const handleDelete = () => {
    const { nodeIds, edgeIds } = findAllSubNodeAndEdgeIds(id, getNodes(), getEdges());
    const newNodes = getNodes().filter(node => !(nodeIds.includes(node.id) || node.id === id));
    const newEdges = getEdges().filter(edge => !(edgeIds.includes(edge.id) || edge.target === id));
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges, 'TB');
    console.log("newNodes", newNodes);
    console.log("newEdges", newEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }
  return (
    <BaseNode {...props}>
      <Handle
        onClick={handleDelete}
        className={styles.handle}
        type="target"
        position={Position.Top}
        id="input"
      >
        <Cross2Icon className="w-4 h-4 text-white" />
      </Handle>
    </BaseNode>
  );
}

export default ChildNode;