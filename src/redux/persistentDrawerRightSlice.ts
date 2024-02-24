import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { IPersistentDrawerIsOpen } from "./payload";

export type PersistentDrawerRightState = {
  isOpen: boolean;
};

export const persistentDrawerRightSlice = createSlice({
  name: "persistentDrawerRight",
  initialState: {
    isOpen: false,
  },
  reducers: {
    setIsOpen: (
      state: PersistentDrawerRightState,
      action: PayloadAction<IPersistentDrawerIsOpen>
    ) => {
      state.isOpen = action.payload.isOpen;
    },
  },
  extraReducers: (builder) => {},
});

export const { setIsOpen } = persistentDrawerRightSlice.actions;

export const getIsOpen = (state: RootState) =>
  state.persistentDrawerRight.isOpen;

export const persistentDrawerRightReducer = persistentDrawerRightSlice.reducer;
