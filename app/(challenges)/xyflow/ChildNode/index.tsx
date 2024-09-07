import { Handle, type NodeProps, Position } from "@xyflow/react";
import BaseNode from "../BaseNode";
import type { CustomNodeType } from "../nodes-edges";

function ChildNode(props: NodeProps<CustomNodeType>) {
  return (
    <BaseNode {...props}>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={false}
      />
    </BaseNode>
  );
}

export default ChildNode;