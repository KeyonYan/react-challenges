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
  type NodeMouseHandler,
  type Edge,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ChildNode from './ChildNode';
import RootNode from './RootNode';
import { type CustomNodeType, edgesAtom, layoutedEdges, layoutedNodes, nodesAtom } from './nodes-edges';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { Button } from '../aichat/ui/button';
import { SaveIcon } from 'lucide-react';
import './index.css'

let isGetData = false

const LayoutFlow = () => {
  const router = useRouter()
  const { fitView, getNodes } = useReactFlow();
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const nodeTypes = useMemo(() => ({
    rootNode: RootNode,
    childNode: ChildNode,
  }), [])
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (e, node) => {
      const isSvg = e.target instanceof SVGElement;
      if (isSvg) {
        return
      }
      fitView({ nodes: [node], duration: 500 })
      setTimeout(() => {
        router.push(`/novel-web/aichat?nodeid=${node.id}`)
      }, 550)
    },
    [fitView]
  )
  const getDefaultData = () => {
    return new Promise<{ nodes: CustomNodeType[], edges: Edge[] }>((resolve, reject) => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroid = /android/.test(userAgent);

      if (isAndroid) {
        try {
          const result = ((window as any).Android as Android).getnovelContent();
          // eslint-disable-next-line no-extra-boolean-cast
          if (!!result) {
            const fetchData = JSON.parse(result);
            resolve(fetchData);
          } else {
            resolve({
              nodes: layoutedNodes,
              edges: layoutedEdges,
            });
          }
        } catch (error) {
          reject(error);
        }
      } else {
        resolve({
          nodes: layoutedNodes,
          edges: layoutedEdges,
        });
      }
    });
  };

  const submitNovel = () => {
    (window as any).AndroidSubmit.submitButton((window as any).getTreeInfo().message)
  }

  useEffect(() => {
    console.log('get data')
    if (isGetData) return
    getDefaultData()
      .then(data => {
        setNodes(data.nodes)
        setEdges(data.edges)
        isGetData = true
      })
      .catch(error => {
        console.error('Error fetching novel data:', error);
      });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      onNodesDelete={() => {
        setTimeout(() => {
          fitView({ nodes: nodes, duration: 800 })
        }, 50)
      }}
      onNodesChange={(changes) => {
        setNodes(applyNodeChanges(changes, nodes))
        setTimeout(() => {
          const viewNodes = nodes.slice(-5);
          fitView({ nodes: viewNodes, duration: 800 })
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
      <Panel position='bottom-left'>
        <Button variant='outline' className='bg-[#FBFBFC] gap-2 text-xl h-[4rem] w-[8rem]'>
          <SaveIcon />
          提交
        </Button>
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
