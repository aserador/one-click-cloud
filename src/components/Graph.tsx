import {
  setIsOpen,
  setFocusedNode,
  getAwsServices,
  getAwsServicesFilter
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

interface GraphProps {
  filter: number[];
}

const Graph = (props: GraphProps) => {

  const { filter } = props;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const awsServices = useSelector(getAwsServices);

  useEffect(() => {
    setNodes(
      awsServices
        .filter((service) => !service.disabled && service.id in filter)
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
  }, [filter]);

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
          const target = awsServices.find((s) => s.id === parseInt(node.id));
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
