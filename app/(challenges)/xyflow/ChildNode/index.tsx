import { Handle, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import BaseNode, { findAllSubNodeAndEdgeIds } from "../BaseNode";
import type { CustomNodeType } from "../nodes-edges";

import styles from './index.module.css';
import { Cross2Icon } from "@radix-ui/react-icons";

function ChildNode(props: NodeProps<CustomNodeType>) {
  const { deleteElements, getNodes, getEdges } = useReactFlow();
  const { id, data } = props;
  const { nodeIds, edgeIds } = findAllSubNodeAndEdgeIds(id, getNodes(), getEdges());
  const handleDelete = () => {
    const deleteNode = getNodes().find(node => node.id === id);
    const deleteSubNodes = getNodes().filter(node => nodeIds.includes(node.id));
    const deleteSubEdges = getEdges().filter(edge => edgeIds.includes(edge.id));
    if (deleteNode) {
      deleteElements({
        nodes: [deleteNode, ...deleteSubNodes],
        edges: deleteSubEdges,
      });
    }
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