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
        quantity: 1,
      },
      deliveryFee: 0,
      deliveryInstructions: "",
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
