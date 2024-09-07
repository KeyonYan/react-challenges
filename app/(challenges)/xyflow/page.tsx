'use client'
import React, { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ChildNode from './ChildNode';
import RootNode from './RootNode';
import { edgesAtom, getLayoutedElements, nodesAtom } from './nodes-edges';
import { useAtom } from 'jotai';

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const nodeTypes = useMemo(() => ({
    rootNode: RootNode,
    childNode: ChildNode,
  }), [])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes) => {
        console.log("changes", changes)
        setNodes(applyNodeChanges(changes, nodes))
      }}
      onEdgesChange={(changes) => {
        setEdges(applyEdgeChanges(changes, edges))
      }}
      fitView
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
