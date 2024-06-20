import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Connection,
  ConnectionMode,
  Edge,
  ReactFlowInstance,
  SelectionMode,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import {
  IGraphDragData,
  IGraphNode,
  IGraphNodeData,
  NodeType,
} from '@/redux/designer/models';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addGraphEdge,
  addGraphNode,
  getFocusedNodeId,
  removeFocusedNodeId,
  removeGraphEdge,
  removeGraphNode,
  setFocusedNodeId,
} from '@/redux/designer/slice/graphSlice';
import { IconNode } from './Node';

import 'reactflow/dist/style.css';

interface IGraphProps {
  initialNodes: Array<IGraphNode>;
  initialEdges: any;
}

function Graph({ initialNodes, initialEdges }: IGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Reactflow hooks
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Redux hooks
  const dispatch = useAppDispatch();
  const focusedNodeId = useAppSelector(getFocusedNodeId);

  //
  // DOM Event Handlers
  //

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = (event: any) => {
    event.preventDefault();

    let dragData: IGraphDragData | undefined;

    try {
      dragData = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );
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

    if (!position) {
      return;
    }

    const newNode: IGraphNode = {
      id: uuidv4(),
      type: dragData.type,
      position,
      data: {
        label: dragData.service,
        category: dragData.category,
        service: dragData.service,
      } as IGraphNodeData,
    };

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

  //
  // Reactflow: Node Event Callbacks
  //

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

  //
  // Reactflow: Edge Event Callbacks
  //

  const onConnect = (connection: Connection) => {
    setEdges((eds: any) => addEdge(connection, eds));
    dispatch(
      addGraphEdge({
        source: connection.source as string,
        target: connection.target as string,
      })
    );
  };

  const onEdgesDelete = (deleted: Edge[]) => {
    for (const edge of deleted) {
      dispatch(
        removeGraphEdge({
          source: edge.source as string,
          target: edge.target as string,
        })
      );
    }
  };

  const nodeTypes = useMemo(() => ({ iconNode: IconNode }), []);

  return (
    <div className="dndflow flex flex-row h-full w-full">
      <div className="reactflow-wrapper h-full w-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ type: 'step', animated: true }}
          connectionMode={ConnectionMode.Loose}
          fitView
          panOnScroll
          selectionOnDrag
          panOnDrag={[1, 2]}
          selectionMode={SelectionMode.Partial}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{ backgroundColor: '#1e1e1e' }}
        />
      </div>
    </div>
  );
}

export default Graph;
