import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  IPersistentDrawerFocusedNode,
  IPersistentDrawerIsOpen,
  IPersistentDrawerSetAwsServiceProperty,
  IPersistentDrawerSetAwsServices,
} from "./payload";
import _ from "lodash";

export type PersistentDrawerRightState = {
  isOpen: boolean;
  focusedNode: any;
  AWSServices: Array<any>;
};

export const persistentDrawerRightSlice = createSlice({
  name: "persistentDrawerRight",
  initialState: {
    isOpen: false,
    focusedNode: null as any,
    AWSServices: [] as Array<any>,
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
      state.AWSServices[index] = action.payload.focusedNode;
    },
  },
  extraReducers: () => {},
});

export const {
  setIsOpen,
  setFocusedNode,
  setAwsServices,
  setAwsServiceProperty,
} = persistentDrawerRightSlice.actions;

export const getIsOpen = (state: RootState) =>
  state.persistentDrawerRight.isOpen;

export const getFocusedNode = (state: RootState) =>
  state.persistentDrawerRight.focusedNode;

export const getAwsServices = (state: RootState) =>
  state.persistentDrawerRight.AWSServices;

export const persistentDrawerRightReducer = persistentDrawerRightSlice.reducer;
