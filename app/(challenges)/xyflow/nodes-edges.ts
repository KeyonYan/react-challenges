import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Node,
  type Edge,
} from "@xyflow/react";
import { atom, useAtom } from "jotai";
import dagre from "@dagrejs/dagre";

export type CustomNodeType = Node<
  { title: string; collapsed: boolean },
  "childNode" | "rootNode"
>;

const position = { x: 0, y: 0 };

const nodeWidth = 80;
const nodeHeight = 36;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  for (const node of nodes) {
    const { width, height } = { width: nodeWidth, height: nodeHeight };
    dagreGraph.setNode(node.id, { width, height });
  }

  for (const edge of edges) {
    dagreGraph.setEdge(edge.source, edge.target);
  }

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });
  return { nodes: newNodes as CustomNodeType[], edges };
};

const initialNodes: CustomNodeType[] = [
  {
    id: "1",
    type: "rootNode",
    data: { title: "背景", collapsed: false },
    position,
    hidden: false,
  },
  {
    id: "2",
    type: "childNode",
    data: { title: "角色", collapsed: false },
    position,
    hidden: false,
  },
  {
    id: "2a",
    type: "childNode",
    data: { title: "角色1", collapsed: false },
    position,
    hidden: false,
  },
  {
    id: "2b",
    type: "childNode",
    data: { title: "node 2b", collapsed: false },
    position,
    hidden: false,
  },
  {
    id: "2c",
    type: "childNode",
    data: { title: "node 2c", collapsed: false },
    position,
    hidden: false,
  },
  {
    id: "2d",
    type: "childNode",
    data: { title: "node 2d", collapsed: false },
    position,
    hidden: false,
  },
  {
    id: "3",
    type: "childNode",
    data: { title: "node 3", collapsed: false },
    position,
    hidden: false,
  },
];

const initialEdges: Edge[] = [
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
];

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges,
  "TB"
);

export const nodesAtom = atom(layoutedNodes);
export const edgesAtom = atom(layoutedEdges);
