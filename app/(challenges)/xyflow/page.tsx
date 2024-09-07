'use client'
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useReactFlow,
  Background,
  BackgroundVariant,
  type NodeProps,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ChildNode from './ChildNode';
import RootNode from './RootNode';
import dagre from "@dagrejs/dagre";
import { useNodesEdges } from './nodes-edges';
import type { CustomNodeType, CustomEdgeType } from './nodes-edges';
import { Button } from '@/components/ui/button';

const nodeWidth = 80;
const nodeHeight = 36;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutedElements = (nodes: CustomNodeType[], edges: CustomEdgeType[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  console.log('nodes', nodes)
  for (const node of nodes) {
    const { width, height } = node.measured ?? { width: nodeWidth, height: nodeHeight };
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
  return { nodes: newNodes, edges };
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } = useNodesEdges();
  // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB');
  const nodeTypes = useMemo(() => ({
    rootNode: RootNode,
    childNode: ChildNode,
  }), [])

  const onLayout = useCallback(
    (direction: string) => {
      const layouted = getLayoutedElements(nodes, edges, direction);

      setNodes([...layouted.nodes] as CustomNodeType[]);
      setEdges([...layouted.edges] as CustomEdgeType[]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges, setNodes, setEdges, fitView]
  );

  window.requestAnimationFrame(() => {
    fitView();
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodeTypes={nodeTypes}
    >
      <Background bgColor='#F0F2F6' color='#E4E5E7' variant={BackgroundVariant.Dots} size={3} />
      <Panel position="top-left" className='flex flex-col gap-2'>
        <Button onClick={() => onLayout('TB')}>vertical layout</Button>
        <Button onClick={() => onLayout('LR')}>horizontal layout</Button>
      </Panel>
    </ReactFlow>
  );
};

export default function XyFlowPage() {
  return (
    <div className='w-[100vw] h-[100vh]'>
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    </div>
  );
}
