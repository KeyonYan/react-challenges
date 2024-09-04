export const initialNodes = [
  {
    id: "1",
    type: "startNode",
    data: { title: "背景" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "optionNode",
    data: { title: "角色" },
    position: { x: 0, y: 100 },
  },
  {
    id: "2a",
    type: "textNode",
    data: { title: "角色1" },
    position: { x: 0, y: 200 },
  },
  {
    id: "2b",
    type: "textNode",
    data: { title: "node 2b" },
    position: { x: 0, y: 300 },
  },
  {
    id: "2c",
    type: "optionNode",
    data: { title: "node 2c" },
    position: { x: 0, y: 400 },
  },
  {
    id: "2d",
    type: "endNode",
    data: { title: "node 2d" },
    position: { x: 0, y: 500 },
  },
  {
    id: "3",
    type: "textNode",
    data: { title: "node 3" },
    position: { x: 200, y: 100 },
  },
];
export const initialEdges = [
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