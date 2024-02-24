import { configureStore } from "@reduxjs/toolkit";
import { persistentDrawerRightReducer } from "./persistentDrawerRightSlice";

export const store = configureStore({
  reducer: {
    persistentDrawerRight: persistentDrawerRightReducer,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
