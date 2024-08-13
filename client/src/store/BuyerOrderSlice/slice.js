import { createSlice } from "@reduxjs/toolkit";

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
      },
      status: "pending", // Default status when the order is created
      deliveryInstructions: "", // Any special instructions for the delivery
    },
  },
  reducers: {
    setBuyerOrder: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
        product: {
          ...state.value.product,
          ...action.payload.product,
        },
        trackingDetails: {
          ...state.value.trackingDetails,
          ...action.payload.trackingDetails,
        },
      };
    },
  },
});

export const { setBuyerOrder } = BuyerOrderSlice.actions;

export default BuyerOrderSlice.reducer;
