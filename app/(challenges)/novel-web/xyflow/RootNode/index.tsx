import type { NodeProps } from "@xyflow/react";
import BaseNode from "../BaseNode";
import type { CustomNodeType } from "../nodes-edges";

function RootNode(props: NodeProps<CustomNodeType>) {
  return (
    <BaseNode {...props}>
    </BaseNode>
  );
}

export default RootNode;