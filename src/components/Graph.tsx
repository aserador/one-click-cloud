import {
  setIsOpen,
  setFocusedNode,
  getGraphServices,
  getGraphEdges,
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
import { useSelector } from "react-redux";
import { AWS_SERVICES_CONNECTIONS } from "../../templates/aws_services.js";

import "reactflow/dist/style.css";

const Graph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const graphServices = useSelector(getGraphServices);
  const graphEdges = useSelector(getGraphEdges);

  useEffect(() => {
    setNodes(
      graphServices.map((s, index) => {
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
    setEdges(graphEdges);
  }, [graphServices]);

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

          // TODO: Fix unsafe search
          const target = graphServices.find((s) => s.id === parseInt(node.id));
          store.dispatch(setFocusedNode({ focusedNode: target }));
        }}
      >
        <Controls className="absolute top-0 left-8" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Graph;
