import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IGraphEdge, IService, IServicePair } from '../models';
import { IAddGraphNode, IUpdateGraphNode } from '../payload';
import AWS_SCHEMAS from '@/schema/aws/schema';
import _ from 'lodash';

export type GraphState = {
  focusedNodeId: string | null;
  graphNodes: Record<string, IService>;
  graphEdges: Record<string, IGraphEdge>;
};

export const graphSlice = createSlice({
  name: 'graph',
  initialState: {
    focusedNodeId: null as string | null,
    graphNodes: {} as Record<string, IService>,
    graphEdges: {} as Record<string, IGraphEdge>,
  } as GraphState,
  reducers: {
    setFocusedNodeId: (state: GraphState, action: PayloadAction<string>) => {
      if (!state.graphNodes[action.payload]) {
        console.warn('[setFocusedNodeId] Not found', action.payload);
        return;
      }
      state.focusedNodeId = action.payload;
    },
    removeFocusedNodeId: (state: GraphState) => {
      state.focusedNodeId = null;
    },
    addGraphNode: (state: GraphState, action: PayloadAction<IAddGraphNode>) => {
      const template = _.cloneDeep(
        AWS_SCHEMAS?.[action.payload.category]?.[action.payload.service]
      );
      delete template.onConnect;
      delete template.onDisconnect;
      delete template.onChange;
      if (!template) {
        console.warn('[addGraphNode] Not found', action.payload);
      }
      state.graphNodes[action.payload.nodeId] = template;
    },
    updateGraphNode: (
      state: GraphState,
      action: PayloadAction<IUpdateGraphNode>
    ) => {
      if (!state.graphNodes[action.payload.nodeId]) {
        console.warn('[updateGraphNode] Not found', action.payload.nodeId);
        return;
      }
      const sourceId: string = action.payload.nodeId;
      state.graphNodes[sourceId] = action.payload.updatedSchema;

      state.graphNodes[sourceId].neighbors.forEach((neighborId) => {
        const sourceCategory: string | undefined =
          state.graphNodes[sourceId]?.category;
        const sourceService: string | undefined =
          state.graphNodes[sourceId]?.id;

        const result: IServicePair =
          AWS_SCHEMAS[sourceCategory]?.[sourceService]?.onChange?.(
            action.payload.updatedSchema,
            _.cloneDeep(state.graphNodes[neighborId])
          ) ?? ({} as IServicePair);
        
          console.log(result)
        if (result.source) {
          state.graphNodes[sourceId] = result.source;
        }

        if (result.target) {
          state.graphNodes[neighborId] = result.target;
        }
      });
    },
    removeGraphNode: (state: GraphState, action: PayloadAction<string>) => {
      delete state.graphNodes[action.payload];
    },
    addGraphEdge: (state: GraphState, action: PayloadAction<IGraphEdge>) => {
      const sourceId = action.payload.source;
      const targetId = action.payload.target;
      state.graphEdges[`${sourceId}-${targetId}`] = action.payload;
      state.graphNodes[sourceId].neighbors = [
        ...state.graphNodes[sourceId].neighbors,
        targetId,
      ];

      const sourceCategory: string | undefined =
        state.graphNodes[sourceId]?.category;
      const sourceService: string | undefined = state.graphNodes[sourceId]?.id;

      const result: IServicePair =
        AWS_SCHEMAS[sourceCategory]?.[sourceService]?.onConnect?.(
          _.cloneDeep(state.graphNodes[sourceId]),
          _.cloneDeep(state.graphNodes[targetId])
        ) ?? ({} as IServicePair);

      if (result.source) {
        state.graphNodes[sourceId] = result.source;
      }

      if (result.target) {
        state.graphNodes[targetId] = result.target;
      }
    },
    removeGraphEdge: (state: GraphState, action: PayloadAction<IGraphEdge>) => {
      const sourceId = action.payload.source;
      const targetId = action.payload.target;
      delete state.graphEdges[
        `${action.payload.source}-${action.payload.target}`
      ];
      state.graphNodes[sourceId].neighbors = [
        ...state.graphNodes[sourceId].neighbors,
      ].filter((neighbor) => neighbor !== targetId);

      const sourceCategory: string | undefined =
        state.graphNodes[sourceId]?.category;
      const sourceService: string | undefined = state.graphNodes[sourceId]?.id;

      const result: IServicePair =
        AWS_SCHEMAS[sourceCategory]?.[sourceService]?.onDisconnect?.(
          _.cloneDeep(state.graphNodes[sourceId]),
          _.cloneDeep(state.graphNodes[targetId])
        ) ?? ({} as IServicePair);

      if (result.source) {
        state.graphNodes[sourceId] = result.source;
      }

      if (result.target) {
        state.graphNodes[targetId] = result.target;
      }
    },
    reset: () => {
      return { focusedNodeId: null, graphNodes: {}, graphEdges: {} };
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
  removeGraphEdge,
  reset,
} = graphSlice.actions;

export const getFocusedNodeId = (state: RootState) => state.graph.focusedNodeId;
export const getFocusedSchema = (state: RootState) =>
  state.graph.focusedNodeId &&
  state.graph.graphNodes[state.graph.focusedNodeId];
export const getGraph = (state: RootState) => state.graph;

export const graphReducer = graphSlice.reducer;
