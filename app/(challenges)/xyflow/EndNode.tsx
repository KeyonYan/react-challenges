import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";
import { useCallback } from "react";
import BaseNode from "./BaseNode";

function EndNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <BaseNode title={data.title}>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={isConnectable}
      />
    </BaseNode>
  );
}

export default EndNode;