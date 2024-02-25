import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  IPersistentDrawerFocusedNode,
  IPersistentDrawerIsOpen,
  IPersistentDrawerSetAwsServiceProperty,
  IPersistentDrawerSetAwsServices,
  IPersistentDrawerSetDrawerMode,
  IPersistentDrawerSetGraphEdges,
  IPersistentDrawerSetGraphServices,
} from "./payload";
import _ from "lodash";
import { IGraphEdge } from "./models";

export type PersistentDrawerRightState = {
  isOpen: boolean;
  focusedNode: any;
  AWSServices: Array<any>;
  AWSServiceFilter: number[];
  drawerMode: "Service Details" | "Add Service";
  graphServices: Array<any>;
  graphEdges: IGraphEdge[];
};

export const persistentDrawerRightSlice = createSlice({
  name: "persistentDrawerRight",
  initialState: {
    isOpen: false,
    focusedNode: null as any,
    AWSServices: [] as Array<any>,
    AWSServiceFilter: [] as number[],
    drawerMode: "Service Details" as "Service Details" | "Add Service",
    graphServices: [] as Array<any>,
    graphEdges: [] as IGraphEdge[],
  },
  reducers: {
    setIsOpen: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerIsOpen>
    ) => {
      state.isOpen = action.payload.isOpen;
    },
    setFocusedNode: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerFocusedNode>
    ) => {
      state.focusedNode = action.payload.focusedNode;
    },
    setAwsServices: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerSetAwsServices>
    ) => {
      state.AWSServices = action.payload.AWSServices;
    },
    setAwsServiceProperty: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerSetAwsServiceProperty>
    ) => {
      const index = state.graphServices.findIndex(
        (service) => service.id === action.payload.focusedNode.id
      );
      state.focusedNode = action.payload.focusedNode;
      state.graphServices[index] = action.payload.focusedNode;
    },
    setDrawerMode: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerSetDrawerMode>
    ) => {
      state.drawerMode = action.payload.drawerMode;
    },
    setGraphServices: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerSetGraphServices>
    ) => {
      state.graphServices = action.payload.graphServices;
    },
    setGraphEdges: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerSetGraphEdges>
    ) => {
      state.graphEdges = action.payload.graphEdges;
    },
  },
  extraReducers: () => {},
});

export const {
  setIsOpen,
  setFocusedNode,
  setAwsServices,
  setAwsServiceProperty,
  setDrawerMode,
  setGraphServices,
  setGraphEdges,
} = persistentDrawerRightSlice.actions;

export const getIsOpen = (state: RootState) =>
  state.persistentDrawerRight.isOpen;

export const getFocusedNode = (state: RootState) =>
  state.persistentDrawerRight.focusedNode;

export const getAwsServices = (state: RootState) =>
  state.persistentDrawerRight.AWSServices;

export const getAwsServicesFilter = (state: RootState) =>
  state.persistentDrawerRight.AWSServiceFilter;

export const getDrawerMode = (state: RootState) =>
  state.persistentDrawerRight.drawerMode;

export const getGraphServices = (state: RootState) =>
  state.persistentDrawerRight.graphServices;

export const getGraphEdges = (state: RootState) =>
  state.persistentDrawerRight.graphEdges;

export const persistentDrawerRightReducer = persistentDrawerRightSlice.reducer;
