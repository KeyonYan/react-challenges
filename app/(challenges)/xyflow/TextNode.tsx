import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";
import { useCallback } from "react";
import BaseNode from "./BaseNode";

function TextNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <BaseNode title={data.title}>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        isConnectable={false}
      />
    </BaseNode>
  );
}

export default TextNode;