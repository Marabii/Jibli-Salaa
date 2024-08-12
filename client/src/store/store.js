import { configureStore } from "@reduxjs/toolkit";
import TravelerTripSlice from "./TravelerTripSlice/slice";

export default configureStore({
  reducer: {
    travelerTrip: TravelerTripSlice,
  },
});
