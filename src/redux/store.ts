import { configureStore } from "@reduxjs/toolkit";
import { graphReducer } from "./designer/slice/graphSlice";
import { viewportReducer } from "./designer/slice/viewportSlice";
import { accordianReducer } from "./designer/slice/accordianSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      graph: graphReducer,
      viewport: viewportReducer,
      accordian: accordianReducer,
    },
    devTools: true,
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
