'use client'
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  NodeMouseHandler,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ChildNode from './ChildNode';
import RootNode from './RootNode';
import { edgesAtom, getLayoutedElements, nodesAtom } from './nodes-edges';
import { useAtom } from 'jotai';

const LayoutFlow = () => {
  const { getNodes, fitView } = useReactFlow();
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const nodeTypes = useMemo(() => ({
    rootNode: RootNode,
    childNode: ChildNode,
  }), [])
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (e, node) => {
      console.log("e", e)
      const isSvg = e.target instanceof SVGElement;
      if (isSvg) {
        console.log("isSvg", isSvg)
        return
      }
      fitView({ nodes: [node], duration: 800 })
    },
    [fitView]
  )
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      onNodesChange={(changes) => {
        console.log("changes", changes)
        setNodes(applyNodeChanges(changes, nodes))
        setTimeout(() => {
          fitView({ nodes: nodes, duration: 800 })
        }, 50)
      }}
      onEdgesChange={(changes) => {
        setEdges(applyEdgeChanges(changes, edges))
      }}
      fitView
      fitViewOptions={{
        duration: 1000,
        nodes: nodes,
      }}
      nodeTypes={nodeTypes}
    >
      <Background bgColor='#F0F2F6' color='#E4E5E7' variant={BackgroundVariant.Dots} size={3} />

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
