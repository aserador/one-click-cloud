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
  SERVICES,
  SERVICES_CONNECTIONS,
} from "../../templates/services.js";
import "reactflow/dist/style.css";

// This is dangerous, but it's a quick fix for now
const initialNodes = SERVICES.map((service, index) => {

  // Hack offset to make the graph look better
  const offsetX = 300 * (index + 1);
  const offsetY = 100 * (index + 1);

  return {
    id: index.toString(),
    position: { x: offsetX, y: offsetY },
    data: { label: service.name, ...service },
  };
});

const Graph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    SERVICES_CONNECTIONS
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
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
        onNodeClick={(event: any, node: any) => {

          store.dispatch(setIsOpen({ isOpen: true }));
          store.dispatch(setFocusedNode({ focusedNode: node.data }));
        }}
      >
        <Controls className="absolute top-0 left-8" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Graph;
