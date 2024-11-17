import { configureStore } from "@reduxjs/toolkit";
import TravelerTripSlice from "./TravelerTripSlice/slice";
import websocketReducer from "./WebsocketSlice/WebsocketSlice";

export const store = configureStore({
  reducer: {
    travelerTrip: TravelerTripSlice,
    websocket: websocketReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
