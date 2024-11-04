import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AddressObject } from "../../interfaces/Map/AddressObject";
import type { TravelerTripState } from "../../interfaces/Traveler/TravelerTripState";

const initialState: TravelerTripState = {
  value: {
    from: {
      formatted_address: "",
      lat: null,
      lng: null,
    },
    to: {
      formatted_address: "",
      lat: null,
      lng: null,
    },
    departure: "",
    arrival: "",
  },
};

export const TravelerTripSlice = createSlice({
  name: "travelerTrip",
  initialState,
  reducers: {
    setTravelerTrip: (
      state,
      action: PayloadAction<Partial<TravelerTripState["value"]>>
    ) => {
      const { from, to, ...rest } = action.payload;

      if (from) {
        state.value.from = { ...state.value.from, ...(from as AddressObject) };
      }

      if (to) {
        state.value.to = { ...state.value.to, ...(to as AddressObject) };
      }

      state.value = {
        ...state.value,
        ...rest,
      };
    },
  },
});

export const { setTravelerTrip } = TravelerTripSlice.actions;

export default TravelerTripSlice.reducer;
