import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Node,
} from "@xyflow/react";
import { atom, useAtom } from "jotai";

export type CustomNodeType = Node<{ title: string }, "childNode" | "rootNode">;

const position = { x: 0, y: 0 };

export function useNodesEdges() {
  const [nodes, setNodes] = useAtom(initialNodesAtom);
  const [edges, setEdges] = useAtom(initialEdgesAtom);

  const onNodesChange = (changes: NodeChange<CustomNodeType>[]) => {
    console.log("changes: ", changes);
    setNodes(applyNodeChanges(changes, nodes));
  };

  const onEdgesChange = (changes: EdgeChange<CustomEdgeType>[]) => {
    setEdges(applyEdgeChanges(changes, edges));
  };

  const onConnect = (connection: Connection) => {
    setEdges(addEdge(connection, edges));
  };

  const setNodesAction = (nodes: CustomNodeType[]) => {
    setNodes(nodes);
  };

  const setEdgesAction = (edges: CustomEdgeType[]) => {
    setEdges(edges);
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes: setNodesAction,
    setEdges: setEdgesAction,
  };
}

export const initialNodesAtom = atom<CustomNodeType[]>([
  {
    id: "1",
    type: "rootNode",
    data: { title: "背景" },
    position,
  },
  {
    id: "2",
    type: "childNode",
    data: { title: "角色" },
    position,
  },
  {
    id: "2a",
    type: "childNode",
    data: { title: "角色1" },
    position,
  },
  {
    id: "2b",
    type: "childNode",
    data: { title: "node 2b" },
    position,
  },
  {
    id: "2c",
    type: "childNode",
    data: { title: "node 2c" },
    position,
  },
  {
    id: "2d",
    type: "childNode",
    data: { title: "node 2d" },
    position,
  },
  {
    id: "3",
    type: "childNode",
    data: { title: "node 3" },
    position,
  },
]);

export interface CustomEdgeType {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  animated: boolean;
}

export const initialEdgesAtom = atom<CustomEdgeType[]>([
  {
    id: "e12",
    source: "1",
    target: "2",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e13",
    source: "1",
    target: "3",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e22a",
    source: "2",
    target: "2a",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e22b",
    source: "2",
    target: "2b",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e22c",
    source: "2",
    target: "2c",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e2c2d",
    source: "2c",
    target: "2d",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
]);
