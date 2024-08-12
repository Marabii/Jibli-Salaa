import { createSlice } from "@reduxjs/toolkit";

export const TravelerTripSlice = createSlice({
  name: "travelerTrip",
  initialState: {
    value: {
      start: {},
      destination: {},
      spokenLanguages: [],
      departureDate: "",
      arrivalDate: "",
      areTaxesIncluded: false,
      isInternational: false,
    },
  },
  reducers: {
    setTravelerTrip: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
        start: { ...state.value.start, ...action.payload.start },
        destination: {
          ...state.value.destination,
          ...action.payload.destination,
        },
      };
    },
  },
});

export const { setTravelerTrip } = TravelerTripSlice.actions;

export default TravelerTripSlice.reducer;
