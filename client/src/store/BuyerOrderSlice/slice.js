import { createSlice } from "@reduxjs/toolkit";

// Helper function to sanitize location data
const sanitizeLocation = (location) => ({
  ...location,
  lat: typeof location.lat === "function" ? location.lat() : location.lat,
  lng: typeof location.lng === "function" ? location.lng() : location.lng,
});

export const BuyerOrderSlice = createSlice({
  name: "buyerOrder",
  initialState: {
    value: {
      product: {
        name: "",
        description: "",
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
        },
        productURL: "",
        value: 0,
        quantity: 1,
      },
      deliveryFee: 0,
      deliveryInstructions: "",
      pickup: {
        formatted_address: "",
        lat: null,
        lng: null,
      },
    },
  },
  reducers: {
    setBuyerOrder: (state, action) => {
      const { product, pickup, ...rest } = action.payload;

      // Sanitize and update the pickup location if it's present in the action payload
      if (pickup) {
        const sanitizedPickup = sanitizeLocation(pickup);
        state.value.pickup = {
          ...state.value.pickup,
          ...sanitizedPickup,
        };
      }

      // Update the product if it's present in the action payload
      if (product) {
        state.value.product = {
          ...state.value.product,
          ...product,
          dimensions: {
            ...state.value.product.dimensions,
            ...product.dimensions,
          },
        };
      }

      // Merge the rest of the payload into the state without overwriting product or pickup
      state.value = {
        ...state.value,
        ...rest,
      };
    },
  },
});

export const { setBuyerOrder } = BuyerOrderSlice.actions;

export default BuyerOrderSlice.reducer;
