import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ISchema } from "./models";

export type FocusState = {
  schema: ISchema | null;
};

export const focusSlice = createSlice({
  name: "focus",
  initialState: {
    schema: null,
  },
  reducers: {
    setFocus: (state: FocusState, action: PayloadAction<ISchema | null>) => {
      state.schema = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { setFocus } = focusSlice.actions;

export const getSchema = (state: RootState) => state.focus.schema;

export const focusReducer = focusSlice.reducer;
