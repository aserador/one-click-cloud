import {
  setIsOpen,
  setFocusedNode,
  getAwsServices,
} from "@/redux/persistentDrawerRightSlice";
import { store } from "@/redux/store";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { AWS_SERVICES_CONNECTIONS } from "../../templates/aws_services.js";
import "reactflow/dist/style.css";
import { useSelector } from "react-redux";

const Graph = () => {
  const awServices = useSelector(getAwsServices);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const ss = useEffect(() => {
    setNodes(
      awServices
        .filter((service) => !service.disabled)
        .map((s, index) => {
          // Hack offset to make the graph look better
          const offsetX = 300 * (index + 1);
          const offsetY = 100 * (index + 1);

          return {
            id: index.toString(),
            position: { x: offsetX, y: offsetY },
            data: { label: s.name, ...s },
          };
        })
    );

    // TODO: read from redux store
    setEdges(AWS_SERVICES_CONNECTIONS);
  }, []);

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
        <Controls className="absolute top-0 left-8" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Graph;
