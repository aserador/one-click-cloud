import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  IPersistentDrawerFocusedNode,
  IPersistentDrawerIsOpen,
  IPersistentDrawerSetAwsServiceFilter,
  IPersistentDrawerSetAwsServiceProperty,
  IPersistentDrawerSetAwsServices,
  IPersistentDrawerSetDrawerMode,
} from "./payload";
import _ from "lodash";

export type PersistentDrawerRightState = {
  isOpen: boolean;
  focusedNode: any;
  AWSServices: Array<any>;
  AWSServiceFilter: number[];
  drawerMode: "Service Details" | "Add Service";
};

export const persistentDrawerRightSlice = createSlice({
  name: "persistentDrawerRight",
  initialState: {
    isOpen: false,
    focusedNode: null as any,
    AWSServices: [] as Array<any>,
    AWSServiceFilter: [] as number[],
    drawerMode: "Service Details" as "Service Details" | "Add Service",
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
      const index = state.AWSServices.findIndex(
        (service) => service.id === action.payload.focusedNode.id
      );
      state.focusedNode = action.payload.focusedNode;
      state.AWSServices[index] = action.payload.focusedNode;
    },
    setAwsServiceFilter: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerSetAwsServiceFilter>
    ) => {
      state.AWSServiceFilter = action.payload.AWSServiceFilter;
    },
    setDrawerMode: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerSetDrawerMode>
    ) => {
      state.drawerMode = action.payload.drawerMode;
    },
  },
  extraReducers: () => {},
});

export const {
  setIsOpen,
  setFocusedNode,
  setAwsServices,
  setAwsServiceProperty,
  setAwsServiceFilter,
  setDrawerMode,
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

export const persistentDrawerRightReducer = persistentDrawerRightSlice.reducer;
