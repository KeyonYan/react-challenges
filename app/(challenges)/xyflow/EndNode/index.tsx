import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";
import { useCallback } from "react";
import BaseNode from "../BaseNode";

import styles from './index.module.css';
import { PlusCircleIcon, PlusIcon } from "lucide-react";

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
      <Handle
        type="source"
        className={styles.handle}
        position={Position.Bottom}
        id="output"
        isConnectable={isConnectable}
      >
        <PlusIcon className="w-4 h-4 text-white" />
      </Handle>
    </BaseNode>
  );
}

export default EndNode;