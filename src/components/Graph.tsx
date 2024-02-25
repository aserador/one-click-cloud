import {
  setIsOpen,
  setFocusedNode,
  getGraphServices,
  getGraphEdges,
  getAwsServices,
  setGraphServices,
} from "@/redux/persistentDrawerRightSlice";
import { store } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import "reactflow/dist/style.css";

const Sidebar = () => {
  const awsServices = useSelector(getAwsServices);

  const onDragStart = (event: any, service: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(service)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="relative text-white" style={{ width: "20%" }}>
      {awsServices.filter(s => !s.disabled).map((service, i) => {
        return (
          <div>
            <div
              className="dndnode"
              onDragStart={(event) => onDragStart(event, service)}
              draggable
            >
              <Typography>{service.name}</Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface IGraphProps {
  initialServices: any;
  initialEdges: any;
}

const Graph = (props: IGraphProps) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const graphServices = useSelector(getGraphServices);
  const graphEdges = useSelector(getGraphEdges);

  const { initialEdges, initialServices } = props;

  useEffect(() => {
    if (initialServices !== undefined && initialServices !== null) {
      setNodes(
        initialServices.map((s: any, index: any) => {
          // Hack offset to make the graph look better
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

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = (event: any) => {
    event.preventDefault();

    const data = event.dataTransfer.getData("application/reactflow");
    const service = JSON.parse(data);

    const position = reactFlowInstance?.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const randomId = uuidv4();
    store.dispatch(
      setGraphServices({
        graphServices: graphServices.concat({ ...service, id: randomId }),
      })
    );
    setNodes(
      nodes.concat({
        id: randomId,
        position,
        data: { label: service.name, ...service },
      })
    );
  };

  return (
    <div className="dndflow flex flex-row">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
          style={{ width: "80%", height: "100vh" }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={(event: any, node: any) => {
              store.dispatch(setIsOpen({ isOpen: true }));
              const target = graphServices.find(
                (s) => String(s.id) === String(node.id)
              );
              if (!target) {
                alert("Error: Could not find service to focus");
                return;
              }
              store.dispatch(setFocusedNode({ focusedNode: target }));
            }}
            fitView
          >
            <Controls className="absolute top-0 left-8" />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default Graph;
