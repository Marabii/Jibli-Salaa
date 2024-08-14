import { createSlice } from "@reduxjs/toolkit";

const sanitizeLocation = (location) => ({
  ...location,
  lat: typeof location.lat === "function" ? location.lat() : location.lat,
  lng: typeof location.lng === "function" ? location.lng() : location.lng,
});

export const TravelerTripSlice = createSlice({
  name: "travelerTrip",
  initialState: {
    value: {
      start: {
        formatted_address: "",
        lat: null,
        lng: null,
      },
      destination: {
        formatted_address: "",
        lat: null,
        lng: null,
      },
      spokenLanguages: [],
      departureDate: "",
      arrivalDate: "",
      areTaxesIncluded: false,
      isInternational: false,
    },
  },
  reducers: {
    setTravelerTrip: (state, action) => {
      const { start, destination, ...rest } = action.payload;

      if (start) {
        const sanitizedStart = sanitizeLocation(start);
        state.value.start = { ...state.value.start, ...sanitizedStart };
      }

      if (destination) {
        const sanitizedDestination = sanitizeLocation(destination);
        state.value.destination = {
          ...state.value.destination,
          ...sanitizedDestination,
        };
      }

      // Merge the rest of the payload into the state without overwriting start or destination
      state.value = {
        ...state.value,
        ...rest,
      };
    },
  },
});

export const { setTravelerTrip } = TravelerTripSlice.actions;

export default TravelerTripSlice.reducer;
