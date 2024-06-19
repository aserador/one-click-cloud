import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IGraphEdge, IService } from "../models";
import { IAddGraphNode, INodeId } from "../payload";
import AWS_SCHEMA_TEMPLATES from "@/schema/aws/schema";

export type GraphState = {
  focused: Record<string, IService> | null;
  graphNodes: Record<string, IService>;
  graphEdges: Record<string, IGraphEdge>;
};

export const graphSlice = createSlice({
  name: "graph",
  initialState: {
    focused: null as Record<string, IService> | null,
    graphNodes: {} as Record<string, IService>,
    graphEdges: {} as Record<string, IGraphEdge>
  } as GraphState,
  reducers: {
    setFocused: (state: GraphState, action: PayloadAction<INodeId>) => {
      state.focused = { nodeId: state.graphNodes[action.payload.nodeId] };
    },
    removeFocused: (state: GraphState) => {
      state.focused = null;
    },
    addGraphNode: (state: GraphState, action: PayloadAction<IAddGraphNode>) => {
      state.graphNodes[action.payload.nodeId] = AWS_SCHEMA_TEMPLATES[action.payload.category][action.payload.service];
    },
    updateGraphNode: (state: GraphState, action: PayloadAction<{nodeId: string, schema: IService}>) => {
      state.graphNodes[action.payload.nodeId] = action.payload.schema;
    },
    removeGraphNode: (state: GraphState, action: PayloadAction<INodeId>) => {
      delete state.graphNodes[action.payload.nodeId];
    },
    addGraphEdge: (state: GraphState, action: PayloadAction<IGraphEdge>) => {
      state.graphEdges[action.payload.id] = action.payload;
    },
    removeGraphEdge: (state: GraphState, action: PayloadAction<{edgeId: string}>) => {
      delete state.graphEdges[action.payload.edgeId];
    },
  },
  extraReducers: () => {},
});

export const { 
  setFocused,
  removeFocused, 
  addGraphNode, 
  updateGraphNode, 
  removeGraphNode, 
  addGraphEdge, 
  removeGraphEdge
 } = graphSlice.actions;

export const getFocused = (state: RootState) => state.graph.focused;
export const getGraphNodes = (state: RootState) => state.graph.graphNodes;
export const getGraphEdges = (state: RootState) => state.graph.graphEdges;

export const graphReducer = graphSlice.reducer;
