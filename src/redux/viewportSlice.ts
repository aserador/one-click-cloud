import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type ViewPortState = {
  zoomLevel: number;
};

export const viewportSlice = createSlice({
  name: "viewport",
  initialState: {
    zoomLevel: 1,
  },
  reducers: {
    setZoomLevel: (state: ViewPortState, action: PayloadAction<number>) => {
      state.zoomLevel = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { setZoomLevel } = viewportSlice.actions;

export const getZoomLevel = (state: RootState) => state.viewport.zoomLevel;

export const viewportReducer = viewportSlice.reducer;
