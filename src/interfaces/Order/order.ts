import type { AddressObject } from "../../interfaces/Map/AddressObject";
import { ORDER_STATUS } from "./ORDER_STATUS";
export interface Dimensions {
  lengthInCm: number;
  widthInCm: number;
  heightInCm: number;
}

export interface BuyerOrderState {
  value: {
    buyerId?: string;
    description: string;
    images: string[];
    estimatedValue: number;
    initialDeliveryFee: number;
    deliveryInstructions: string;
    productName: string;
    dimensions: Dimensions;
    productURL: string;
    quantity: number;
    placedAt: Date | null;
    preferredPickupPlace: AddressObject;
    isOrderAccepted: boolean;
    orderStatus: ORDER_STATUS;
  };
}
