import { AddressObject } from "@/interfaces/Map/AddressObject";
import { BuyerOrderState } from "@/interfaces/Order/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";

const initialState: BuyerOrderState = {
  value: {
    description: "",
    images: [],
    estimatedValue: 0,
    initialDeliveryFee: 0,
    deliveryInstructions: "",
    productName: "",
    dimensions: {
      lengthInCm: 0,
      widthInCm: 0,
      heightInCm: 0,
    },
    productURL: "",
    quantity: 1,
    preferredPickupPlace: {
      formatted_address: "",
      lat: null,
      lng: null,
    },
    buyerId: "",
    placedAt: null,
    orderAccepted: false,
    orderStatus: ORDER_STATUS.PENDING,
    actualValue: 0,
    actualDeliveryFee: 0,
    _id: "",
  },
};

export const BuyerOrderSlice = createSlice({
  name: "buyerOrder",
  initialState,
  reducers: {
    setBuyerOrder: (
      state,
      action: PayloadAction<Partial<BuyerOrderState["value"]>>
    ) => {
      const { preferredPickupPlace, ...rest } = action.payload;

      if (preferredPickupPlace) {
        state.value.preferredPickupPlace = {
          ...state.value.preferredPickupPlace,
          ...(preferredPickupPlace as AddressObject),
        };
      }

      state.value = {
        ...state.value,
        ...rest,
      };
    },
  },
});

export const { setBuyerOrder } = BuyerOrderSlice.actions;

export default BuyerOrderSlice.reducer;
