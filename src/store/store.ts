import { configureStore } from "@reduxjs/toolkit";
import TravelerTripSlice from "./TravelerTripSlice/slice";
import BuyerOrderSlice from "./BuyerOrderSlice/slice";

export const store = configureStore({
  reducer: {
    travelerTrip: TravelerTripSlice,
    buyerOrder: BuyerOrderSlice,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
