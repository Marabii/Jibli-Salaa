// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
