import { OptionIcon } from "../icons/OptionIcon";
import { Edge, Handle, type Node, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import styles from './index.module.css';
import type { CustomNodeType } from "../nodes-edges";
import { getLayoutedElements } from "../nodes-edges";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";

interface BaseNodeProps extends NodeProps<CustomNodeType> {
  children?: React.ReactNode
}

const getChildrenHasHidden = (id: string, nodes: Node[], edges: Edge[]) => {
  const childrenEdges = edges.filter((edge) => edge.source === id);
  const childrenNodeIds = childrenEdges.map((edge) => edge.target);
  for (const nodeId of childrenNodeIds) {
    const node = nodes.find((node) => node.id === nodeId);
    if (node?.hidden) {
      return true;
    }
  }
  return false;
}

const isLeafNode = (id: string, nodes: Node[], edges: Edge[]) => {
  const childrenEdges = edges.filter((edge) => edge.source === id);
  return childrenEdges.length === 0;
}

export const BaseNode = ((props: BaseNodeProps) => {
  const { id, data, children } = props;
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();
  const leafNode = isLeafNode(id, getNodes(), getEdges());
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
        collapsed: false,
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
  const findAllSubNodeAndEdgeIds = (id: string, nodes: Node[], edges: Edge[]): { nodeIds: string[], edgeIds: string[] } => {
    const childrenEdges = edges.filter((edge) => edge.source === id);
    const childrenNodeIds = childrenEdges.map((edge) => edge.target);
    const childrenEdgeIds = childrenEdges.map((edge) => edge.id);
    const subNodeIds = []
    const subEdgeIds = []
    for (const nodeId of childrenNodeIds) {
      const sub = findAllSubNodeAndEdgeIds(nodeId, nodes, edges);
      subNodeIds.push(...sub.nodeIds);
      subEdgeIds.push(...sub.edgeIds);
    }
    return {
      nodeIds: [...childrenNodeIds, ...subNodeIds],
      edgeIds: [...childrenEdgeIds, ...subEdgeIds],
    };
  }
  const handleHiddenClick = (id: string, hidden: boolean) => {
    const nodes = getNodes();
    const edges = getEdges();
    const { nodeIds, edgeIds } = findAllSubNodeAndEdgeIds(id, nodes, edges);
    const newNodes = nodes.map((node) => {
      if (nodeIds.includes(node.id)) {
        return {
          ...node,
          hidden: hidden,
        };
      }
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            collapsed: hidden,
          }
        }
      }
      return node;
    });
    const newEdges = edges.map((edge) => {
      if (edgeIds.includes(edge.id)) {
        return {
          ...edge,
          hidden: hidden,
        }
      }
      return edge;
    })
    setNodes(newNodes);
    setEdges(newEdges);
  }
  return (
    <div className="custom-node flex flex-col gap-2 text-node rounded-lg p-4 shadow-sm focus:outline-none focus:ring focus-ring-violet-300 hover:shadow-lg hover:bg-[#FBFBFC] bg-[#FBFBFC]">
      <div className="flex items-center gap-2">
        <OptionIcon className="w-4 h-4" />
        <div>{data.title}</div>
        {!leafNode && !data.collapsed && <TriangleDownIcon onClick={() => handleHiddenClick(id, !data.collapsed)} className="w-6 h-6" />}
        {!leafNode && data.collapsed && <TriangleUpIcon onClick={() => handleHiddenClick(id, !data.collapsed)} className="w-6 h-6" />}
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
