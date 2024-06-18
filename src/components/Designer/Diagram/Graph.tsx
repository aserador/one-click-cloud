import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  SelectionMode,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import { IconNode } from './Node';

import 'reactflow/dist/style.css';
import { store } from '@/redux/store';
import { getSchema, setFocus } from '@/redux/focusSlice';
import { ISchema } from '@/redux/models';
import { useSelector } from 'react-redux';


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

  const focused = useSelector(getSchema);

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

  // Triggered when a ANYTHING is dropped into the graph
  const onDrop = (event: any) => {

    event.preventDefault();

    let data = undefined;

    try {
      data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    } catch (e) {
      // Unknown service, ignore
      return;
    }

    // Hack to place the service close to where it was dropped
    const position = reactFlowInstance?.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: uuidv4(),
      type: data.metadata.type === 'icon' ? 'iconNode' : 'textNode',
      position,
      data: { label: data.id, ...data },
    }

    if (!focused && data.metadata.type === 'icon') {
      store.dispatch(
        setFocus(
          {
            id: data.metadata.service,
            continuous_deployment: data.continuous_deployment,
            cost: data.cost,
            enabled: data.enabled,
            schema: data.schema,
          } as ISchema
        )
      );
    }

    setNodes([...nodes, newNode]);
  };

  const onNodesDelete = (deleted: Array<any>) => {
    if (focused) {
      deleted.find((node) => {
        if (node.data.metadata.service === focused?.id) {
          store.dispatch(setFocus(null));
        }
      });
    }
  };

  const nodeTypes = useMemo(() => ({ iconNode: IconNode }), []);
  
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
            nodeTypes={nodeTypes}
            fitView
            panOnScroll
            selectionOnDrag
            panOnDrag={[1, 2]}
            selectionMode={SelectionMode.Partial}
            style={{backgroundColor: '#1e1e1e'}}
          >
          </ReactFlow>
        </div>
    </div>
  );
}

export default Graph;
