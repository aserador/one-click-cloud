import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  ConnectionMode,
  SelectionMode,
  StepEdge,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { IGraphDragData, IGraphNode, IGraphNodeData, NodeType } from '@/redux/designer/models';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addGraphNode, getFocusedNodeId, removeFocusedNodeId, removeGraphNode, setFocusedNodeId } from '@/redux/designer/slice/graphSlice';
import { IconNode } from './Node';

import 'reactflow/dist/style.css';


interface IGraphProps {
  initialServices: any;
  initialEdges: any;
}

function Graph(props: IGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Reactflow hooks
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Redux hooks
  const dispatch = useAppDispatch();
  
  const focusedNodeId = useAppSelector(getFocusedNodeId);

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

    let dragData: IGraphDragData | undefined;

    try {
      dragData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    } catch (e) {
      // Unknown service, ignore
      return;
    }

    if (!dragData) {
      return;
    }

    // Hack to place the service close to where it was dropped
    const position = reactFlowInstance?.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: IGraphNode = {
      id: uuidv4(),
      type: dragData.type,
      position,
      data: { 
        label: dragData.service, 
        category: dragData.category,
        service: dragData.service,
      } as IGraphNodeData,
    }

    dispatch(
      addGraphNode({
        nodeId: newNode.id,
        category: newNode.data.category,
        service: newNode.data.service,
      })
    );

    if (!focusedNodeId && newNode.type === NodeType.ICON) {
      dispatch(setFocusedNodeId(newNode.id));
    }

    setNodes([...nodes, newNode]);
  };

  const onNodesDelete = (deleted: Array<any>) => {
    if (focusedNodeId) {
      deleted.find((node) => {
        if (node.id === focusedNodeId) {
          dispatch(removeFocusedNodeId());
        }
      });
    }
    for (const node of deleted) {
      dispatch(removeGraphNode(node.id));
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
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{type: 'step', animated: true}}
            connectionMode={ConnectionMode.Loose}
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
