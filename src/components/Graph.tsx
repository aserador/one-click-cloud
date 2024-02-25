import {
  setIsOpen,
  setFocusedNode,
  getGraphServices,
  getAwsServices,
  setGraphServices,
  setGraphEdges,
} from "@/redux/persistentDrawerRightSlice";
import { store } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { useSelector } from "react-redux";
import { Button, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import "reactflow/dist/style.css";

// Draggable sidebar for adding aws services to the graph
const Sidebar = () => {
  const awsServices = useSelector(getAwsServices);

  // Dragging a service from the sidebar to the graph
  const onDragStart = (event: any, service: any) => {
    // Hack to attach service data to drag event
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(service)
    );

    // Mystery requirement required for by reactflow for drag and drop to work
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    // TODO: Style the sidebar
    <div className="absolute text-white flex flex-col justify-end" style={{ width: "500px", height: "200px", left: "50%", top: "75%", transform: "translateX(-50%)" }}>
      {awsServices
        .filter((s) => !s.disabled)
        .map((service, i) => {
          return (
            // TODO: Style the sidebar's draggable elements
            <div
              className="dndnode"
              onDragStart={(event) => onDragStart(event, service)}
              draggable
            >
              <Button
                variant="contained"
                className="w-full"
                style={{ backgroundColor: "#3F3F3F", marginBottom: "10px", color: "white"}}
              >
                <Typography>{service.name}</Typography>
              </Button>
            </div>
          );
        })}
    </div>
  );
};

interface IGraphProps {
  // Initial diagram nodes and edges FOR RENDERING PURPOSES ONLY
  initialServices: any;

  // Initial diagram edges and edges FOR RENDERING PURPOSES ONLY
  initialEdges: any;
}

const Graph = (props: IGraphProps) => {
  // Local state for diagram nodes and edges FOR RENDERING PURPOSES ONLY
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Hooks for draggables and droppables
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Redux state for diagram nodes and edges FOR BACKEND SUBMISSIONS ONLY
  const graphServices = useSelector(getGraphServices);

  const { initialEdges, initialServices } = props;

  // Initialize diagram nodes and edges FOR RENDERING PURPOSES ONLY
  useEffect(() => {
    if (initialServices !== undefined && initialServices !== null) {
      // Initialize diagram nodes FOR RENDERING PURPOSES ONLY; REDUX STATE FOR BACKEND SUBMISSION INITIALZED IN DiagramPage
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

    // Initialize diagram edges FOR RENDERING PURPOSES ONLY; REDUX STATE FOR BACKEND SUBMISSION INITIALZED IN DiagramPage
    if (initialEdges !== undefined && initialEdges !== null) {
      setEdges(initialEdges);
    }
  }, [initialServices]);

  // Move all local changes for edges to redux store FOR BACKEND SUBMISSIONS ONLY
  useEffect(() => {
    store.dispatch(setGraphEdges({ graphEdges: edges }));
  }, [edges]);

  // Required by reactflow to update edges, check documentation for more info
  const onConnect = (params: any) => {
    setEdges((eds: any) => addEdge(params, eds));
  };

  // Triggered when a service is dragged from the sidebar to the graph
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Triggered when a service is dropped from the sidebar to the graph
  const onDrop = (event: any) => {
    event.preventDefault();

    // Hack to retrieve service data from drag event
    const data = event.dataTransfer.getData("application/reactflow");
    const service = JSON.parse(data);

    // Hack to place the service close to where it was dropped
    const position = reactFlowInstance?.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const randomId = uuidv4();

    // Update redux state with diagram nodes FOR BACKEND SUBMISSIONS ONLY
    store.dispatch(
      setGraphServices({
        graphServices: graphServices.concat({ ...service, id: randomId }),
      })
    );

    // Update local state with diagram nodes FOR RENDERING PURPOSES ONLY
    setNodes(
      nodes.concat({
        id: randomId,
        position,
        data: { label: service.name, ...service },
      })
    );
  };

  const onNodesDelete = (deleted: any) => {
    // Repair tree structure from deleted nodes and edges FOR RENDERING PURPOSES ONLY
    setEdges(
      deleted.reduce((acc: any, node: any) => {
        const incomers = getIncomers(node, nodes, edges);
        const outgoers = getOutgoers(node, nodes, edges);
        const connectedEdges = getConnectedEdges([node], edges);

        const remainingEdges = acc.filter(
          (edge: any) => !connectedEdges.includes(edge)
        );

        const createdEdges = incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => ({
            id: `${source}->${target}`,
            source,
            target,
            markerEnd: { type: "arrow" },
            style: { strokeWidth: 2 },
          }))
        );

        return [...remainingEdges, ...createdEdges];
      }, edges)
    );

    // Update redux state with diagram nodes FOR BACKEND SUBMISSIONS ONLY, edges are updated in useEffect
    deleted
      .map((d: any) => String(d.id))
      .forEach((did: any) => {
        store.dispatch(
          setGraphServices({
            graphServices: graphServices.filter((s) => did !== String(s.id)),
          })
        );
      });

    // Reset focused node and close panel
    store.dispatch(setFocusedNode({ focusedNode: null }));
    store.dispatch(setIsOpen({ isOpen: false }));
  };

  return (
    // TODO: Style the graph
    <div className="dndflow flex flex-row">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
          style={{ width: "100%", height: "100vh" }}
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
              // Open panel
              store.dispatch(setIsOpen({ isOpen: true }));

              // Find the service in the redux state and focus on it
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
            {/* TODO: Style location of graph controls */}
            <Controls className="absolute left-8" style={{bottom: "50%"}}/>

            {/* TODO: Style background of graph (see reactflow) */}
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default Graph;
