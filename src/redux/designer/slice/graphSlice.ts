import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IGraphEdge, IService } from "../models";
import { IAddGraphNode, IUpdateGraphNode } from "../payload";
import AWS_SCHEMA_TEMPLATES from "@/schema/aws/schema";
import _ from "lodash";

export type GraphState = {
  focusedNodeId: string | null;
  graphNodes: Record<string, IService>;
  graphEdges: Record<string, IGraphEdge>;
};

export const graphSlice = createSlice({
  name: "graph",
  initialState: {
    focusedNodeId: null as string | null,
    graphNodes: {} as Record<string, IService>,
    graphEdges: {} as Record<string, IGraphEdge>
  } as GraphState,
  reducers: {
    setFocusedNodeId: (state: GraphState, action: PayloadAction<string>) => {
      if (!state.graphNodes[action.payload]) {
        console.warn("[setFocusedNodeId] Not found", action.payload);
        return;
      }
      state.focusedNodeId =  action.payload;
    },
    removeFocusedNodeId: (state: GraphState) => {
      state.focusedNodeId = null;
    },
    addGraphNode: (state: GraphState, action: PayloadAction<IAddGraphNode>) => {
      const template = AWS_SCHEMA_TEMPLATES?.[action.payload.category]?.[action.payload.service];
      if (!template) {
        console.warn("[addGraphNode] Not found", action.payload);
      }
      state.graphNodes[action.payload.nodeId] = template;
    },
    updateGraphNode: (state: GraphState, action: PayloadAction<IUpdateGraphNode>) => {
      if (!state.graphNodes[action.payload.nodeId]) {
        console.warn("[updateGraphNode] Not found", action.payload.nodeId);
        return;
      }
      state.graphNodes[action.payload.nodeId] = action.payload.updatedSchema;
    },
    removeGraphNode: (state: GraphState, action: PayloadAction<string>) => {
      delete state.graphNodes[action.payload];
    },
    addGraphEdge: (state: GraphState, action: PayloadAction<IGraphEdge>) => {
      state.graphEdges[action.payload.id] = action.payload;
    },
    removeGraphEdge: (state: GraphState, action: PayloadAction<string>) => {
      delete state.graphEdges[action.payload];
    },
  },
  extraReducers: () => {},
});

export const { 
  setFocusedNodeId,
  removeFocusedNodeId, 
  addGraphNode, 
  updateGraphNode,
  removeGraphNode, 
  addGraphEdge, 
  removeGraphEdge
 } = graphSlice.actions;

export const getFocusedNodeId = (state: RootState) => state.graph.focusedNodeId;
export const getFocusedSchema = (state: RootState) => state.graph.focusedNodeId && state.graph.graphNodes[state.graph.focusedNodeId];
export const getGraphNodes = (state: RootState) => state.graph.graphNodes;
export const getGraphEdges = (state: RootState) => state.graph.graphEdges;

export const graphReducer = graphSlice.reducer;
