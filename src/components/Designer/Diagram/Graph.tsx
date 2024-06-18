import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

interface IGraphProps {
  initialServices: any;
  initialEdges: any;
}

function Graph(props: IGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Hooks for draggables and droppables
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const { initialEdges, initialServices } = props;

  useEffect(() => {
    if (initialServices !== undefined && initialServices !== null) {
      setNodes(
        initialServices.map((s: any, index: any) => {
          // Hack offset to make the graph look better, in case position is not provided
          const offsetX = 120 * (index + 1);
          const offsetY = 80 * (index + 1);

          return {
            id: String(s.id),
            position: s?.position ?? { x: offsetX, y: offsetY },
            data: { label: s.name, ...s },
          };
        })
      );
    }

    if (initialEdges !== undefined && initialEdges !== null) {
      setEdges(initialEdges);
    }
  }, [initialServices]);

  // Required by reactflow to update edges, check documentation for more info
  const onConnect = (params: any) => {
    setEdges((eds: any) => addEdge(params, eds));
  };

  // Triggered when a service is dragged from the sidebar to the graph
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Triggered when a service is dropped from the sidebar to the graph
  const onDrop = (event: any) => {
    event.preventDefault();

    try {
      // Hack to retrieve service data from drag event
      const data = event.dataTransfer.getData('application/reactflow');
      const service = JSON.parse(data);
    } catch (e) {
      // Unknown service, ignore
      return;
    }

    // Hack to place the service close to where it was dropped
    const position = reactFlowInstance?.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    setNodes(
      nodes.concat({
        id: '123',
        position,
        data: { label: service.name, ...service },
      })
    );
  };

  const onNodesDelete = (deleted: any) => {
    console.log('Deleted nodes', deleted);
  };

  return (
    // TODO: Style the graph
    <div className='dndflow flex flex-row h-full w-full'>
        <div
          className='reactflow-wrapper h-full w-full'
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onNodesDelete={onNodesDelete}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={(event: any, node: any) => {
              console.log('Clicked node', node);
            }}
            fitView
          >
            <Controls className='absolute left-8' style={{ bottom: '50%' }} />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
    </div>
  );
}

export default Graph;
