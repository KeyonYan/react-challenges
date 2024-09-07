import type { Node, Edge } from "@xyflow/react";
import { atom } from "jotai";
import dagre from "@dagrejs/dagre";

export type CustomNodeType = Node<
  { title: string; collapsed: boolean; type: string; content: string },
  "childNode" | "rootNode"
>;

const position = { x: 0, y: 0 };

const nodeWidth = 100;
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
    id: "0",
    type: "rootNode",
    data: {
      title: "背景",
      collapsed: false,
      type: "content",
      content:
        "古代武侠背景下，主角是一个年轻的剑客，他有着不屈不挠的精神和坚定的信念。",
    },
    position,
    hidden: false,
  },
  {
    id: "1",
    type: "childNode",
    data: {
      title: "第一章",
      collapsed: false,
      type: "content",
      content: "第一章讲述了主角的剑术修炼和江湖历险。",
    },
    position,
    hidden: false,
  },
  {
    id: "2a",
    type: "childNode",
    data: {
      title: "第二章",
      collapsed: false,
      type: "content",
      content: "第二章讲述了主角的剑术修炼和江湖历险。",
    },
    position,
    hidden: false,
  },
  {
    id: "2b",
    type: "childNode",
    data: {
      title: "第二章",
      collapsed: false,
      type: "content",
      content: "第二章讲述了主角的剑术修炼和江湖历险。",
    },
    position,
    hidden: false,
  },
  {
    id: "3a",
    type: "childNode",
    data: {
      title: "第三章",
      collapsed: false,
      type: "content",
      content: "第三章讲述了主角的剑术修炼和江湖历险。",
    },
    position,
    hidden: false,
  },
  {
    id: "3b",
    type: "childNode",
    data: {
      title: "第三章",
      collapsed: false,
      type: "content",
      content: "第三章讲述了主角的剑术修炼和江湖历险。",
    },
    position,
    hidden: false,
  },
];

const initialEdges: Edge[] = [
  {
    id: "e01",
    source: "0",
    target: "1",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e12a",
    source: "1",
    target: "2a",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e12b",
    source: "1",
    target: "2b",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e2a3a",
    source: "2a",
    target: "3a",
    sourceHandle: "output",
    targetHandle: "input",
    animated: true,
  },
  {
    id: "e2a3b",
    source: "2a",
    target: "3b",
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
