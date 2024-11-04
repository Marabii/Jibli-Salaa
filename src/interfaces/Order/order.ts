import type { AddressObject } from "../../interfaces/Map/AddressObject";
import { ORDER_STATUS } from "./ORDER_STATUS";
export interface Dimensions {
  lengthInCm: number;
  widthInCm: number;
  heightInCm: number;
}

export interface BuyerOrderState {
  value: {
    buyerId: string;
    description: string;
    images: string[];
    estimatedValue: number;
    initialDeliveryFee: number;
    actualValue: number;
    actualDeliveryFee: number;
    deliveryInstructions: string | null;
    productName: string;
    dimensions: Dimensions;
    productURL: string | null;
    quantity: number;
    placedAt: Date | null;
    preferredPickupPlace: AddressObject;
    orderAccepted: boolean;
    orderStatus: ORDER_STATUS;
    _id: string | null;
  };
}
