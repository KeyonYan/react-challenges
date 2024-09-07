import { OptionIcon } from "../icons/OptionIcon";
import { type Edge, Handle, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import styles from './index.module.css';
import type { CustomNodeType } from "../nodes-edges";
import { edgesAtom, getLayoutedElements, nodesAtom } from "../nodes-edges";
import { useAtom } from "jotai";

interface BaseNodeProps extends NodeProps<CustomNodeType> {
  children?: React.ReactNode
}

export const BaseNode = ((props: BaseNodeProps) => {
  const { id, data, positionAbsoluteX, positionAbsoluteY, children } = props;
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const addNode = () => {
    const newNode: CustomNodeType = {
      id: new Date().getTime().toString(),
      type: 'childNode',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        title: 'New Node',
      },
    }
    const newEdge = {
      id: new Date().getTime().toString(),
      source: id,
      target: newNode.id,
      sourceHandle: 'output',
      targetHandle: 'input',
      animated: true,
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([...getNodes(), newNode], [...getEdges(), newEdge], 'TB');
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  return (
    <div className="custom-node flex flex-col gap-2 text-node rounded-lg p-4 shadow-sm focus:outline-none focus:ring focus-ring-violet-300 hover:shadow-lg hover:bg-[#FBFBFC] bg-[#FBFBFC]">
      <div className="flex items-center gap-2">
        <OptionIcon className="w-4 h-4" />
        <div>{data.title}</div>
      </div>
      {children}
      <Handle
        type="source"
        onClick={addNode}
        className={styles.handle}
        position={Position.Bottom}
        id="output"
      >
        <PlusIcon className="w-4 h-4 text-white" />
      </Handle>
    </div>
  );
});

export default BaseNode;
