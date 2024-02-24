import { setIsOpen, setFocusedNode } from "@/redux/persistentDrawerRightSlice";
import { store } from "@/redux/store";
import { useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import {
  AWS_SERVICES,
  AWS_SERVICES_CONNECTIONS,
} from "../../templates/aws_services.js";
import "reactflow/dist/style.css";

// This is dangerous, but it's a quick fix for now
const initialNodes = AWS_SERVICES.map((service, index) => {
  const offset = 100 * index;
  return {
    id: index.toString(),
    position: { x: offset, y: offset },
    data: { label: service.name, ...service },
  };
});

const Graph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    AWS_SERVICES_CONNECTIONS
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(event, node) => {
          store.dispatch(setIsOpen({ isOpen: true }));
          store.dispatch(setFocusedNode({ focusedNode: node.data }));
        }}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Graph;
