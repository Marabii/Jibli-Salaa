import { configureStore } from "@reduxjs/toolkit";
import TravelerTripSlice from "./TravelerTripSlice/slice";
import BuyerOrderSlice from "./BuyerOrderSlice/slice";

export default configureStore({
  reducer: {
    travelerTrip: TravelerTripSlice,
    buyerOrder: BuyerOrderSlice,
  },
});
