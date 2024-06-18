import { configureStore } from "@reduxjs/toolkit";
import { persistentDrawerRightReducer } from "./persistentDrawerRightSlice";
import { viewportReducer } from "./viewportSlice";
import { focusReducer } from "./focusSlice";

export const store = configureStore({
  reducer: {
    persistentDrawerRight: persistentDrawerRightReducer,
    viewport: viewportReducer,
    focus: focusReducer,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
