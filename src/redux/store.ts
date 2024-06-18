import { configureStore } from "@reduxjs/toolkit";
import { persistentDrawerRightReducer } from "./persistentDrawerRightSlice";
import { viewportReducer } from "./viewportSlice";

export const store = configureStore({
  reducer: {
    persistentDrawerRight: persistentDrawerRightReducer,
    viewport: viewportReducer,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
